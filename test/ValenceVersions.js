/* global describe, it */

'use strict';

const
	chai = require('chai'),
	expect = chai.expect;

const
	errors = require('../src/errors'),
	ValenceVersions = require('../src/ValenceVersions');

const
	instanceUrl = 'http://example.com',
	supportedVersions = [{
		ProductCode: 'lp',
		LatestVersion: '1.5'
	}];

describe('ValenceVersion', function() {
	it('should require a string tenantUrl', function() {
		expect(function() {
			new ValenceVersions(1, supportedVersions);
		}).to.throw;
	});

	it('should require an array of products', function() {
		expect(function() {
			new ValenceVersions(instanceUrl, 1);
		}).to.throw;
	});

	it('should require each product have a ProductCode string', function() {
		expect(function() {
			new ValenceVersions(instanceUrl, [{
				ProductCode: 1,
				LatestVersion: '1.5'
			}]);
		}).to.throw;
	});

	it('should require each product have a LatestVersion string', function() {
		expect(function() {
			new ValenceVersions(instanceUrl, [{
				ProductCode: 'lp',
				LatestVersion: 1
			}]);
		}).to.throw;
	});

	it('should have a tenantUrl property', function() {
		const ver = new ValenceVersions(instanceUrl, supportedVersions);
		expect(ver.tenantUrl).to.equal(instanceUrl);
	});

	describe('getting product version', function() {
		it('should return the latest version of the desired product', function() {
			const ver = new ValenceVersions(instanceUrl, supportedVersions);
			expect(ver.resolveVersion('lp')).to.equal('1.5');
		});

		it('should return the latest matching version of the desired product', function() {
			const ver = new ValenceVersions(instanceUrl, supportedVersions);
			expect(ver.resolveVersion('lp', '^1.3.0')).to.equal('1.5');
		});

		it('should throw if no matching version of the desired product is found', function() {
			const ver = new ValenceVersions(instanceUrl, supportedVersions);
			expect(ver.resolveVersion.bind(ver, 'lp', '^1.6.0')).to.throw(errors.NoMatchingVersionFound);
		});

		it('should throw if the desired product is not found', function() {
			const ver = new ValenceVersions(instanceUrl, supportedVersions);
			expect(ver.resolveVersion.bind(ver, 'le', '1.5')).to.throw(errors.ProductNotSupported);
		});

		it('should throw if the given semver range is invalid', function() {
			const ver = new ValenceVersions(instanceUrl, supportedVersions);
			expect(ver.resolveVersion.bind(ver, 'lp', 'foo')).to.throw(errors.InvalidSemVerRange);
		});
	});
});
