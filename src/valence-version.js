'use strict';

const
	assert = require('assert'),
	semver = require('semver');

function toSemVer(valenceVersion) {
	return valenceVersion + '.0';
}

class ValenceVersion {
	constructor(productCode, version) {
		assert('string' === typeof productCode, 'productCode must be a string');
		assert('string' === typeof version, 'version must be a string');

		this._productCode = productCode;
		this._version = version;
	}

	get productCode() {
		return this._productCode;
	}

	get versionString() {
		return this._version;
	}

	matches(version) {
		return semver.satisfies(toSemVer(version), toSemVer(this._version));
	}

	isConcrete() {
		// No wildcards; unstable is also concrete
		return ('unstable' === this._version)
			|| (null != semver.valid(toSemVer(this._version)));
	}
}

module.exports = ValenceVersion;
