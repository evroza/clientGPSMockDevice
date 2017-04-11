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

var example = '$GPRMC,025555.540,A,1847.047,N,09900.991,E,038.9,177.1,030417,000.0,W*72';

function parse_gprmc(line) {
    // Splitting
    // Valid GPRMC line should have 12 elements
    let gpgrmcObj = {};
    let gpgrmcArr = [];

    gpgrmcArr = line.split(',');

    gpgrmcObj['type'] = gpgrmcArr[0];
    gpgrmcObj['time'] = gpgrmcArr[1];
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

console.log(parse_gprmc(example));
