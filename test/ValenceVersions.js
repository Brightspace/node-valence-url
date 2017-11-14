/* global describe, it */

'use strict';

const
	chai = require('chai'),
	expect = chai.expect,
	nock = require('nock');

const
	errors = require('../src/errors'),
	ValenceVersions = require('../src/ValenceVersions');

const
	tenantUrl = 'http://example.com',
	authToken = 'foo',
	versions = [{
		ProductCode: 'foo',
		LatestVersion: '1.5',
		SupportedVersions: [ '1.4', '1.5', '1.3' ]
	}, {
		ProductCode: 'bar',
		LatestVersion: '1.6',
		SupportedVersions: [ '1.3', '1.4', '1.5', '1.6' ]
	}],
	opts = {
		tenantUrl: tenantUrl,
		authToken: authToken,
		versions: versions
	};

require('co-mocha');

describe('ValenceVersion', function() {
	it('should auto-instantiate', function() {
		expect(ValenceVersions(opts)).to.be.an.instanceof(ValenceVersions);
	});

	it('should require opts be an object', function() {
		expect(function() {
			new ValenceVersions(1);
		}).to.throw(TypeError);
	});

	it('should require opts.tenantUrl be a string', function() {
		expect(function() {
			new ValenceVersions({
				tenantUrl: 1,
				authToken: authToken,
				versions: versions
			});
		}).to.throw(TypeError);
	});

	it('should require opts.versions be an Array', function() {
		expect(function() {
			new ValenceVersions({
				tenantUrl: tenantUrl,
				versions: 1
			});
		}).to.throw(TypeError);
	});

	it('should require opts.authToken be a string', function() {
		expect(function() {
			new ValenceVersions({
				tenantUrl: tenantUrl,
				authToken: 1
			});
		}).to.throw(TypeError);
	});

	it('should require either an authToken or versions', function() {
		expect(function() {
			new ValenceVersions({
				tenantUrl: tenantUrl
			});
		}).to.throw(TypeError);
	});

	it('should work with just a string authToken', function() {
		expect(function() {
			new ValenceVersions({
				tenantUrl: tenantUrl,
				authToken: authToken
			});
		}).to.not.throw(TypeError);
	});

	it('should work with just an Array of versions', function() {
		expect(function() {
			new ValenceVersions({
				tenantUrl: tenantUrl,
				versions: versions
			});
		}).to.not.throw(TypeError);
	});

	it('should require each product have SupportedVersions', function() {
		expect(function() {
			new ValenceVersions({
				tenantUrl: tenantUrl,
				versions: [{
					ProductCode: 'foo',
					LatestVersion: '1.5'
				}]
			});
		}).to.throw(TypeError);
	});

	describe('without versions given (with authToken)', function() {
		it('should call the LMS', function*() {
			const lms = nock(tenantUrl)
				.get('/d2l/api/versions/')
				.reply(200, versions);

			const ver = new ValenceVersions({
				tenantUrl: tenantUrl,
				authToken: authToken
			});
			yield ver.resolveVersion('foo');

			// Throws if not called
			lms.done();
		});

		it('should throw if the response had an error', function*() {
			const lms = nock(tenantUrl)
				.get('/d2l/api/versions/')
				.reply(500);

			const ver = new ValenceVersions({
				tenantUrl: tenantUrl,
				authToken: authToken
			});

			let err;
			try {
				yield ver.resolveVersion('foo');
			} catch (e) {
				err = e;
			}
			expect(err).to.be.an.instanceof(Error);

			lms.done();
		});
		[['no body', null], ['string', 'cats'], ['non-array object', {}], ['array of objects with missing properties', [{}]]].forEach(function(params) {
			it(`should reject if the response is of an unexpected format (${params[0]})`, function*() {
				const lms = nock(tenantUrl)
					.get('/d2l/api/versions/')
					.reply(200, params[1]);

				const ver = new ValenceVersions({ tenantUrl, authToken });

				let err;
				try {
					yield ver.resolveVersion('foo');
				} catch (e) {
					err = e;
				}

				expect(err).to.be.an.instanceof(Error);

				lms.done();
			});
		});

		it('should properly parse the LMS reply', function*() {
			const lms = nock(tenantUrl)
				.get('/d2l/api/versions/')
				.reply(200, versions);

			const ver = new ValenceVersions({
				tenantUrl: tenantUrl,
				authToken: authToken
			});
			expect(yield ver.resolveVersion('foo')).to.equal('1.5');

			lms.done();
		});

		it('should only call the LMS on the first call to resolveVersion', function*() {
			const lms = nock(tenantUrl)
				.get('/d2l/api/versions/')
				.reply(200, versions);

			const ver = new ValenceVersions({
				tenantUrl: tenantUrl,
				authToken: authToken
			});
			yield ver.resolveVersion('foo');

			lms.done();

			// Would throw if LMS got called after being .done()
			yield ver.resolveVersion('foo');
		});
	});

	describe('resolveVersion', function() {
		it('should not call the LMS if versions are supplied', function*() {
			const ver = new ValenceVersions(opts);
			// This would throw if the LMS got called, as there is no mock set up
			expect(yield ver.resolveVersion('foo')).to.equal('1.5');
		});

		it('should throw if the desired product is not found', function*() {
			const ver = new ValenceVersions(opts);

			let err;
			try {
				yield ver.resolveVersion('baz', '1.5');
			} catch (e) {
				err = e;
			}
			expect(err).to.be.an.instanceof(errors.ProductNotSupported);
		});

		it('should give the unstable route, if requested', function*() {
			const ver = new ValenceVersions(opts);
			expect(yield ver.resolveVersion('foo', 'unstable')).to.equal('unstable');
		});

		it('should return the latest version of the desired product', function*() {
			const ver = new ValenceVersions(opts);
			expect(yield ver.resolveVersion('foo')).to.equal('1.5');
		});

		it('should throw if the given semver range is invalid', function*() {
			const ver = new ValenceVersions(opts);

			let err;
			try {
				yield ver.resolveVersion('foo', 'foo');
			} catch (e) {
				err = e;
			}
			expect(err).to.be.an.instanceof(errors.InvalidSemVerRange);
		});

		it('should return the latest version of the desired product if it satisfies the semver', function*() {
			const ver = new ValenceVersions(opts);
			expect(yield ver.resolveVersion('foo', '^1.4')).to.equal('1.5');
		});

		it('should work with non-latest versions', function*() {
			const ver = new ValenceVersions(opts);
			expect(yield ver.resolveVersion('foo', '1.4')).to.equal('1.4');
		});

		it('should return the highest-possible version that satistfies the semver', function*() {
			const ver = new ValenceVersions(opts);
			expect(yield ver.resolveVersion('foo', '1.3.0 - 1.4.0')).to.equal('1.4');
		});

		it('should throw if no matching version of the desired product is found', function*() {
			const ver = new ValenceVersions(opts);

			let err;
			try {
				yield ver.resolveVersion('foo', '^1.6');
			} catch (e) {
				err = e;
			}
			expect(err).to.be.an.instanceof(errors.NoMatchingVersionFound);
		});
	});
});
