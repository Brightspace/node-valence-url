/* global describe, it, beforeEach, afterEach */

'use strict';

const
	chai = require('chai'),
	expect = chai.expect,
	nock = require('nock');

const
	errors = require('../src/errors'),
	ValenceVersions = require('../src/ValenceVersions');

const
	instanceUrl = 'http://example.com',
	authToken = 'foo';

require('co-mocha');

describe('ValenceVersion', function() {
	it('should require a string tenantUrl', function() {
		expect(function() {
			new ValenceVersions(1, authToken);
		}).to.throw;
	});

	it('should require a string authToken', function() {
		expect(function() {
			new ValenceVersions(instanceUrl, 1);
		}).to.throw;
	});

	describe('resolveVersion', function() {
		let lms;

		beforeEach(function() {
			lms = nock(instanceUrl)
				.get('/d2l/api/versions/')
				.reply(200, [{
					ProductCode: 'lp',
					LatestVersion: '1.5'
				}]);
		});

		afterEach(function() {
			lms.done();
		});

		it('should return the latest version of the desired product', function*() {
			const ver = new ValenceVersions(instanceUrl, authToken);
			expect(yield ver.resolveVersion('lp')).to.equal('1.5');
			lms.done();
		});

		it('should return the latest matching version of the desired product', function*() {
			const ver = new ValenceVersions(instanceUrl, authToken);
			expect(yield ver.resolveVersion('lp', '^1.3.0')).to.equal('1.5');
		});

		it('should throw if the desired product is not found', function*() {
			const ver = new ValenceVersions(instanceUrl, authToken);

			let err;
			try {
				yield ver.resolveVersion('le', '1.5');
			} catch (e) {
				err = e;
			}
			expect(err).to.be.an.instanceof(errors.ProductNotSupported);
		});

		it('should throw if no matching version of the desired product is found', function*() {
			const ver = new ValenceVersions(instanceUrl, authToken);

			let err;
			try {
				yield ver.resolveVersion('lp', '^1.6.0');
			} catch (e) {
				err = e;
			}
			expect(err).to.be.an.instanceof(errors.NoMatchingVersionFound);
		});

		it('should throw if the given semver range is invalid', function*() {
			const ver = new ValenceVersions(instanceUrl, authToken);

			let err;
			try {
				yield ver.resolveVersion('lp', 'foo');
			} catch (e) {
				err = e;
			}
			expect(err).to.be.an.instanceof(errors.InvalidSemVerRange);
		});
	});
});
