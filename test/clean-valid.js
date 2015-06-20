var test = require('prova');
var clean = require('../').clean;
var valid = require('../').valid;
var _ = require('underscore');

function createChecker(msg, tests) {
    test(msg, function(t) {
        _.each(tests, function check(tuple) {
            var range = tuple[0];
            var version = tuple[1];
            var msg = 'clean(' + range + ') = ' + version;
            t.equal(clean(range), version, msg);
            var validMsg = 'valid(' + range + ') = ' + version;
            t.equal(valid(range), version != null, validMsg);
        });
        t.end();
    });
}


// Standard npm tests
// [range, version]
// Version should be detectable despite extra characters
createChecker('node-semver clean tests', [
    ['1.2.3', '1.2.3'],
    [' 1.2.3 ', '1.2.3'],
    [' 1.2.3-4 ', '1.2.3-4'],
    [' 1.2.3-pre ', '1.2.3-pre'],
    ['  =v1.2.3   ', '1.2.3'],
    ['v1.2.3', '1.2.3'],
    [' v1.2.3 ', '1.2.3'],
    ['\t1.2.3', '1.2.3']
]);

createChecker('clean supports **Version** prefix', [
    ['Version 1.2', '1.2.0'],
    ['VERSION-1.2 ', '1.2.0'],
    ['VERSION==1.2-4 ', '1.2.0-4'],
    ['==VERSION==1.2-pre ', '1.2.0-pre'],
    ['Version.1.2.3', '1.2.3'],
    ['=VerSion.=1.2.3-rc1', '1.2.3-rc1']
]);


createChecker('semvish clean tests', [
    ['1.2', '1.2.0'],
    [' 1.2 ', '1.2.0'],
    [' 1.2-4 ', '1.2.0-4'],
    [' 1.2-pre ', '1.2.0-pre'],
    ['  =v1.2   ', '1.2.0'],
    ['v1.2', '1.2.0'],
    [' v1.2 ', '1.2.0'],
    ['\t1.2', '1.2.0'],
    [' 1.0-rc1  ', '1.0.0-rc1'],
    [' 1.0rc1  ', '1.0.0-rc1'],
    [' 1-rc1  ', '1.0.0-rc1'],
    [' 1rc1  ', '1.0.0-rc1'],
    ['  V1  ', '1.0.0'],
    ['rc1', '0.0.0-rc1'],
    ['_v--1.2.0', '1.2.0'],
    ['==v==1.2', '1.2.0'],
    ['   --v==1.2   ', '1.2.0'],
    ['  v.1.2.3', '1.2.3'],
    ['v.332.15-a1', '332.15.0-a1']
]);

test('\ninvalid version numbers', function(t) {
  ['1.2.3.4',
   'NOT VALID',
   1.2,
   null,
   'Infinity.NaN.Infinity'
  ].forEach(function(v) {
    t.throws(function() {
      new SemVer(v);
    }, {name:'TypeError', message:'Invalid Version: ' + v});
  });

  t.end();
});
