'use strict';

const
	assert = require('assert'),
	url = require('url');

const
	ValenceVersions = require('./ValenceVersions'),
	ValenceRoute = require('./ValenceRoute'),
	SimpleValenceRoute = ValenceRoute.Simple,
	VersionedValenceRoute = ValenceRoute.Versioned;

class ValenceUrlResolver {
	constructor(tenantUrl, supportedVersions) {
		assert('string' === typeof tenantUrl, 'tenantUrl must be a string');
		assert(Array.isArray(supportedVersions), 'supportedVersions must be an Array');

		this._tenantUrl = tenantUrl;
		this._supportedVersions = new ValenceVersions(tenantUrl, supportedVersions);
	}

	get tenantUrl() {
		return this._tenantUrl;
	}

	get supportedVersions() {
		return this._supportedVersions;
	}

	_resolveVersion(route) {
		return this._supportedVersions.resolveVersion(route.product, route.desiredSemVer);
	}

	resolve(route, queryString) {
		assert(route instanceof ValenceRoute, 'route must be a ValenceRoute');

		let result;
		if (route instanceof SimpleValenceRoute) {
			// Simple routes don't have a version
			result = url.resolve(this._tenantUrl, route.path);
		} else if (route instanceof VersionedValenceRoute) {
			result = url.resolve(this._tenantUrl, route.prefix + this._resolveVersion(route) + route.suffix);
		} else {
			result = url.resolve(this._tenantUrl, route);
		}

		return result + (queryString || '');
	}
}

module.exports = ValenceUrlResolver;
