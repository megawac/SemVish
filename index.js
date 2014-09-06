var _ = require("underscore");
var trim = require("trim");
var SemVer = require("semver");

function interpretVersion(version) {
	// Handle pre-releases
	var preRelease = "";
	var preReleaseIndex = version.indexOf("-");

	// Handle pre-releases without the dash (poor format)
	if (preReleaseIndex < 0 && (preReleaseIndex = version.search(/[a-z]/i)) >= 0) {
		preRelease = "-" + version.slice(preReleaseIndex);
		version = preReleaseIndex === 0 ? "0" : version.slice(0, Math.max(0, preReleaseIndex));
	}
	else if (preReleaseIndex >= 0) {
		preRelease = "-" + version.slice(preReleaseIndex + 1);
		version = version.slice(0, preReleaseIndex);
	}

	// Handle <Max>.<Min> versioning schemes
	var split = version.split(".");
	while (split.length < 3) {
		split.push(0);
	}

	return split.join(".") + preRelease;
}

function SemVish(version, loose) {
	return _.isString(version) ? SemVer(SemVish.clean(version), loose) : SemVer(version, loose);
}

SemVish.prototype = Object.create(SemVer.prototype);

_.each(["comparePre", "compareMain"], function(semverFunc) {
	SemVish.prototype[semverFunc] = function(other) {
		return Semver.prototype[semverFunc].call(this, SemVish(other));
	};
});

_.extend(SemVish, _.reduce(['compare', 'rcompare', 'gt', 'lt', 'eq', 'neq', 'gte', 'lte'], function(memo, semverFunc) {
	memo[semverFunc] = function(a, b, loose) {
		return SemVer[semverFunc](SemVish(a, loose), SemVish(b, loose), loose);
	};
	return memo;
}, {}));

SemVish.cmp = function(a, op, b, loose) {
	return SemVer.cmp(SemVish(a, loose), op, SemVish(b, loose), loose);
};

SemVish.clean = function(version, loose) {
	try {
		version = trim(version).replace(/^[=\-_\s]*(v(ersion)?)?[=\-_\s]*/i, "");
		return SemVer(interpretVersion(version), loose).version;
	} catch(o_O) {
		return null;
	}
};

SemVish.valid = function(version, loose) {
	return SemVish.clean(version, loose) != null;
};

module.exports = SemVish;
