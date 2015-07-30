/**
 * Created on 7/28/15. Copyright Michael Wynn - all rights reserved.
 * The methodology is based on cuid package by Eric Elliott with some modifications:
 * 1. Remove dependence on applitude framework.
 * 2. Use fixed 9-char timestamp for consistency until Fri, 22 Apr 5188 11:04:28 GMT.
 * 3. Remove the 'c' prefix; use freed up space for wider random block.
 * 4. No longer use machine/user agent hash; use freed up space for wider random block.
 * 5. Roll-over counter at 36^4 (1679616) rather than 1000, for improved collision resistance.
 * 6. Seed the counter block with a random number rather than 0, for improved collision resistance.
 * 7. Option for changing guid length from default value of 25
 *
 *    New structure: <timestamp(9)><counter(4)><random(remaining)>
 *
 */
'use strict';

(function () {
    var isNode = (typeof module === 'object')
        && (typeof process === 'object')
        && (typeof process.versions === 'object')
        && (typeof process.versions.node !== 'undefined');

    var
        defaultRandomBlocks = 3,
        randomBlocks = defaultRandomBlocks,
        typicalBlockSize = 4,
        timeStampBlockSize = 9,
        encodingBase = 36,
        blockNumericLimit = Math.pow(encodingBase, typicalBlockSize) - 1,
        counterSeed = Math.floor(randomNumber() / 2),
        counter = counterSeed;

    function randomNumber() {
        return Math.random() * blockNumericLimit;
    };

    function pad(num, size) {
        var s = "000000000" + num;
        return s.substr(s.length - size);
    };

    function base36toInt(string) {
        //convert base36 string to integer
        var result = 0;
        var digits = {};
        for (var i = 0; i < 10; i++) {
            digits[String(i)] = i;
        }
        for (i = 0; i < 26; i++) {
            digits[String.fromCharCode(i + 97)] = i + 10;
        }

        for (var i = 0; i < string.length; i++) {
            var num = digits[string.charAt(i)];
            result += Math.pow(36, string.length - i - 1) * num;
        }
        return Math.floor(result);
    };

    function createRandomBlock() {
        return pad(randomNumber().toString(encodingBase), typicalBlockSize);
    };

    function create() {
        var timestampBlock, counterBlock, randomBlock;
        timestampBlock = dateToTimestamp(new Date());

        counterBlock = pad(counter.toString(encodingBase), typicalBlockSize);
        counter = (counter < blockNumericLimit)? counter + 1 : 0;

        // Grab some more chars from Math.random()
        randomBlock = '';
        for (var i = 1; i <= randomBlocks; i++)
            randomBlock = randomBlock + createRandomBlock();

        return (timestampBlock + counterBlock + randomBlock);
    };

    function setCounterValue(value){
        // this is for testing counter roll-over code path; no practical purpose
        counter = value;
    };

    function setRandomBlocks(value) {
        randomBlocks = value || defaultRandomBlocks;
    };

    function getRandomBlocks() {
        return randomBlocks;
    };

    function dateToTimestamp(date){
        return pad((date.getTime()).toString(encodingBase),
            timeStampBlockSize);
    };

    function timestampToDate(timeStampBlock){
        return new Date(base36toInt(timeStampBlock));
    }

    function breakdown(guid){
        var timeStampBlock = guid.slice(0, timeStampBlockSize);
        var counterBlock = guid.slice(timeStampBlockSize, timeStampBlockSize + typicalBlockSize);
        var randomBlock = guid.slice(timeStampBlockSize + typicalBlockSize);
        return {
            timeStamp: timestampToDate(timeStampBlock),
            counter: base36toInt(counterBlock),
            random: randomBlock,
            randomBlockLength: randomBlock.length
        }
    };

    var exportObj = create;
    exportObj.setCounterValue = setCounterValue;
    exportObj.setRandomBlocks =  setRandomBlocks;
    exportObj.getRandomBlocks = getRandomBlocks;
    exportObj.dateToTimestamp = dateToTimestamp;
    exportObj.timestampToDate = timestampToDate;
    exportObj.breakdown = breakdown;

    if(isNode) {
        module.exports = exportObj;
    } else {
        this.$csim = (typeof $csim === 'object')? this.$csim: {};
        this.$csim.csim_guid = exportObj;
    }
}).call(global || window);