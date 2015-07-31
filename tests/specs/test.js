/**
 * Created on 7/29/15. Copyright Michael Wynn - all rights reserved.
 */
'use strict';
(function() {
    var assert = require('better-assert');
    var counterMax = Math.pow(36, 4) - 1;
    var g;
    try {
        g = require('../../index');  //specs
    } catch (e) {
        g = require('csim-guid');            //browser
    };

    describe('csim-guid tests', function () {

        var now,
            guid1,
            breakdown1,
            guid2,
            breakdown2,
            guid3,
            breakdown3;

        describe('Guid basic makeup', function () {

            before(function () {
                g.setScale(0);   //ensure default setting, expected to be 3
                now = new Date();

                guid1 = g();
                breakdown1 = g.breakdown(guid1);
                guid2 = g();
                breakdown2 = g.breakdown(guid2);
            });

            it('Lengths to match current setting', function () {
                assert(guid1.length === 25, 'Default guid not 25 chars as expected');
                assert(breakdown1.random.length == 12, 'Default random block not 12 chars as expected');
            });

            it('Timestamp value to match present', function () {
                assert(Math.abs(breakdown1.date - now) <= 100, 'Timestamp too different from now');
                assert(Math.abs(breakdown2.date - now) <= 100, 'Timestamp too different from now');
            });

            it('Timestamp should increase successively', function () {
                assert(breakdown2.date >= breakdown1.date, '2nd date less than 1st');
            });

            it('Timestamp on later item should be greater', function (done) {
                var resolution = 1; //as little as 1 millisecond should have effect
                setTimeout(function () {
                    var newGuid = g();
                    var newBreakdown = g.breakdown(newGuid);
                    assert(newBreakdown.date > breakdown1.date);
                    done();
                }, resolution);
            });

            it('Counter values should be successive or reset', function () {
                assert((breakdown2.counterDecimal - breakdown1.counterDecimal === 1)
                    || (breakdown1.counterDecimal === counterMax && breakdown2.counterDecimal == 0),
                    'Successive counterDecimal increment not 1');
            });

            it('Successive random blocks should be different', function () {
                assert(breakdown2.random != breakdown1.random,
                    'Successive random block not different');
            });

        });

        describe('Counter roll-over', function () {

            before(function () {
                // attempt to generate 3 guids on same date at artificially high
                // counterDecimal, to trigger counterDecimal rollover for testing the rollover
                // algorithm.  Note that due to reseeding plan, the chance of actual
                // rollover in real application is very slim.
                do {
                    //dummy call to reduce probability of counterDecimal reseed on next call
                    var guid0 = g();
                    //set counterDecimal at maximum to trigger roll-over on guid2 creation
                    g.setCounterValueForTestingDoNotUse(counterMax);
                    guid1 = g();
                    guid2 = g();
                    guid3 = g();

                    var breakdown0 = g.breakdown(guid0);
                    breakdown1 = g.breakdown(guid1);
                    breakdown2 = g.breakdown(guid2);
                    breakdown3 = g.breakdown(guid3);
                } while (breakdown1.date.getTime() != breakdown0.date.getTime());
            });

            it('Counter value expectation: max', function () {
                assert(breakdown1.counterDecimal === counterMax, 'Counter not at max value');
                assert(guid1.length === 25, 'Default guid not 25 chars as expected');
            });

            it('Counter value expectation: after rollover', function () {
                assert(breakdown2.counterDecimal < breakdown1.counterDecimal, 'Counter not reseeded');
                assert(guid2.length === 25, 'Default guid not 25 chars');
            });

            it('Counter value expectation: normal', function () {
                assert(breakdown3.counterDecimal === breakdown2.counterDecimal + 1, 'Counter not sequential');
                assert(guid3.length === 25, 'Default guid not 25 chars');
            });

        });

        describe('Random blocks override', function () {

            it('5-blocks', function () {
                g.setScale(5);
                guid1 = g();
                guid2 = g();
                breakdown1 = g.breakdown(guid1);
                breakdown2 = g.breakdown(guid2);
                assert(breakdown1.scale == 5);
                assert(breakdown2.scale == 5);
            });

            it('3-blocks default', function () {
                g.setScale();
                guid1 = g();
                guid2 = g();
                breakdown1 = g.breakdown(guid1);
                breakdown2 = g.breakdown(guid2);
                assert(breakdown1.scale == 3);
                assert(breakdown2.scale == 3);
            });

        });

    });
})();
