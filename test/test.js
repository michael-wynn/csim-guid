/**
 * Created on 7/29/15. Copyright Michael Wynn - all rights reserved.
 */
'use strict';
var assert = require('assert');
var g = require('../index');
var counterMax = Math.pow(36,4) - 1;

describe('csim-guid tests', function(){

    var now,
        guid1,
        breakdown1,
        guid2,
        breakdown2,
        guid3,
        breakdown3;

    describe('Guid basic makeup verification', function(){

        before(function(){
            g.setRandomBlocks(0);   //ensure default setting, expected to be 3
            now = new Date();

            guid1 = g();
            breakdown1 = g.breakdown(guid1);
            guid2 = g();
            breakdown2 = g.breakdown(guid2);
        });

        it('Lengths to match current setting', function(){
            assert(guid1.length === 25, 'Default guid not 25 chars as expected');
            assert(breakdown1.random.length == 12, 'Default random block not 12 chars as expected');
        });

        it('Timestamp value to match present', function(){
            assert(Math.abs(breakdown1.timeStamp - now) <= 100, 'Timestamp too different from now');
            assert(Math.abs(breakdown2.timeStamp - now) <= 100, 'Timestamp too different from now');
        });

        it('Timestamp should increase successively', function(){
            assert(breakdown2.timeStamp >= breakdown1.timeStamp, '2nd timestamp not greater than 1st');
        });

        it('Timestamp on successive item should be close', function(){
            assert(Math.abs(breakdown1.timeStamp - breakdown2.timeStamp) < 100,
                'Successive timestamps too different');
        });

        it('Counter values should be successive or reset', function(){
            assert((breakdown2.counter - breakdown1.counter === 1)
            || (breakdown1.counter === counterMax && breakdown2.counter == 0),
                'Successive counter increment not 1');
        });

        it('Successive random blocks should be different', function(){
            assert(breakdown2.random != breakdown1.random,
                'Successive random block not different');
        });

    });

    describe('Counter roll-over verification', function(){

        before(function(){
            g.setCounterValue(counterMax); //set counter at maximum to trigger roll-over
            guid1 = g();
            breakdown1 = g.breakdown(guid1);
            guid2 = g();
            breakdown2 = g.breakdown(guid2);
            guid3 = g();
            breakdown3 = g.breakdown(guid3);
        });

        it('Counter value expectation: max', function(){
            assert(breakdown1.counter === counterMax, 'Counter not at max value');
            assert(guid1.length === 25, 'Default guid not 25 chars as expected');
        });

        it('Counter value expectation: after rollover', function(){
            assert(breakdown2.counter === 0, 'Counter not at 0');
            assert(guid2.length === 25, 'Default guid not 25 chars as expected');
        });

        it('Counter value expectation: 1', function(){
            assert(breakdown3.counter === 1, 'Counter not at 1');
            assert(guid3.length === 25, 'Default guid not 25 chars as expected');
        });

    });

})

