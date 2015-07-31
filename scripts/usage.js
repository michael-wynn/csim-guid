var guidTool = require('../index');

/*Optional: set scale option once at app start.
Scale 1-2: use ONLY if database is expected to be small AND the user may be required to
    manually read/type id's from time to time. Generally not recommended!
Scale 3 (default): adequate for typical enterprise apps.
Scale 4-5: suitable for large enterprise apps / line-of-business clouds.
Scale 6+: suitable for very big public cloud apps (i.e. facebook/amazon scale). */
guidTool.setScale(4);    /* optional */

//Generate a new GUID:
var myGuid = guidTool();
console.log('1. My GUID: ', myGuid);

//Breakdown (deconstruct) a  GUID:
var details = guidTool.breakdown(myGuid);
console.log('2. Breakdown:\n', details);

/* Sample output:
 1. My GUID:  0icrrhi3vfddv1jor4n29zaorto6r
 2. Breakdown:
 { guid: '0icrrhi3vfddv1jor4n29zaorto6r',
 scale: 4,
 timestamp: '0icrrhi3v',
 counter: 'fddv',
 random: '1jor4n29zaorto6r',
 date: Fri Jul 31 2015 08:04:54 GMT-0700 (PDT),
 counterDecimal: 717187 }
*/
