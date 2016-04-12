'use strict';

const assert = require('assert');

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
	constructor(product, prefix, suffix) {
		assert('string' === typeof product, 'product must be a string');
		assert('string' === typeof prefix, 'prefix must be a string');
		assert('string' === typeof suffix, 'suffix must be a string');

		super();

		this._product = product;
		this._prefix = prefix.endsWith('/') ? prefix : prefix + '/';
		this._suffix = suffix.startsWith('/') ? suffix : '/' + suffix;
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
}

module.exports = {
	ValenceRoute: ValenceRoute,
	SimpleValenceRoute: SimpleValenceRoute,
	VersionedValenceRoute: VersionedValenceRoute
};
