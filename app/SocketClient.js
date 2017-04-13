/**
 * Created by Evans R. on 4/14/2017.
 *
 * Used to Transmit UDP or TCP packets using Sockets
 */

class SocketClient {
    /*
        @params CONFIG - A config object with at least the TCP Server Address and port
     */
    constructor(config){
        this.serverIp = config.SERVER_IP || '127.0.0.1';
        this.serverPort = config.SERVER_PORT || '13370';
        this.delay = config.DELAY || '0'; //Whether to have a delay between packet transmission

    }

    udpTransmit(){

    }

    /**
     * To be implemented in future version.
     * TODO: Implement TCP Transmit client
     */
    tcpTransmit(){
        console.warn("TCP TRASMIT: Warning - This is just a stub - Operation not implemnted")
    }

}