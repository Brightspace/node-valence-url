/* global describe, it, beforeEach */

'use strict';

const
	chai = require('chai'),
	expect = chai.expect;

const
	ValenceUrlResolver = require('../src/ValenceUrlResolver'),
	ValenceRoute = require('../src/ValenceRoute'),
	ValenceVersions = require('../src/ValenceVersions'),
	SimpleRoute = ValenceRoute.Simple,
	VersionedRoute = ValenceRoute.Versioned,
	LERoute = ValenceRoute.LE,
	LPRoute = ValenceRoute.LP;

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
		SupportedVersions: [ '1.4', '1.5', '1.3' ]
	}],
	opts = {
		tenantUrl: tenantUrl,
		authToken: authToken,
		versions: versions
	};

require('co-mocha');

describe('ValenceUrlResolver', function() {
	it('should require opts be an object', function() {
		expect(function() {
			new ValenceUrlResolver(1);
		}).to.throw(TypeError);
	});

	it('should require opts.tenantUrl be a string', function() {
		expect(function() {
			new ValenceUrlResolver({
				tenantUrl: 1,
				authToken: authToken,
				versions: versions
			});
		}).to.throw(TypeError);
	});

	it('should require a string authToken', function() {
		expect(function() {
			new ValenceUrlResolver({
				tenantUrl: tenantUrl,
				authToken: 1
			});
		}).to.throw(TypeError);
	});

	it('should require an array of versions', function() {
		expect(function() {
			new ValenceUrlResolver({
				tenantUrl: tenantUrl,
				versions: 1
			});
		}).to.throw(TypeError);
	});

	it('should require either an authToken or versions', function() {
		expect(function() {
			new ValenceUrlResolver({
				tenantUrl: tenantUrl
			});
		}).to.throw(TypeError);
	});

	it('should work with just a string authToken', function() {
		expect(function() {
			new ValenceUrlResolver({
				tenantUrl: tenantUrl,
				authToken: authToken
			});
		}).to.not.throw(TypeError);
	});

	it('should work with just an Array of versions', function() {
		expect(function() {
			new ValenceUrlResolver({
				tenantUrl: tenantUrl,
				versions: versions
			});
		}).to.not.throw(TypeError);
	});

	it('should have a tenantUrl property', function() {
		const res = new ValenceUrlResolver(opts);
		expect(res.tenantUrl).to.equal(tenantUrl);
	});

	it('should have a versions property', function() {
		const res = new ValenceUrlResolver(opts);
		expect(res.versions).to.be.an.instanceof(ValenceVersions);
	});

	describe('resolve', function() {
		let resolver;

		beforeEach(function() {
			resolver = new ValenceUrlResolver(opts);
			resolver._versions.resolveVersion = function() {
				return Promise.resolve('1.6');
			};
		});

		it('should require the route be a ValenceRoute', function*() {
			let err;
			try {
				yield resolver.resolve(1);
			} catch (e) {
				err = e;
			}
			expect(err).to.be.an.instanceof(TypeError);
		});

		it('should resolve a string route correctly', function*() {
			expect(yield resolver.resolve('foo')).to.equal('http://example.com/foo');
		});

		it('should resolve a Simple route correctly', function*() {
			const route = new SimpleRoute('/d2l/api/versions/');
			expect(yield resolver.resolve(route)).to.equal('http://example.com/d2l/api/versions/');
		});

		it('should resolve a Versioned route correctly', function*() {
			const route = new VersionedRoute('lp', 'foo', 'bar', '^1.5');
			expect(yield resolver.resolve(route)).to.equal('http://example.com/foo/1.6/bar');
		});

		it('should resolve an LE route correctly', function*() {
			const route = new LERoute('foo', '^1.5');
			expect(yield resolver.resolve(route)).to.equal('http://example.com/d2l/api/le/1.6/foo');
		});

		it('should resolve an LP route correctly', function*() {
			const route = new LPRoute('foo', '^1.5');
			expect(yield resolver.resolve(route)).to.equal('http://example.com/d2l/api/lp/1.6/foo');
		});
	});
});
