'use strict';

const assert = require('assert');

const
	ValenceVersions = require('./ValenceVersions'),
	route = require('./routes'),
	ValenceRoute = route.ValenceRoute,
	SimpleValenceRoute = route.SimpleValenceRoute,
	VersionedValenceRoute = route.VersionedValenceRoute;

class ValenceUrlResolver {
	constructor(lmsVersions) {
		assert(lmsVersions instanceof ValenceVersions);

		this._lmsVersions = lmsVersions;
	}

	get lmsVersions() {
		return this._lmsVersions;
	}

	_resolveVersion(route) {
		return this._lmsVersions.version(route.product);
	}

	resolve(route) {
		assert(route instanceof ValenceRoute, 'route must be a ValenceRoute');

		if (route instanceof SimpleValenceRoute) {
			// Simple routes don't have a version
			return route.path;
		} else if (route instanceof VersionedValenceRoute) {
			return route.prefix + this._resolveVersion(route) + route.suffix;
		}
	}
}

module.exports = ValenceUrlResolver;
