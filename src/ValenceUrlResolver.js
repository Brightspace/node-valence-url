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
		// Look through LMS-supported versions for given product/version
		const supportedVersions = this._lmsVersions.supportedVersions(route.product);

		const matchingVersion = supportedVersions.find(function(version) {
			return version === route.version;
		});

		if (!matchingVersion) {
			throw new Error('No matching version for product found');
		}

		return matchingVersion;
	}

	resolve(route) {
		// Takes a ValenceRoute and return a string with the higest matching version filled in
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
