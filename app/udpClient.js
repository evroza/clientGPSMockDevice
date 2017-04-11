/**
 * Created by Evans R. on 4/11/2017.
 */
var dgram = require('dgram');
var fs = require('fs');
var csv = require('csv');

var PORT = 13370;
var HOST = '127.0.0.1';

var csvLines = [];


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

    var gpsMessBuffer = new Buffer(csvLines);

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







// Server transmit actions - should be in separate file

// var message = new Buffer("I'll be sending you GPS coordinates in a bit!");












