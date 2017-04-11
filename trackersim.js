/**
 * Created by Evans R. on 4/11/2017.
 * Each positioning data is composed of three lines i.e GPGSA, GPRMC, $GPGGA
 * Have to read the data 3 lines at a time and parse
 */
var dgram = require('dgram');
var fs = require('fs');
var csv = require('csv-stream');
var schedule = require('node-schedule');
var program = require('commander');
var Parser = require('./app/Parser.js');


// READ ALL INPUT ARGS FIRST
program.version('0.0.1')
    .usage('[options] <NMEA_File IMEI ...>')
    .option('-s, --server-ip <address>', 'Target server\'s Ip', /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/, '127.0.0.1')
    .option('-p, --server-port <n>', 'server_port', parseInt, '13370')
    .option('-i, --interval_sec <n>', 'Interval to send cordinates to server', /\b\d+/, '10')
    .option('-d, --start-date, <date>', 'start_date Format >> YYYYMMDD', /\b\d{8}/, 'currentDate')
    .option('-t, --start-time <time>', 'start time Format >>  HHMMSS', /\b\d{6}/, 'startTime')
    .option('-l, --loop', 'Loop through the file')
    .parse(process.argv);

//interval_sec default 10


//Note if not passed in default value is false or specified default in .option last arg
const CONFIG = {
    SERVER_IP: program.serverIp,
    SERVER_PORT: program.serverPort,
    START_DATE: (program.startDate == 'currentDate' || !program.startDate) ? null : program.startDate,
    START_TIME: (program.startTime == 'startTime' || !program.startTime) ? null : program.startTime,
    INTERVAL: program.interval_sec,
    LOOP: program.loop || false,
    FILE: program.args[0] ? program.args[0].replace(new RegExp("'", 'g'), "") : null,
    IMEI: program.args[1] || null
};
var parser = new Parser();



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
    console.log('Script is scheduled to start immedietely');
    console.log('Scheduled Execution Starting ...');

    App();
}





function App() {

var csvLines = [];
var locArr = [];




var stats = fs.stat(CONFIG.FILE, function(err,stat){
    if (stat && stat.isFile() ) {
        var lineReader = require('readline').createInterface({
            input: require('fs').createReadStream(CONFIG.FILE)
        });

        lineReader.on('line', function (line) {
            // add each line to our object array
            csvLines.push(line);
        });

        lineReader.on('close', function () {
            // first create loc objects array
            createLoc(csvLines, locArr, parser);
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
                    let message = `${locArr[counter].prefix1},${locArr[counter].imei},${locArr[counter].code},${locArr[counter].eventCode},${locArr[counter].latitude},${locArr[counter].longitude},${locArr[counter].dateTime},${locArr[counter].posStatus},${locArr[counter].numSats},${locArr[counter].gsmStrength},${locArr[counter].speed},${locArr[counter].direction},${locArr[counter].hdop},${locArr[counter].altitude},${locArr[counter].mileage},${locArr[counter].runTime},${locArr[counter].baseStationInfo},${locArr[counter].ioPortStatus},${locArr[counter].analogInputVal}\r\n`;
                    client.send(message, 0, message.length, CONFIG.SERVER_PORT, CONFIG.SERVER_IP, function(err, bytes) {
                        if (err) throw err;
                        console.log(message);
                        client.close();
                    });
                }

                //increment counter
                counter += 1;

            }, CONFIG.INTERVAL*1000);




        });

    } else {
        console.error("The file you specified does not exist!");
    }
});



function createLoc(inputArr, outputArr, parser) {
    let locationObj = {};
    let locationArrTemp = [];
    let len = Math.floor(inputArr.length/3);
    let prefix1Presets = ['$$i163', '$$A163', '$$C163', '$$E163', '$$I163', '$$H163'];


    if (Math.floor(inputArr.length/3) !== (inputArr.length/3)){
        console.error('The input GPS File is incorrectly formatted, the parsing might not work correctly!');
    }
    /*
      Example data structure:
         $GPGGA,025555.540,1847.047,N,09900.991,E,1,12,1.0,0.0,M,0.0,M,,*65
         $GPGSA,A,3,01,02,03,04,05,06,07,08,09,10,11,12,1.0,1.0,1.0*30
         $GPRMC,025555.540,A,1847.047,N,09900.991,E,038.9,177.1,030417,000.0,W*72

     */


    for(let i = 0; i<= len; i++){
        //return array slice of gpgsa gpgrmc and gpgga
        // use i as offest in our input array
        let start = i
        locationArrTemp = inputArr.slice(i*3, i*3+3);

        // deal with this slice:
        for (let k = 0; k < locationArrTemp.length; k++){
            //Will build loc obj here
            let gpggaObj = parser.gpgga_parser(locationArrTemp[0]);
            let gpgsaObj = parser.gpgsa_parser(locationArrTemp[1]);
            let gpgrmcObj = parser.gpgrmc_parser(locationArrTemp[2]);

            let hdop = gpgsaObj['hdop'] ? gpgsaObj['hdop'] : gpgsaObj['hdop'];

            let latitude = gpggaObj['latitude'] !== '' ? gpggaObj['latitude'] : gpgrmcObj['latitude'];
            let longitude = gpggaObj['longitude'] !== '' ? gpggaObj['longitude'] : gpgrmcObj['longitude'];

            let numSats = gpggaObj['numSatelites'] ? gpggaObj['numSatelites']: gpgsaObj['sats'].length;

            // Time format in
            let ds =gpgrmcObj['dateStamp'] , ts = gpgrmcObj['time'];
            let dateTime =  new Date(ds.slice(4),ds.slice(2,4), ds.slice(0, 2),
                                     ts.slice(4), ts.slice(2, 4), ts.slice(0,2)).valueOf();


            locationObj = {
                prefix1: prefix1Presets[Math.floor(Math.random() * prefix1Presets.length)],
                imei: CONFIG.IMEI,
                code: 'AAA',
                eventCode: 34,
                latitude: latitude,
                longitude: longitude,
                dateTime: dateTime,
                posStatus: gpgrmcObj['validity'],
                numSats: numSats,
                gsmStrength: Math.floor(Math.random() * 10),
                speed: gpgrmcObj['speedKnots'],
                direction: gpgrmcObj['trueCourse'],
                hdop: hdop,
                altitude: 5,
                mileage: '-14',
                runTime: 0,
                baseStationInfo: '0000',
                ioPortStatus: '0|0|10133|4110',
                analogInputVal: gpggaObj['checkSum']

            };

        }


        //will finally return location Object instead of array
        outputArr.push(locationObj);

    }

}

};