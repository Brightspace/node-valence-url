/* global describe, it, beforeEach */

'use strict';

const
	chai = require('chai'),
	expect = chai.expect;

const
	ValenceUrlResolver = require('../src/ValenceUrlResolver'),
	ValenceRoute = require('../src/ValenceRoute'),
	SimpleRoute = ValenceRoute.Simple,
	VersionedRoute = ValenceRoute.Versioned,
	LERoute = ValenceRoute.LE,
	LPRoute = ValenceRoute.LP;

const
	instanceUrl = 'http://example.com',
	authToken = 'foo';

require('co-mocha');

describe('ValenceUrlResolver', function() {
	it('should require a string tenantUrl', function() {
		expect(function() {
			new ValenceUrlResolver(1, authToken);
		}).to.throw;
	});

	it('should require a string authToken', function() {
		expect(function() {
			new ValenceUrlResolver(instanceUrl, 1);
		}).to.throw;
	});

	it('should have a tenantUrl property', function() {
		const res = new ValenceUrlResolver(instanceUrl, authToken);
		expect(res.tenantUrl).to.equal(instanceUrl);
	});

	describe('resolve', function() {
		let resolver;

		beforeEach(function() {
			resolver = new ValenceUrlResolver(instanceUrl, authToken);
			resolver._versions.resolveVersion = function*() {
				return Promise.resolve('1.6');
			};
		});

		it('should resolve a string route correctly', function*() {
			expect(yield resolver.resolve('foo', '?query=string')).to.equal('http://example.com/foo?query=string');
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
