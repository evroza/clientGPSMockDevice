/**
 * Created by Evans R. on 4/11/2017.
 * Each positioning data is composed of three lines i.e GPGSA, GPRMC, $GPGGA
 * Have to read the data 3 lines at a time and parse
 */
var dgram = require('dgram');
var fs = require('fs');
var csv = require('csv-stream');
var Parser = require('./Parser.js');

parser = new Parser();

var PORT = 13370;
var HOST = '127.0.0.1';

var csvLines = [];
var locArr = [];


var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('../testData/nmea.txt')
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

    for(let line in csvLines){
        // gpsMessBuffer = line;

        var client = dgram.createSocket('udp4');
        client.send(csvLines[line], 0, csvLines[line].length, PORT, HOST, function(err, bytes) {
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
        for (let k = 0; k <= locationArrTemp.length; k++){
            //Will build loc obj here
            let gpggaObj = parser.gpgga_parser(locationArrTemp[0]);
            let gpgsaObj = parser.gpgsa_parser(locationArrTemp[1]);
            let gpgrmcObj = parser.gpgrmc_parser(locationArrTemp[2]);

            let hdop = gpgsaObj['hdop'] ? gpgsaObj['hdop'] : gpgsaObj['hdop'];

            let lat = gpggaObj['latitude'] !== '' ? gpggaObj['latitude'] : gpgrmcObj['latitude'];
            let long = gpggaObj['longitude'] !== '' ? gpggaObj['longitude'] : gpgrmcObj['longitude'];

            let numSats = gpggaObj['numSatelites'] ? gpggaObj['numSatelites']: gpgsaObj['sats'].length;

            locationObj = {
                code: 'AAA',
                eventCode: 34,
                latitude: lat,
                longitude: lon,
                dateTime: ,
                posStatus: gpgrmcObj['validity'],
                numSats: numSats,
                gsmStrength: Math.floor(Math.random() * 10),
                speed: gpgrmcObj['speedKnots'],
                direction: ,
                hdop: hdop,
                altitude: 5,
                mileage: '-14',
                runTime: 0,
                baseStationInfo: '0000',
                ioPortStatus: '0|0|10133|4110',
                analogInputVal:

            };

        }


        //will finally return location Object instead of array
        outputArr.push(locationArrTemp);

    }







}















