/* global describe, it */

'use strict';

const
	chai = require('chai'),
	expect = chai.expect;

const
	ValenceVersion = require('../src/valence-version'),
	ValenceRoute = require('../src/valence-route'),
	SimpleValenceRoute = ValenceRoute.SimpleValenceRoute,
	VersionedValenceRoute = ValenceRoute.VersionedValenceRoute,
	LERoute = ValenceRoute.LERoute,
	LPRoute = ValenceRoute.LPRoute;

const valenceVersion = new ValenceVersion('lp', '1.5');

describe('ValenceRoute', function() {
	describe('SimpleValenceRoute', function() {
		it('should require path be a string', function() {
			expect(function () {
				new SimpleValenceRoute(1);
			}).to.throw;
		});

		it('should have a path property', function() {
			const route = new SimpleValenceRoute('foo');
			expect(route.path).to.equal('foo');
		});
	});

	describe('VersionedValenceRoute', function() {
		it('should require prefix be a string', function() {
			expect(function () {
				new VersionedValenceRoute(1, valenceVersion, 'foo');
			}).to.throw;
		});

		it('should require version be a ValenceVersion', function() {
			expect(function () {
				new VersionedValenceRoute('foo', 'bar', 'foo');
			}).to.throw;
		});

		it('should require suffix be a string', function() {
			expect(function () {
				new VersionedValenceRoute('foo', valenceVersion, 1);
			}).to.throw;
		});

		it('should have a prefix property (with added slashes if required)', function() {
			let route = new VersionedValenceRoute('foo', valenceVersion, 'bar');
			expect(route.prefix).to.equal('/foo/');

			route = new VersionedValenceRoute('foo/', valenceVersion, 'bar');
			expect(route.prefix).to.equal('/foo/');

			route = new VersionedValenceRoute('/foo', valenceVersion, 'bar');
			expect(route.prefix).to.equal('/foo/');
		});

		it('should have a version property', function() {
			const route = new VersionedValenceRoute('foo', valenceVersion, 'bar');
			expect(route.version).to.equal(valenceVersion);
		});

		it('should have a suffix property (with added slash if required)', function() {
			let route = new VersionedValenceRoute('foo', valenceVersion, 'bar');
			expect(route.suffix).to.equal('/bar/');

			route = new VersionedValenceRoute('foo', valenceVersion, '/bar');
			expect(route.suffix).to.equal('/bar/');

			route = new VersionedValenceRoute('foo', valenceVersion, 'bar/');
			expect(route.suffix).to.equal('/bar/');
		});
	});

	describe('LERoute', function() {
		it('should set prefix, version, and suffix correctly', function() {
			const route = new LERoute('1.4', 'foo');
			expect(route.prefix).to.equal('/d2l/api/le/');
			expect(route.version.productCode).to.equal('le');
			expect(route.version.versionString).to.equal('1.4');
			expect(route.suffix).to.equal('/foo/');
		});
	});

	describe('LPRoute', function() {
		it('should set prefix, version, and suffix correctly', function() {
			const route = new LPRoute('1.4', 'foo');
			expect(route.prefix).to.equal('/d2l/api/lp/');
			expect(route.version.productCode).to.equal('lp');
			expect(route.version.versionString).to.equal('1.4');
			expect(route.suffix).to.equal('/foo/');
		});
	});
});
