/**
 * Created by Evans R. on 4/11/2017.
 *
 * sample >>   $GPGGA,025555.540,1847.047,N,09900.991,E,1,12,1.0,0.0,M,0.0,M,,*65
 *
 *
 *      ---------------------------------------------------------------
 *
 *      Name	Example Data	Description
         Sentence Identifier	$GPGGA	Global Positioning System Fix Data
         Time	170834	17:08:34 Z
         Latitude	4124.8963, N	41d 24.8963' N or 41d 24' 54" N
         Longitude	08151.6838, W	81d 51.6838' W or 81d 51' 41" W
         Fix Quality:
         - 0 = Invalid
         - 1 = GPS fix
         - 2 = DGPS fix	1	Data is from a GPS fix
         Number of Satellites	05	5 Satellites are in view
         Horizontal Dilution of Precision (HDOP)	1.5	Relative accuracy of horizontal position
         Altitude	280.2, M	280.2 meters above mean sea level
         Height of geoid above WGS84 ellipsoid	-34.0, M	-34.0 meters
         Time since last DGPS update	blank	No last update
         DGPS reference station id	blank	No station id
         Checksum	*75	Used by program to check for transmission errors

 *      
 *
 *
 *
 */

var example = '$GPGGA,025555.540,1847.047,N,09900.991,E,1,12,1.0,0.0,M,0.0,M,,*65';

function parse_gpgga(line) {
    // Splitting
    // Valid GPGGGA line should have 17 elements
    let gpggaObj = {};
    let gpggaArr = [];

    gpggaArr = line.split(',');

    gpggaObj['type'] = gpggaArr[0];
    gpggaObj['time'] = gpggaArr[1];
    gpggaObj['latitude'] = gpggaArr[2];
    gpggaObj['northSouth'] = gpggaArr[3];
    gpggaObj['latFormatted'] = `${gpggaArr[2]}, ${gpggaArr[3]}`;
    gpggaObj['longitude'] = gpggaArr[4];
    gpggaObj['eastWest'] = gpggaArr[5];
    gpggaObj['longFormatted'] = `${gpggaArr[4]}, ${gpggaArr[5]}`;
    gpggaObj['fixQuality'] = gpggaArr[6];
    gpggaObj['numSatelites'] = gpggaArr[7];
    gpggaObj['hdop'] = gpggaArr[8]; //HDOP -- Horizontal dilution of precision
    gpggaObj['altitude'] = gpggaArr[9];
    gpggaObj['heightGeoids'] = gpggaArr[10]; // Height of geoid above WGS84 ellipsoid
    gpggaObj['timeSinceLastGpsUpdate'] = gpggaArr[11]; // Time since last DGPS update
    gpggaObj['refStation'] = gpggaArr[12]; // DGPS reference station id
    gpggaObj['checkSum'] = gpggaArr[14].slice(1); //Checksum


    return gpggaObj;
}


console.log(parse_gpgga(example));