/* jshint eqnull:true */
"use strict";

var str = require("underscore.string");
var SemVer = require("semver");
var create = require("object-create");
var assign = require('object-assign');

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
	if (version instanceof SemVish) return version;
	if (!(this instanceof SemVer)) return new SemVish(version, loose);
	return assign(this, new SemVer(SemVish.clean(version), loose));
}

SemVish.prototype = create(SemVer.prototype);

assign(SemVish.prototype, {
	compare: function(other) {
		other = new SemVish(other);
		return this.compareMain(other) || this.comparePre(other);
	},
	compareMain: function(other) {
		return SemVer.prototype.compareMain.call(this, new SemVish(other));
	},
	comparePre: function(other) {
		other = new SemVish(other);
		if (!this.prerelease.length || !other.prerelease.length) {
			return !!other.prerelease.length - !!this.prerelease.length;
		}
		return str.naturalCmp(this.prerelease.join("."), other.prerelease.join("."));
	}
});

assign(SemVish, ['compare', 'rcompare', 'gt', 'lt', 'eq', 'neq', 'gte', 'lte'].reduce(function(memo, semverFunc) {
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
		version = str.trim(version).replace(/^[=\-_\s]*(v(ersion)?)?[=\-_\s.]*/i, "");
		return SemVer(interpretVersion(version), loose).version;
	} catch(o_O) {
		return null;
	}
};

SemVish.valid = function(version, loose) {
	return SemVish.clean(version, loose) != null;
};

module.exports = SemVish;
