'use strict';

const
	assert = require('assert'),
	semver = require('semver');

const errors = require('./errors');

function toSemVer(versionString) {
	return versionString + '.0';
}

class ValenceVersions {
	// Represents reply from /d2l/api/versions/ call
	constructor(tenantUrl, products) {
		const self = this;

		assert('string' === typeof tenantUrl, 'tenantUrl must be a string');
		assert(Array.isArray(products), 'products must be an Array');

		self._tenantUrl = tenantUrl;
		self._productVersions = {};

		products.forEach(function(product) {
			assert('string' === typeof product.ProductCode, 'ProductCode must be a string');
			assert('string' === typeof product.LatestVersion, 'LatestVersion must be a string');

			self._productVersions[product.ProductCode] = {
				latest: product.LatestVersion
			};
		});
	}

	get tenantUrl() {
		return this._tenantUrl;
	}

	resolveVersion(product, desiredSemVerRange) {
		const productInfo = this._productVersions[product];

		if (!productInfo) {
			throw new errors.ProductNotSupported(product);
		}

		if (!desiredSemVerRange) {
			return productInfo.latest;
		}

		if (!semver.validRange(desiredSemVerRange)) {
			throw new errors.InvalidSemVerRange(desiredSemVerRange);
		}

		if (!semver.satisfies(toSemVer(productInfo.latest), desiredSemVerRange)) {
			throw new errors.NoMatchingVersionFound(productInfo.latest, desiredSemVerRange);
		}

		return productInfo.latest;
	}
}

module.exports = ValenceVersions;
