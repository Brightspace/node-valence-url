/* global describe, it */

'use strict';

const
	chai = require('chai'),
	expect = chai.expect;

const
	ValenceRoute = require('../src/ValenceRoute'),
	SimpleValenceRoute = ValenceRoute.Simple,
	VersionedValenceRoute = ValenceRoute.Versioned,
	LPRoute = ValenceRoute.LP,
	LERoute = ValenceRoute.LE;

describe('SimpleValenceRoute', function() {
	it('should require the path be a string', function() {
		expect(function() {
			new SimpleValenceRoute(1);
		}).to.throw;
	});

	it('should have a path property', function() {
		const route = new SimpleValenceRoute('foo');
		expect(route.path).to.equal('foo');
	});
});

describe('VersionedValenceRoute', function() {
	it('should require a string product name', function() {
		expect(function() {
			new VersionedValenceRoute(1, 'foo', 'bar');
		}).to.throw;
	});

	it('should require a string route prefix', function() {
		expect(function() {
			new VersionedValenceRoute('foo', 1, 'bar');
		}).to.throw;
	});

	it('should require a string route suffix', function() {
		expect(function() {
			new VersionedValenceRoute('foo', 'bar', 1);
		}).to.throw;
	});

	it('should have a product property', function() {
		const route = new VersionedValenceRoute('foo', 'bar', 'baz');
		expect(route.product).to.equal('foo');
	});

	it('should have a prefix property', function() {
		const route = new VersionedValenceRoute('foo', 'bar', 'baz');
		expect(route.product).to.equal('foo');
	});

	it('should append a trailing / to the prefix, if required', function() {
		let route = new VersionedValenceRoute('foo', 'bar', 'baz');
		expect(route.prefix).to.equal('bar/');

		route = new VersionedValenceRoute('foo/', 'bar', 'baz');
		expect(route.prefix).to.equal('bar/');
	});

	it('should have a suffix property', function() {
		const route = new VersionedValenceRoute('foo', 'bar', 'baz');
		expect(route.product).to.equal('foo');
	});

	it('should append a leading / to the suffix, if required', function() {
		let route = new VersionedValenceRoute('foo', 'bar', 'baz');
		expect(route.suffix).to.equal('/baz');

		route = new VersionedValenceRoute('foo/', 'bar', 'baz');
		expect(route.suffix).to.equal('/baz');
	});

	it('shoud have a desiredSemVer property, if set', function() {
		const route = new VersionedValenceRoute('foo', 'bar', 'baz', '^1.5');
		expect(route.desiredSemVer).to.equal('^1.5');
	});

	describe('LEValenceRoute', function() {
		it('should have the correct properties', function() {
			const route = new LERoute('/bar');
			expect(route.product).to.equal('le');
			expect(route.prefix).to.equal('/d2l/api/le/');
		});
	});

	describe('LPValenceRoute', function() {
		it('should have the correct properties', function() {
			const route = new LPRoute('/bar');
			expect(route.product).to.equal('lp');
			expect(route.prefix).to.equal('/d2l/api/lp/');
		});
	});
});
