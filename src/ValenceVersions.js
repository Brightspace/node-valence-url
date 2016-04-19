'use strict';

const
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

	if ('object' !== typeof opts) {
		throw new TypeError(`Expected opts to be an object; got ${opts} (${typeof opts}) instead`);
	}
	if ('string' !== typeof opts.tenantUrl) {
		throw new TypeError(`Expected opts.tenantUrl to be a URL-formatted string; got ${opts.tenantUrl} (${typeof opts.tenantUrl}) instead`);
	}
	if (opts.versions && !Array.isArray(opts.versions)) {
		throw new TypeError(`Expected opts.versions to be an Array; got ${opts.versions} (${typeof opts.versions}) instead`);
	}
	if (opts.authToken && 'string' !== typeof opts.authToken) {
		throw new TypeError(`Expected opts.authToken to be a string; got ${opts.versions} (${typeof opts.versions}) instead`);
	}
	if (!opts.versions && !opts.authToken) {
		throw new TypeError('opts.versions or opts.authToken must be specified');
	}

	this._tenantUrl = opts.tenantUrl;

	if (Array.isArray(opts.versions)) {
		const productVersions = {};
		opts.versions.forEach(function(product) {
			if (!Array.isArray(product.SupportedVersions)) {
				throw new TypeError(`Expected SupportedVersions to be an array; got ${product.SupportedVersions} (${typeof product.SupportedVersions}) instead`);
			}

			productVersions[product.ProductCode] = {
				latest: product.LatestVersion,
				supported: product.SupportedVersions.sort().reverse()
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
							latest: product.LatestVersion,
							supported: product.SupportedVersions.sort().reverse()
						};
					});

					resolve(productVersions);
				});
		});
	}
}

ValenceVersions.prototype.resolveVersion = function(product, desiredSemVerRange) {
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

		if (semver.satisfies(toSemVer(productInfo.latest), desiredSemVerRange)) {
			return productInfo.latest;
		}

		const supported = productInfo.supported.find(function(version) {
			return semver.satisfies(toSemVer(version), desiredSemVerRange);
		});
		if (supported) {
			return supported;
		}

		throw new errors.NoMatchingVersionFound(productInfo.supported, desiredSemVerRange);
	});
};

module.exports = ValenceVersions;
