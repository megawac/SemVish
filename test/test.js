var test = require('prova');
var SemVish = require('../');
var _ = require('underscore');

var eq = SemVish.eq;
var gt = SemVish.gt;
var lt = SemVish.lt;
var neq = SemVish.neq;
var cmp = SemVish.cmp;
var gte = SemVish.gte;
var lte = SemVish.lte;
var compare = SemVish.compare;
var rcompare = SemVish.rcompare;


function createGTSuite(message, tests) {
    test(message, function(t) {
        _.each(tests, function(v) {
            var v0 = v[0];
            var v1 = v[1];
            var loose = v[2];
            t.ok(gt(v0, v1, loose), 'gt(\'' + v0 + '\', \'' + v1 + '\')');
            t.ok(lt(v1, v0, loose), 'lt(\'' + v1 + '\', \'' + v0 + '\')');
            t.ok(!gt(v1, v0, loose), '!gt(\'' + v1 + '\', \'' + v0 + '\')');
            t.ok(!lt(v0, v1, loose), '!lt(\'' + v0 + '\', \'' + v1 + '\')');
            t.ok(eq(v0, v0, loose), 'eq(\'' + v0 + '\', \'' + v0 + '\')');
            t.ok(eq(v1, v1, loose), 'eq(\'' + v1 + '\', \'' + v1 + '\')');
            t.ok(neq(v0, v1, loose), 'neq(\'' + v0 + '\', \'' + v1 + '\')');
            t.ok(cmp(v1, '==', v1, loose), 'cmp(\'' + v1 + '\' == \'' + v1 + '\')');
            t.ok(cmp(v0, '>=', v1, loose), 'cmp(\'' + v0 + '\' >= \'' + v1 + '\')');
            t.ok(cmp(v1, '<=', v0, loose), 'cmp(\'' + v1 + '\' <= \'' + v0 + '\')');
            t.ok(cmp(v0, '!=', v1, loose), 'cmp(\'' + v0 + '\' != \'' + v1 + '\')');
            t.equal(compare(v0, v1), 1, 'compare(\'' + v0 + '\' , \'' + v1 + '\')');
            t.equal(rcompare(v0, v1), -1, 'rcompare(\'' + v0 + '\' , \'' + v1 + '\')');
        });
        t.end();
    });
}

function createEqualitySuite(message, tests) {
    test(message, function(t) {
        _.each(tests, function(v) {
            var v0 = v[0];
            var v1 = v[1];
            var loose = v[2];
            t.ok(eq(v0, v1, loose), 'eq(\'' + v0 + '\', \'' + v1 + '\')');
            t.ok(!neq(v0, v1, loose), '!neq(\'' + v0 + '\', \'' + v1 + '\')');
            t.ok(cmp(v0, '==', v1, loose), 'cmp(' + v0 + '==' + v1 + ')');
            t.ok(!cmp(v0, '!=', v1, loose), '!cmp(' + v0 + '!=' + v1 + ')');
            t.ok(cmp(v0, '===', v1, loose), '!cmp(' + v0 + '===' + v1 + ')');
            t.ok(!cmp(v0, '!==', v1, loose), 'cmp(' + v0 + '!==' + v1 + ')');
            t.ok(!gt(v0, v1, loose), '!gt(\'' + v0 + '\', \'' + v1 + '\')');
            t.ok(gte(v0, v1, loose), 'gte(\'' + v0 + '\', \'' + v1 + '\')');
            t.ok(!lt(v0, v1, loose), '!lt(\'' + v0 + '\', \'' + v1 + '\')');
            t.ok(lte(v0, v1, loose), 'lte(\'' + v0 + '\', \'' + v1 + '\')');
            t.equal(compare(v0, v1), 0, 'compare(\'' + v0 + '\' , \'' + v1 + '\')');
            t.equal(rcompare(v0, v1), 0, 'rcompare(\'' + v0 + '\' , \'' + v1 + '\')');
            t.equal(SemVish(v0).compareMain(v1), 0, 'SemVish(\'' + v0 + '\').compareMain(\'' + v1 + '\')');
            t.equal(SemVish(v0).comparePre(SemVish(v1)), 0, 'SemVish(\'' + v0 + '\').comparePre(\'' + v1 + '\')');
        });
        t.end();
    });
}



createGTSuite('node-semver comparison tests', [
    ['0.0.0', '0.0.0-foo'],
    ['0.0.1', '0.0.0'],
    ['1.0.0', '0.9.9'],
    ['0.10.0', '0.9.0'],
    ['0.99.0', '0.10.0'],
    ['2.0.0', '1.2.3'],
    ['v0.0.0', '0.0.0-foo', true],
    ['v0.0.1', '0.0.0', true],
    ['v1.0.0', '0.9.9', true],
    ['v0.10.0', '0.9.0', true],
    ['v0.99.0', '0.10.0', true],
    ['v2.0.0', '1.2.3', true],
    ['0.0.0', 'v0.0.0-foo', true],
    ['0.0.1', 'v0.0.0', true],
    ['1.0.0', 'v0.9.9', true],
    ['0.10.0', 'v0.9.0', true],
    ['0.99.0', 'v0.10.0', true],
    ['2.0.0', 'v1.2.3', true],
    ['1.2.3', '1.2.3-asdf'],
    ['1.2.3', '1.2.3-4'],
    ['1.2.3', '1.2.3-4-foo'],
    ['1.2.3-5-foo', '1.2.3-5'],
    ['1.2.3-5', '1.2.3-4'],
    ['1.2.3-5-foo', '1.2.3-5-Foo'],
    ['3.0.0', '2.7.2+asdf'],
    ['1.2.3-a.10', '1.2.3-a.5'],
    ['1.2.3-a.b', '1.2.3-a.5'],
    ['1.2.3-a.b', '1.2.3-a'],
    ['1.2.3-a.b.c.10.d.5', '1.2.3-a.b.c.5.d.100'],
    ['123.2.1-r69', '123.2.1-r7']
]);

createEqualitySuite('node-semver equality tests', [
    // [version1, version2]
    // version1 should be equivalent to version2
    ['1.2.3', 'v1.2.3', true],
    ['1.2.3', '=1.2.3', true],
    ['1.2.3', 'v 1.2.3', true],
    ['1.2.3', '= 1.2.3', true],
    ['1.2.3', ' v1.2.3', true],
    ['1.2.3', ' =1.2.3', true],
    ['1.2.3', ' v 1.2.3', true],
    ['1.2.3', ' = 1.2.3', true],
    ['1.2.3-0', 'v1.2.3-0', true],
    ['1.2.3-0', '=1.2.3-0', true],
    ['1.2.3-0', 'v 1.2.3-0', true],
    ['1.2.3-0', '= 1.2.3-0', true],
    ['1.2.3-0', ' v1.2.3-0', true],
    ['1.2.3-0', ' =1.2.3-0', true],
    ['1.2.3-0', ' v 1.2.3-0', true],
    ['1.2.3-0', ' = 1.2.3-0', true],
    ['1.2.3-1', 'v1.2.3-1', true],
    ['1.2.3-1', '=1.2.3-1', true],
    ['1.2.3-1', '\nv 1.2.3-1', true],
    ['1.2.3-1', '= 1.2.3-1', true],
    ['1.2.3-1', ' v1.2.3-1', true],
    ['1.2.3-1\t', ' =1.2.3-1', true],
    ['1.2.3-1', ' v 1.2.3-1', true],
    ['1.2.3-1', ' = 1.2.3-1', true],
    ['1.2.3-beta', 'v1.2.3-beta', true],
    ['1.2.3-beta', '=1.2.3-beta', true],
    ['1.2.3-beta', 'v 1.2.3-beta', true],
    ['1.2.3-beta', '= 1.2.3-beta', true],
    ['1.2.3-beta', ' v1.2.3-beta', true],
    ['1.2.3-beta', ' =1.2.3-beta', true],
    ['1.2.3-beta', ' v 1.2.3-beta', true],
    ['1.2.3-beta', ' = 1.2.3-beta', true],
    ['1.2.3-beta+build', ' = 1.2.3-beta+otherbuild', true],
    ['1.2.3+build', ' = 1.2.3+otherbuild', true],
    ['1.2.3-beta+build', '1.2.3-beta+otherbuild'],
    ['1.2.3+build', '1.2.3+otherbuild'],
    ['  v1.2.3+build', '1.2.3+otherbuild'],
]);

createGTSuite('SemVish comparison tests', [
    ['2.0', '1.5', true],
    ['2.0', '1.9', true],
    ['2.0-rc1', '1.8', true],
    ['2.0', '2.0-rc1', true],
    ['2.0', '2.0-a1', true],
    ['2.0', '2.0rc1', true],
    ['2', '1'],
    ['2.0b', '2.0a'],
    ['b', 'a'],
    ['beta1', 'alpha1'],
    ['r99', 'r98'],
    ['r69', 'r9'],
    ['foo123', 'foo99'],
    ['foo', 'Foo'],
    ['foo123', 'fOO123'],
    ['FOo.1321', 'FOO.1321']
]);

// See https://github.com/scottschiller/SoundManager2/releases
createGTSuite('Handle poorly formatted release date style versions', [
    ['V2.97a.20140901', 'V2.97a.20131201', true],
    ['  V2.97a.20130512    ', 'V2.97a.20130101'],
    ['V2.97a.20131201 ', '--V--2.97a.20110706 ']
]);

// See #1
createEqualitySuite('Semvish equality tests', [
    ['FOO.1321', 'FOO.1321'],
    ['r62.1.1.1.1.1', 'r62.1.1.1.1.1'],
    [' \tr12   \n', '\n  r12   \t']
]);

test('compareMain', function(t) {
    _.each([
        ['1.2.1', '1.1'],
        ['1.1.1', '1.1.0'],
        ['1.0', '0.9.9999-rc1'],
        ['10.0.5', '9.9999.0']
    ], function(v) {
        var v0 = v[0];
        var v1 = v[1];
        var loose = v[2];

        t.equal(SemVish(v0, loose).compareMain(v1), 1, 'SemVish(\'' + v0 + '\').compareMain(\'' + v1 + '\')');
        t.equal(SemVish(v1, loose).compareMain(SemVish(v0)), -1, 'SemVish(\'' + v0 + '\').compareMain(\'' + v1 + '\')');
    });
    t.end();
});

test('comparePre', function(t) {
    _.each([
        ['1.2.1', '1.1-a1'],
        ['1.1.1-rc1', '9.1.0-b1'],
        ['1.0-rc2', '0.9.9999-rc1'],
        ['10.0.5', '9.9999.0-zzzz'],
        // ROS versioning scheme
        ['r2', 'r1'],
        ['r1111', 'r2'],
        ['0.1-r12', '1.2-r11'],
        ['1.1-r12', '0.2-r3']
    ], function(v) {
        var v0 = v[0];
        var v1 = v[1];
        var loose = v[2];

        t.equal(SemVish(v0, loose).comparePre(v1), 1, 'SemVish(\'' + v0 + '\').comparePre(\'' + v1 + '\')');
        t.equal(SemVish(v1, loose).comparePre(SemVish(v0)), -1, 'SemVish(\'' + v0 + '\').comparePre(\'' + v1 + '\')');
    });
    t.end();
});
