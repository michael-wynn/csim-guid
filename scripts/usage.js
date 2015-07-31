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

//Deconstruct a  GUID using: breakdown
var details = guidTool.breakdown(myGuid);
console.log('2. Breakdown:\n', details);

//date-range database search on primary key using: dateToTimestamp
var rangeStart = guidTool.dateToTimestamp(new Date('2015-04-01'));
var rangeEnd = guidTool.dateToTimestamp(new Date('2015-05-01'));
var sampleQuery = "SELECT * WHERE ID >= '"
    + rangeStart + "' & ID < '"
    + rangeEnd + "'";
console.log('3. Sample date range db search query:\n', sampleQuery);

/* Sample output:
 1. My GUID:  0ics8gx4n4ahny66ro1orv7vi5cdi
 2. Breakdown:
 { guid: '0ics8gx4n4ahny66ro1orv7vi5cdi',
 scale: 4,
 timestamp: '0ics8gx4n',
 counter: '4ahn',
 random: 'y66ro1orv7vi5cdi',
 date: Fri Jul 31 2015 16:00:21 GMT-0700 (PDT),
 counterDecimal: 200219 }
 3. Sample date range db search query:
 SELECT * WHERE ID >= '0i7xyvpc0' & ID < '0i94u39c0'
*/

