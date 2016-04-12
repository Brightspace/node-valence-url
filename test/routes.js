/* global describe, it */

'use strict';

const
	chai = require('chai'),
	expect = chai.expect;

const
	routes = require('../src/routes'),
	SimpleValenceRoute = routes.SimpleValenceRoute,
	VersionedValenceRoute = routes.VersionedValenceRoute;

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
});
