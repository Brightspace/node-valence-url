'use strict';

const
	assert = require('assert'),
	semver = require('semver');

const
	errors = require('./errors'),
	ProductNotSupported = errors.ProductNotSupported;

function toSemVer(versionString) {
	return versionString + '.0';
}

class ValenceVersions {
	// Represents reply from /d2l/api/versions/ call
	constructor(products) {
		const self = this;

		assert(Array.isArray(products), 'products must be an Array');

		self._productVersions = {};

		products.forEach(function(product) {
			assert('string' === typeof product.ProductCode, 'ProductCode must be a string');
			assert('string' === typeof product.LatestVersion, 'LatestVersion must be a string');

			self._productVersions[product.ProductCode] = {
				latest: product.LatestVersion
			};
		});

	}

	version(product) {
		const productInfo = this._productVersions[product];

		if (!productInfo) {
			throw new ProductNotSupported(product);
		}

		return productInfo.latest;
	}

	isSupported(product, desiredSemVer) {
		const productSemVer = toSemVer(this._productVersions[product].version);

		if (semver.satisfies(productSemVer, desiredSemVer)) {
			return true;
		}

		return false;
	}
}

module.exports = ValenceVersions;
