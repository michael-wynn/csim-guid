# What Is It?
csim-guid is a collision-resistant GUID (Globally-Unique-Identifier) generation tool based on [Eric Elliott][eric]'s [cuid][cuid], with additional consistency and flexibility measures which are important to large-scale enterprise applications.  Although intended for the RAD platform _CSIMplex_ (a work-in-progress), it is a standalone tool that may be use in any Node or browser application. 

## Motivations
Of course, the [same motivations stated by Eric](https://www.npmjs.com/package/cuid#motivation) apply.  This work also aims to achieve these additional benefits:

* Guarantee that reconstruction of date information is reliable (until Fri, 22 Apr 5188 GMT).
* Guarantee that GUIDs generated by same machine process will be alphabetically sequential. 
* Provide scaling option (higher scale = higher collision resistance/longer GUID).

## Status
Stable

## Installing

```bash
$ npm install --save csim-guid
```
## Usage
### NodeJS
```js
var guidTool = require('csim-guid');

/*Optional step: set scale option once at app start.
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

```

### Browsers
To use csim-guid in browser simply include the following tag:
```html
<script type='text/javascript' src='path_to_the_included_file_csim-guid.js'/>
```
After that it is exactly the same as in NodeJS.  
Note: the included file csim-guid is located at node_modules/csim-guid/browser folder. It was prepared using [browserify][browserify].  You can, of course, use browserify to distribute csim-guid as part of a bundle just like any other node module. 

## Scale Option
The default scale is 3, meaning the random block of generated GUID will have 4x3, or 12 characters.  A scale of 5 then implies 20-character random block.  Once in production it will need to stay fixed forever.  You should consider the following when deciding on the scale option:
* The timestamp & counter blocks together already guarantee that all GUID's generated by the same machine-process are unique.  The random blocks are to alleviate collision between GUID's generated at the precise same millisecond (according to the machine clock) by different machine-processes.
* Default scale of 3 should be adequate for most enterprise internal applications.
* Determine scale based on likelihood of simultaneous GUID generation at multiple machines.  For example, a consumer app with multi-million concurrent, GUID-generating clients will demand the use of a higher scale.

## Internal Differences Compared to cuid

* Timestamp block is padded to 9-character fix length, ensuring sequential consistency until Apr 22 5188 (cuid does not pad the timestamp block, thus consistency will be broken on May 25 2059).
* Counter is reset on every timestamp change, effectively preventing rollover from occurring.  In cuid there is no such preemptive reset and rollover may take place at an unfortunate moment, breaking sequential characteristic.
* Counter resets at a process-dependent pseudo-random value (computed at startup) rather than at 0.  This should produce similar effect to cuid's "finger print".
* There is no "finger print" block; the space is used for additional random characters instead. 
* There is no 'c' prefix. 
* There is no slug function.
* There is no reference to applitude framework.


### Credit
[Eric Elliott][eric]: author of original work [cuid][cuid], the base of this work.

[cuid]: https://www.npmjs.com/package/cuid "Original cuid npm package"
[eric]: https://www.npmjs.com/~ericelliott
[browserify]: https://www.npmjs.com/package/browserify
