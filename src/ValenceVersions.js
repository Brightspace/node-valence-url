'use strict';

const
	assert = require('assert'),
	semver = require('semver');

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
			assert(Array.isArray(product.SupportedVersions), 'SupportedVersions must be an Array');

			product.SupportedVersions.forEach(function(version) {
				assert('string' === typeof version, 'versions must be strings');
			});

			self._productVersions[product.ProductCode] = product.SupportedVersions;
		});

	}

	get productVersions() {
		return this._productVersions;
	}

	supportedVersions(product) {
		return this._productVersions[product];
	}

	isSupported(product, desiredVersion) {
		return this._productVersions[product].some(function(productVersion) {
			return semver.satisfies(toSemVer(productVersion), toSemVer(desiredVersion));
		});
	}
}

module.exports = ValenceVersions;
