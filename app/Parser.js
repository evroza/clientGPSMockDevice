/**
 * Created by Evans R. on 4/11/2017.
 */


module.exports = class Parser {

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
    _gpgsa_parser(line) {
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
    _gpgga_parser(line) {
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

    /**
     * Created by Evans R. on 4/11/2017.
     *
     * sample >>    $GPRMC,025555.540,A,1847.047,N,09900.991,E,038.9,177.1,030417,000.0,W*72
     *
     *
     * eg3. $GPRMC,220516,A,5133.82,N,00042.24,W,173.8,231.8,130694,004.2,W*70
     1    2    3    4    5     6    7    8      9     10  11 12


     1   220516     Time Stamp
     2   A          validity - A-ok, V-invalid
     3   5133.82    current Latitude
     4   N          North/South
     5   00042.24   current Longitude
     6   W          East/West
     7   173.8      Speed in knots
     8   231.8      True course
     9   130694     Date Stamp
     10  004.2      Variation
     11  W          East/West
     12  *70        checksum
     *
     *
     */
    _gprmc_parser(line) {
        // Splitting
        // Valid GPRMC line should have 12 elements
        let gpgrmcObj = {};
        let gpgrmcArr = [];

        gpgrmcArr = line.split(',');

        gpgrmcObj['type'] = gpgrmcArr[0];
        gpgrmcObj['time'] = gpgrmcArr[1];  //HHMMSS
        gpgrmcObj['validity'] = gpgrmcArr[2]; // Navigation receiver warning A = OK, V = warning
        gpgrmcObj['latitude'] = gpgrmcArr[3]; // Latitude 49 deg. 16.45 min North
        gpgrmcObj['northSouth'] = gpgrmcArr[4]; // Latitude 49 deg. 16.45 min North
        gpgrmcObj['longitude'] = gpgrmcArr[5]; // Longitude 123 deg. 11.12 min West
        gpgrmcObj['eastWest'] = gpgrmcArr[6]; // Longitude 123 deg. 11.12 min West
        gpgrmcObj['speedKnots'] = gpgrmcArr[7]; // Speed over ground, Knots
        gpgrmcObj['trueCourse'] = gpgrmcArr[8]; // Course Made Good, True
        gpgrmcObj['dateStamp'] = gpgrmcArr[9]; // Date of fix  19 November 1994 FORMAT -- DDMMYY
        gpgrmcObj['variation'] = gpgrmcArr[10];
        gpgrmcObj['checksum'] = gpgrmcArr[11].slice(2); // mandatory checksum
        gpgrmcObj['eastWestVariation'] = gpgrmcArr[11].slice(0,1); // Magnetic variation 20.3 deg East

        gpgrmcObj['lonFormatted'] = `${gpgrmcObj['longitude']}, ${gpgrmcObj['eastWest']}`;
        gpgrmcObj['latFormatted'] = `${gpgrmcObj['latitude']}, ${gpgrmcObj['northSouth']}`;

        return gpgrmcObj;

    }

    /**
     * @input locSetArr an array of location sets composed of [$GPGGA line, $GPGSA line, $GPRMC line]
     * @returns locObj array - an array of location objects
     *
     * This takes in an ARRAY of nmea lines and returnes an ARRAY of location objects
     * NOTE: It works on the asumption that input file has recurring sets of three location attributes
     *        i.e. [[$GPGGA line, $GPGSA line, $GPRMC line], ... [$GPGGA line_n, $GPGSA line_n, $GPRMC line_n]]
     * The order of elements in each array is important.
     * Will likely be revised in the future to be more intelligent rather than depending on line ordering format
     *
     * Sample expected input array format:
     *  [
     [  '$GPGGA,025555.540,1847.047,N,09900.991,E,1,12,1.0,0.0,M,0.0,M,,*65',
     '$GPGSA,A,3,01,02,03,04,05,06,07,08,09,10,11,12,1.0,1.0,1.0*30',
     '$GPRMC,025555.540,A,1847.047,N,09900.991,E,038.9,177.1,030417,000.0,W*72'
     ],
     [  '$GPGGA,025555.540,1847.047,N,09900.991,E,1,12,1.0,0.0,M,0.0,M,,*65',
     '$GPGSA,A,3,01,02,03,04,05,06,07,08,09,10,11,12,1.0,1.0,1.0*30',
     '$GPRMC,025555.540,A,1847.047,N,09900.991,E,038.9,177.1,030417,000.0,W*72'
     ]
     ]
     */
    getLocArr(inputArr, imei){
        let outputArr = [];
        let locationObj = {};
        let locationArrTemp = [];
        let len = Math.floor(inputArr.length/3);
        // generate random values for prefix1 since not provided in input file. For test purposes only
        let prefix1Presets = ['$$i163', '$$A163', '$$C163', '$$E163', '$$I163', '$$H163'];


        if (Math.floor(inputArr.length/3) !== (inputArr.length/3)){
            console.error('The input GPS File is incorrectly formatted, the parsing might not work correctly!');
            throw new Error('FORMAT ERROR: The input file is incorrectly formatted. Lines incorrectly ordered or some info missing.');
        } else {

            for(let i = 0; i<= len; i++){
                //return array slice of gpgsa gpgrmc and gpgga
                locationArrTemp = inputArr.slice(i*3, i*3+3);
                let autoMileage = 32910;

                // deal with this slice:
                for (let k = 0; k < locationArrTemp.length; k++){
                    //Will build loc obj here
                    let gpggaObj = this._gpgga_parser(locationArrTemp[0]);
                    let gpgsaObj = this._gpgsa_parser(locationArrTemp[1]);
                    let gpgrmcObj = this._gprmc_parser(locationArrTemp[2]);

                    let hdop = gpgsaObj['hdop'] ? gpgsaObj['hdop'] : gpgsaObj['hdop'];

                    let latitude = gpgrmcObj['latitude'] !== '' ? gpgrmcObj['latitude'] : gpggaObj['latitude'];
                    let longitude = gpgrmcObj['longitude'] !== '' ? gpgrmcObj['longitude'] : gpggaObj['longitude'];

                    let numSats = gpggaObj['numSatelites'] ? gpggaObj['numSatelites']: gpgsaObj['sats'].length;

                    // Time format in
                    //DDMMYY && HHMMSS
                    let ds =gpgrmcObj['dateStamp'] , ts = gpgrmcObj['time'];
                    let dateTime =  new Date('20' + ds.slice(4,6),ds.slice(2,4), ds.slice(0, 2),
                        ts.slice(0,2), ts.slice(2, 4), ts.slice(4,6)).valueOf();

                    //Increase mileage by 30 in every submission

                    locationObj = {
                        prefix1: prefix1Presets[Math.floor(Math.random() * prefix1Presets.length)],
                        imei: imei,
                        code: 'AAA',
                        eventCode: 34,
                        latitude: latitude,
                        longitude: longitude,
                        dateTime: dateTime,
                        posStatus: gpgrmcObj['validity'],
                        numSats: numSats,
                        gsmStrength: Math.floor(Math.random() * 30),
                        speed: gpgrmcObj['speedKnots'],
                        direction: gpgrmcObj['trueCourse'],
                        hdop: hdop,
                        altitude: gpggaObj['altitude'] | 5,
                        mileage: autoMileage,
                        baseStationInfo: '520|15|2905|0087330F', //have switched pos with runtime
                        runTime: '0001',
                        ioPortStatus: '0000|0000|0000|018A|04B5', // have switched positions with unknown val
                        unknownVal: '00000001',
                        unknownVal2: 1,
                        analogInputVal: '0000*9E' + gpggaObj['checkSum']

                    };
                    autoMileage += 30;

                }


                //will finally return location Object instead of array
                outputArr.push(locationObj);

            }
        }

        return outputArr;

    }


}