/**
 * Created by Evans R. on 4/11/2017.
 */

var PORT = 13370;
var HOST = '127.0.0.1';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
    // console.log(remote.address + ':' + remote.port +' - ' + message);
    console.log(''+ message);

});

server.bind(PORT, HOST);