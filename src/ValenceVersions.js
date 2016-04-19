'use strict';

const
	assert = require('assert'),
	co = require('co'),
	request = require('superagent'),
	semver = require('semver');

const errors = require('./errors');

const VERSIONS_ROUTE = '/d2l/api/versions/';

function toSemVer(versionString) {
	return versionString + '.0';
}

function ValenceVersions(opts) {
	if (!(this instanceof ValenceVersions)) {
		return new ValenceVersions(opts);
	}

	assert('object' === typeof opts);
	assert('string' === typeof opts.tenantUrl);
	assert('string' === typeof opts.authToken || Array.isArray(opts.versions));

	this._tenantUrl = opts.tenantUrl;

	if (Array.isArray(opts.versions)) {
		const productVersions = {};
		opts.versions.forEach(function(product) {
			productVersions[product.ProductCode] = {
				latest: product.LatestVersion
			};
		});
		this._productVersions = Promise.resolve(productVersions);
	} else {
		this._productVersions = new Promise(function(resolve, reject) {
			request
				.get(opts.tenantUrl + VERSIONS_ROUTE)
				.set('Authorization', `Bearer ${opts.authToken}`)
				.end(function(err, res) {
					if (err) {
						return reject(err);
					}

					const productVersions = {};
					res.body.forEach(function(product) {
						productVersions[product.ProductCode] = {
							latest: product.LatestVersion
						};
					});

					resolve(productVersions);
				});
		});
	}
}

ValenceVersions.prototype.resolveVersion = co.wrap(/* @this */ function *(product, desiredSemVerRange) {
	return this._productVersions.then(function(versions) {
		const productInfo = versions[product];

		if (!productInfo) {
			throw new errors.ProductNotSupported(product);
		}

		if ('unstable' === desiredSemVerRange) {
			return 'unstable';
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
	});

});

module.exports = ValenceVersions;
