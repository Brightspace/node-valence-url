'use strict';

const
	assert = require('assert'),
	co = require('co'),
	url = require('url');

const
	ValenceVersions = require('./ValenceVersions'),
	ValenceRoute = require('./ValenceRoute'),
	SimpleValenceRoute = ValenceRoute.Simple,
	VersionedValenceRoute = ValenceRoute.Versioned;

class ValenceUrlResolver {
	constructor(tenantUrl, authToken) {
		assert('string' === typeof tenantUrl, 'tenantUrl must be a string');
		assert('string' === typeof authToken, 'authToken must be a string');

		this._tenantUrl = tenantUrl;
		this._versions = new ValenceVersions(tenantUrl, authToken);
	}

	get tenantUrl() {
		return this._tenantUrl;
	}

	get versions() {
		return this._versions;
	}

	resolve(route, queryString) {
		assert(route instanceof ValenceRoute || 'string' === typeof route);

		queryString = queryString || '';

		if (route instanceof SimpleValenceRoute) {
			return Promise.resolve(url.resolve(this._tenantUrl, route.path + queryString));
		} else if (route instanceof VersionedValenceRoute) {
			const self = this;
			return co(function*() {
				return yield self._versions.resolveVersion(route.product, route.desiredSemVer);
			}).then(function(version) {
				return url.resolve(self._tenantUrl, route.prefix + version + route.suffix + queryString);
			});
		} else {
			return Promise.resolve(url.resolve(this._tenantUrl, route + queryString));
		}
	}
}

module.exports = ValenceUrlResolver;
