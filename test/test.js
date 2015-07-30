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

    describe('Guid basic makeup', function(){

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
            assert(Math.abs(breakdown1.timestamp - now) <= 100, 'Timestamp too different from now');
            assert(Math.abs(breakdown2.timestamp - now) <= 100, 'Timestamp too different from now');
        });

        it('Timestamp should increase successively', function(){
            assert(breakdown2.timestamp >= breakdown1.timestamp, '2nd timestamp less than 1st');
        });

        it('Timestamp on later item should be greater', function(done){
            var resolution = 1; //as little as 1 millisecond should have effect
            setTimeout(function(){
                var newGuid = g();
                var newBreakdown = g.breakdown(newGuid);
                assert(newBreakdown.timestamp > breakdown1.timestamp);
                done();
            }, resolution);
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

    describe('Counter roll-over', function(){

        before(function(){
            // attempt to generate 3 guids on same timestamp at artificially high
            // counter, to trigger counter rollover for testing the rollover
            // algorithm.  Note that due to reseeding plan, the chance of actual
            // rollover in real application is very slim.
            do {
                //dummy call to reduce probability of counter reseed on next call
                var guid0 = g();
                //set counter at maximum to trigger roll-over on guid2 creation
                g.setCounterValue(counterMax);
                guid1 = g();
                guid2 = g();
                guid3 = g();

                var breakdown0 = g.breakdown(guid0);
                breakdown1 = g.breakdown(guid1);
                breakdown2 = g.breakdown(guid2);
                breakdown3 = g.breakdown(guid3);
            } while(breakdown1.timestamp.getTime() != breakdown0.timestamp.getTime());
        });

        it('Counter value expectation: max', function(){
            assert(breakdown1.counter === counterMax, 'Counter not at max value');
            assert(guid1.length === 25, 'Default guid not 25 chars as expected');
        });

        it('Counter value expectation: after rollover', function(){
            assert(breakdown2.counter < breakdown1.counter, 'Counter not reseeded');
            assert(guid2.length === 25, 'Default guid not 25 chars');
        });

        it('Counter value expectation: normal', function(){
            assert(breakdown3.counter === breakdown2.counter+1, 'Counter not sequential');
            assert(guid3.length === 25, 'Default guid not 25 chars');
        });

    });

    describe('Random blocks override', function(){

        it('5-blocks', function(){
            g.setRandomBlocks(5);
            guid1 = g();
            guid2 = g();
            breakdown1 = g.breakdown(guid1);
            breakdown2 = g.breakdown(guid2);
            assert(breakdown1.randomBlockLength == 4*5);
            assert(breakdown2.randomBlockLength == 4*5);
        });

        it('3-blocks default', function(){
            g.setRandomBlocks(0);
            guid1 = g();
            guid2 = g();
            breakdown1 = g.breakdown(guid1);
            breakdown2 = g.breakdown(guid2);
            assert(breakdown1.randomBlockLength == 4*3);
            assert(breakdown2.randomBlockLength == 4*3);
        });

    });

});

