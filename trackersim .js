/**
 * Created by Evans R. on 4/11/2017.
 * Each positioning data is composed of three lines i.e GPGSA, GPRMC, $GPGGA
 * Have to read the data 3 lines at a time and parse
 */
var dgram = require('dgram');
var fs = require('fs');
var csv = require('csv-stream');
var Parser = require('./app/Parser.js');
var program = require('commander');

//Read in input args
program
    .version('0.0.1')
    .usage('[options] <NMEA_File IMEI ...>')
    .option('-s, --server-ip', 'server_ip')
    .option('-p, --server-port', 'server_port')
    .option('-d, --start_date', 'start_date')
    .option('-t, --start_time', 'loop')
    .option('-l, --loop', 'start_time')
    .parse(process.argv);


parser = new Parser();

process.argv.forEach(function (val, index, array) {
    //capture input args

    console.log(array.slice(2));

});/*

var PORT =  13370;
var HOST = '127.0.0.1';

var csvLines = [];
var locArr = [];


var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./testData/nmea.txt')
});

lineReader.on('line', function (line) {
    console.log('Line from file:', line);

    // add each line to our object array
    csvLines.push(line);
});

lineReader.on('close', function () {

    //file read actions
//will transfer to separate class later

    // var gpsMessBuffer = new Buffer(csvLines);

    // first create loc objects array
    createLoc(csvLines, locArr, parser);

    for(let obj in locArr){
        let message = `${locArr[obj].prefix1},${locArr[obj].prefix2},${locArr[obj].code},${locArr[obj].eventCode},${locArr[obj].latitude},${locArr[obj].longitude},${locArr[obj].dateTime},${locArr[obj].posStatus},${locArr[obj].numSats},${locArr[obj].gsmStrength},${locArr[obj].speed},${locArr[obj].direction},${locArr[obj].hdop},${locArr[obj].altitude},${locArr[obj].mileage},${locArr[obj].runTime},${locArr[obj].baseStationInfo},${locArr[obj].ioPortStatus},${locArr[obj].analogInputVal}\r\n`;

        var client = dgram.createSocket('udp4');
        client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
            if (err) throw err;
            console.log('UDP message sent to ' + HOST +':'+ PORT);
            client.close();
        });

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

    // $GPGGA,025555.540,1847.047,N,09900.991,E,1,12,1.0,0.0,M,0.0,M,,*65
    // $GPGSA,A,3,01,02,03,04,05,06,07,08,09,10,11,12,1.0,1.0,1.0*30
    // $GPRMC,025555.540,A,1847.047,N,09900.991,E,038.9,177.1,030417,000.0,W*72


    for(let i = 0; i<= len; i++){
        console.log(i);

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
                prefix2: '863835027175251',
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

















*/