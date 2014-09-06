var test = require('prova');
var clean = require('../').clean;
var valid = require('../').valid;

// Standard npm tests
test('\nnode-semver clean tests', function(t) {
    // [range, version]
    // Version should be detectable despite extra characters
    [
        ['1.2.3', '1.2.3'],
        [' 1.2.3 ', '1.2.3'],
        [' 1.2.3-4 ', '1.2.3-4'],
        [' 1.2.3-pre ', '1.2.3-pre'],
        ['  =v1.2.3   ', '1.2.3'],
        ['v1.2.3', '1.2.3'],
        [' v1.2.3 ', '1.2.3'],
        ['\t1.2.3', '1.2.3']
    ].forEach(function(tuple) {
        var range = tuple[0];
        var version = tuple[1];
        var msg = 'clean(' + range + ') = ' + version;
        t.equal(clean(range), version, msg);
        var validMsg = 'valid(' + range + ') = ' + version;
        t.equal(valid(range), version != null, validMsg);
    });
    t.end();
});

test('\nsemvish clean tests', function(t) {
    // [range, version]
    // Version should be detectable despite extra characters
    [
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
        ['rc1', '0.0.0-rc1']
    ].forEach(function(tuple) {
        var range = tuple[0];
        var version = tuple[1];
        var msg = 'clean(' + range + ') = ' + version;
        t.equal(clean(range), version, msg);
        var validMsg = 'valid(' + range + ') = ' + version;
        t.equal(valid(range), version != null, validMsg);
    });
    t.end();
});
