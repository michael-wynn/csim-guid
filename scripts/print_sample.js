/**
 * Created on 7/28/15. Copyright Michael Wynn - all rights reserved.
 */
'use strict';

var csim_guid = require('./../index');

if(typeof csim_guid != 'function') {
    console.log('Simulating browser mode...');
    csim_guid = global.$csim.csim_guid;
}

var blocksOverride = +process.argv[2];
if(blocksOverride > 0)
    csim_guid.setRandomBlocks(blocksOverride);

var guid = csim_guid();
console.log('GUID: ', guid);
console.log('Breakdown: ', csim_guid.breakdown(guid));
