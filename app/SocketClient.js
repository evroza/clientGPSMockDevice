/**
 * Created by Evans R. on 4/14/2017.
 *
 * Used to Transmit UDP or TCP packets using Sockets
 */
const dgram = require('dgram');


module.exports = class SocketClient {
    /*
        @params CONFIG - A config object with at least the TCP Server Address and port
     */
    constructor(config){
        this.serverIp = config.SERVER_IP || '127.0.0.1';
        this.serverPort = config.SERVER_PORT || '13370';
        this.delay = config.DELAY || '0'; //Whether to have a delay between packet transmission

    }

    /**
     * Transmits UDP packets to predefined server
     */
    udpTransmit(data){
        this.udpClient = dgram.createSocket('udp4');
        var that = this;

        this.udpClient.send(data.message, 0, data.message.length, this.serverPort, this.serverIp, function(err, bytes) {
            if (err) throw err;
            console.log(data.message);
            that.udpClient.close();
        });

    }

    /**
     * To be implemented in future version.
     * TODO: Implement TCP Transmit client
     *
     * This transmits TCP packets to specified server's port
     */
    tcpTransmit(){
        console.warn("TCP TRASMIT: Warning - This is just a stub - Operation not implemnted")
    }

}