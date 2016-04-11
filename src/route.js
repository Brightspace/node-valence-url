'use strict';

const assert = require('assert');

const ValenceVersion = require('./version');

class ValenceRoute {
}

class SimpleValenceRoute extends ValenceRoute {
	// e.g. /d2l/api/versions

	constructor(path) {
		assert('string' === typeof path, 'path must be a string');

		super();

		this._path = path;
	}

	get path() {
		return this._path;
	}
}

class VersionedValenceRoute extends ValenceRoute {
	constructor(prefix, version, suffix) {
		assert('string' === typeof prefix, 'prefix must be a string');
		assert(version instanceof ValenceVersion, 'version must be a ValenceVersion');
		assert('string' === typeof suffix, 'suffix must be a string');

		super();

		this._prefix = prefix.startsWith('/') ? prefix : '/' + prefix;
		this._prefix = prefix.endsWith('/') ? this._prefix : this._prefix + '/';
		this._version = version;
		this._suffix = suffix.startsWith('/') ? suffix : '/' + suffix;
		this._suffix = suffix.endsWith('/') ? this._suffix : this._suffix + '/';
	}

	get prefix() {
		return this._prefix;
	}

	get version() {
		return this._version;
	}

	get suffix() {
		return this._suffix;
	}
}

class LERoute extends VersionedValenceRoute {
	constructor(versionString, path) {
		super('/d2l/api/le/', new ValenceVersion('le', versionString), path);
	}
}

class LPRoute extends VersionedValenceRoute {
	constructor(versionString, path) {
		super('/d2l/api/lp/', new ValenceVersion('lp', versionString), path);
	}
}

module.exports = {
	ValenceRoute: ValenceRoute,
	SimpleValenceRoute: SimpleValenceRoute,
	VersionedValenceRoute: VersionedValenceRoute,
	LERoute: LERoute,
	LPRoute: LPRoute
};
