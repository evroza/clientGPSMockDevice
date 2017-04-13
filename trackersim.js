/**
 * Created by Evans R. on 4/11/2017.
 * Each positioning data is composed of three lines i.e GPGSA, GPRMC, $GPGGA
 * Have to read the data 3 lines at a time and parse
 */
const dgram = require('dgram');
const csv = require('csv-stream');
const schedule = require('node-schedule');
const program = require('commander');
const Parser = require('./app/Parser');
const FileReader = require('./app/FileReader');


// READ ALL INPUT ARGS FIRST
program.version('0.0.1')
    .usage('[options] <NMEA_File IMEI ...>')
    .option('-s, --server-ip <address>', 'Target server\'s Ip', /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/, '127.0.0.1')
    .option('-p, --server-port <n>', 'server_port', /\b\d{1,5}/, 13370)
    .option('-i, --interval_sec <n>', 'Interval to send cordinates to server', /\b\d+/, '10')
    .option('-d, --start-date, <date>', 'start_date Format >> YYYYMMDD', /\b\d{8}/, 'currentDate')
    .option('-t, --start-time <time>', 'start time Format >>  HHMMSS', /\b\d{6}/, 'startTime')
    .option('-l, --loop', 'Loop through the file')
    .parse(process.argv);

//interval_sec default 10


//Note if not passed in default value is false or specified default in .option last arg
const CONFIG = {
    SERVER_IP: program.serverIp,
    SERVER_PORT: program.serverPort || 13370,
    START_DATE: (program.startDate == 'currentDate' || !program.startDate) ? null : program.startDate,
    START_TIME: (program.startTime == 'startTime' || !program.startTime) ? null : program.startTime,
    INTERVAL: program.interval_sec,
    LOOP: program.loop || false,
    FILE: program.args[0] ? program.args[0].replace(new RegExp("'", 'g'), "") : null,
    IMEI: program.args[1] || null
};

var parser = new Parser();
var reader = new FileReader(CONFIG.FILE);



console.log("initializing ....");

//Check if start date/ time is set and schedule, otherwise just run immediately

if(CONFIG.START_DATE || CONFIG.START_TIME){
    // remember months are zero based thus jan is 0
    var date = CONFIG.START_DATE ? new Date(CONFIG.START_DATE.slice(0,4), CONFIG.START_DATE.slice(4,6)-1, CONFIG.START_DATE.slice(6)) : new Date();

    date = CONFIG.START_TIME ? date.setHours(CONFIG.START_TIME.slice(0,2), CONFIG.START_TIME.slice(2,4), CONFIG.START_TIME.slice(4,6)) : date;

    //schedule
    console.log('Script scheduled to start at: ' + date);

    var j = schedule.scheduleJob(date, function(){
        console.log('Scheduled Execution Starting ...');
        App();
    });

} else {
    console.log('Script is scheduled to start immediately');
    console.log('Scheduled Execution Starting ...');

    reader.then((instance) => {
        return instance.getLinesArr();
    }).then((csvLines) => {
        App(csvLines);
    });


}





function App(csvLines) {

    var locArr = [];

    // first create loc objects array
    locArr = parser.getLocArr(csvLines, CONFIG.IMEI);
    //Send the packets in intervals
    let lengthArr = locArr.length,
        counter =0;


    let timer = setInterval(function () {
        if(counter <= lengthArr){
            // In the case looping is enabled, then reset counter here
            if(CONFIG.LOOP === true && (counter === lengthArr)){
                // reset counter to loop
                counter = 0;
                console.log("Restarting transmit. End of file reached ... ");
            } else if(CONFIG.LOOP === false && counter === (lengthArr - 1)){
                //Stop at end of file
                console.log("Ending transmit. End of file reached ... ");
                clearInterval(timer);
            }
            var client = dgram.createSocket('udp4');
            let message = `${locArr[counter].prefix1},${locArr[counter].imei},${locArr[counter].code},${locArr[counter].eventCode},${locArr[counter].latitude},${locArr[counter].longitude},${locArr[counter].dateTime},${locArr[counter].posStatus},${locArr[counter].numSats},${locArr[counter].gsmStrength},${locArr[counter].speed},${locArr[counter].direction},${locArr[counter].hdop},${locArr[counter].altitude},${locArr[counter].mileage},${locArr[counter].baseStationInfo},${locArr[counter].runTime},${locArr[counter].ioPortStatus},${locArr[counter].unknownVal},,${locArr[counter].unknownVal2},${locArr[counter].analogInputVal}\r\n`;
            client.send(message, 0, message.length, CONFIG.SERVER_PORT, CONFIG.SERVER_IP, function(err, bytes) {
                if (err) throw err;
                console.log(message);
                client.close();
            });
        }

        //increment counter
        counter += 1;

    }, CONFIG.INTERVAL*1000);


};