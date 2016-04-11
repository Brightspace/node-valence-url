'use strict';

const
	assert = require('assert'),
	url = require('url');

const
	route = require('./route'),
	ValenceRoute = route.ValenceRoute,
	SimpleValenceRoute = route.SimpleValenceRoute,
	VersionedValenceRoute = route.VersionedValenceRoute;

class ValenceUrlResolver {

	constructor(tenantUrl, versions) {
		assert('string' === typeof(tenantUrl), 'tenantUrl must be a string');
		this._tenantUrl = tenantUrl;
		this._versions = versions;
	}

	get tenantUrl() {
		return this._tenantUrl;
	}

	_resolveVersion(version) {

		const versionItem = this._versions.find((item) => item.ProductCode === version.productCode);
		if (!versionItem) {
			throw new Error('The product code was not found ' + version.productCode);
		}

		if (version.isConcrete()) {
			return version.versionString;
		}

		const matchedVersions = versionItem.SupportedVersions.filter((v) => version.matches(v));

		if (matchedVersions.length === 0) {
			throw new Error('Could not find a matching version ' + version);
		}

		return matchedVersions.pop();
	}

	resolve(route, queryString) {
		assert((route instanceof ValenceRoute) || ('string' === typeof route), 'Route must be a ValenceRoute or a string');

		let result;

		if (route instanceof SimpleValenceRoute) {
			result = url.resolve(this._tenantUrl, route.path);
		}
		else if (route instanceof VersionedValenceRoute) {
			result = url.resolve(this._tenantUrl, route.prefix + this._resolveVersion(route.version) + route.suffix);
		}
		else {
			result = url.resolve(this._tenantUrl, route);
		}

		return result + (queryString || '');
	}
}

module.exports = ValenceUrlResolver;
