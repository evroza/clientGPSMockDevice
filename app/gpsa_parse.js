/**
 * Created by Evans R. on 4/11/2017.
 *
 * Sample>>     $GPGSA,A,3,01,02,03,04,05,06,07,08,09,10,11,12,1.0,1.0,1.0*30
 *
 *      -------------------------------------------------------------
 *              $GPGSA

                 GPS DOP and active satellites

                 eg1. $GPGSA,A,3,,,,,,16,18,,22,24,,,3.6,2.1,2.2*3C
                 eg2. $GPGSA,A,3,19,28,14,18,27,22,31,39,,,,,1.7,1.0,1.3*35


                 1    = Mode:
                 M=Manual, forced to operate in 2D or 3D
                 A=Automatic, 3D/2D
                 2    = Mode:
                 1=Fix not available
                 2=2D
                 3=3D
                 3-14 = IDs of SVs used in position fix (null for unused fields)
                 15   = PDOP
                 16   = HDOP
                 17   = VDOP
 *
 */

var example = '$GPGSA,A,3,01,02,03,04,05,06,07,08,09,10,11,12,1.0,1.0,1.0*30';

function parse_gpgsa(line) {
    // Splitting
    // Valid GPGSA line should have 17 elements
    let gpgsaObj = {};
    let gpgsaArr = [];

    gpgsaArr = line.split(',');

    gpgsaObj['type'] = gpgsaArr[0];
    gpgsaObj['modeSet'] = gpgsaArr[1]; //manual M or auto A
    gpgsaObj['modeCurr'] = gpgsaArr[2];
    gpgsaObj['sats'] = gpgsaArr.slice(3,15); //last index exclusive
    gpgsaObj['pdop'] = gpgsaArr[15];
    gpgsaObj['hdop'] = gpgsaArr[16];
    gpgsaObj['vdop'] = gpgsaArr[17];




    return gpgsaObj;
}

console.log(parse_gpgsa(example));
