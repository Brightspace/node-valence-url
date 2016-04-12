'use strict';

const assert = require('assert');

class ValenceRoute {
}

class SimpleValenceRoute extends ValenceRoute {
	// e.g. /d2l/api/versions/

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
	// e.g. /d2l/api/lp/1.5/enrollments/myenrollments/

	constructor(product, prefix, suffix, desiredSemVer) {
		assert('string' === typeof product, 'product must be a string');
		assert('string' === typeof prefix, 'prefix must be a string');
		assert('string' === typeof suffix, 'suffix must be a string');
		assert('string' === typeof desiredSemVer || desiredSemVer === undefined, 'desiredSemVer must be a string or undefined');

		super();

		this._product = product;
		this._prefix = prefix.endsWith('/') ? prefix : prefix + '/';
		this._suffix = suffix.startsWith('/') ? suffix : '/' + suffix;
		this._desiredSemVer = desiredSemVer || '^0.0.0';
	}

	get product() {
		return this._product;
	}

	get prefix() {
		return this._prefix;
	}

	get suffix() {
		return this._suffix;
	}

	get desiredSemVer() {
		return this._desiredSemVer;
	}
}

class LEValenceRoute extends VersionedValenceRoute {
	constructor(suffix, desiredSemVer) {
		super('le', '/d2l/api/le/', suffix, desiredSemVer);
	}
}

class LPValenceRoute extends VersionedValenceRoute {
	constructor(suffix, desiredSemVer) {
		super('lp', '/d2l/api/lp/', suffix, desiredSemVer);
	}
}

module.exports = ValenceRoute;
module.exports.Simple = SimpleValenceRoute;
module.exports.Versioned = VersionedValenceRoute;
module.exports.LE = LEValenceRoute;
module.exports.LP = LPValenceRoute;
