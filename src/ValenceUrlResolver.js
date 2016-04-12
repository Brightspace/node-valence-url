'use strict';

const assert = require('assert');

const
	ValenceVersions = require('./ValenceVersions'),
	route = require('./routes'),
	ValenceRoute = route.ValenceRoute,
	SimpleValenceRoute = route.SimpleValenceRoute,
	VersionedValenceRoute = route.VersionedValenceRoute;

class ValenceUrlResolver {
	constructor(supportedVersions) {
		assert(supportedVersions instanceof ValenceVersions);

		this._supportedVersions = supportedVersions;
	}

	get supportedVersions() {
		return this._supportedVersions;
	}

	_resolveVersion(route) {
		return this._supportedVersions.version(route.product, route.desiredSemVer);
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
