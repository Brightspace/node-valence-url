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

function ValenceVersions(tenantUrl, authToken) {
	if (!(this instanceof ValenceVersions)) {
		return new ValenceVersions(tenantUrl, authToken);
	}

	assert('string' === typeof tenantUrl);
	assert('string' === typeof authToken);

	this._tenantUrl = tenantUrl;
	this._authToken = authToken;
	this._productVersions = {};
}

ValenceVersions.prototype.resolveVersion = co.wrap(/* @this */ function *(product, desiredSemVerRange) {
	if (!this._versionsRequest) {
		const self = this;
		this._versionsRequest = new Promise(function(resolve, reject) {
			request
				.get(self._tenantUrl + VERSIONS_ROUTE)
				.set('Authorization', `Bearer ${self._authToken}`)
				.end(function(err, res) {
					if (err) {
						return reject(err);
					}

					res.body.forEach(function(product) {
						self._productVersions[product.ProductCode] = {
							latest: product.LatestVersion
						};
					});

					resolve();
				});
		});
	}

	yield this._versionsRequest;

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
});

module.exports = ValenceVersions;
