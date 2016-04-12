/* global describe, it */

'use strict';

const
	chai = require('chai'),
	expect = chai.expect;

const
	ValenceUrlResolver = require('../src/ValenceUrlResolver'),
	ValenceVersions = require('../src/ValenceVersions'),
	ValenceRoute = require('../src/ValenceRoute'),
	SimpleRoute = ValenceRoute.Simple,
	VersionedRoute = ValenceRoute.Versioned,
	LERoute = ValenceRoute.LE,
	LPRoute = ValenceRoute.LP;

const
	instanceUrl = 'http://example.com',
	supportedVersions = [{
		ProductCode: 'lp',
		LatestVersion: '1.6'
	}, {
		ProductCode: 'le',
		LatestVersion: '1.6'
	}];

describe('ValenceUrlResolver', function() {
	it('should require a string tenantUrl', function() {
		expect(function() {
			new ValenceUrlResolver(1, supportedVersions);
		}).to.throw;
	});

	it('should require an array of product version info', function() {
		expect(function() {
			new ValenceUrlResolver(instanceUrl, 1);
		}).to.throw;
	});

	it('should have a tenantUrl property', function() {
		const res = new ValenceUrlResolver(instanceUrl, supportedVersions);
		expect(res.tenantUrl).to.equal(instanceUrl);
	});

	it('should have a supportedVersions property', function() {
		const res = new ValenceUrlResolver(instanceUrl, supportedVersions);
		expect(res.supportedVersions).to.be.an.instanceof(ValenceVersions);
	});

	it('should resolve a string route correctly', function() {
		const res = new ValenceUrlResolver(instanceUrl, supportedVersions);
		expect(res.resolve('foo', '?query=string')).to.equal('http://example.com/foo?query=string');
	});

	it('should resolve a Simple route correctly', function() {
		const res = new ValenceUrlResolver(instanceUrl, supportedVersions);
		const route = new SimpleRoute('/d2l/api/versions/');
		expect(res.resolve(route)).to.equal('http://example.com/d2l/api/versions/');
	});

	it('should resolve a Versioned route correctly', function() {
		const res = new ValenceUrlResolver(instanceUrl, supportedVersions);
		const route = new VersionedRoute('lp', 'foo', 'bar', '^1.5');
		expect(res.resolve(route)).to.equal('http://example.com/foo/1.6/bar');
	});

	it('should resolve an LE route correctly', function() {
		const res = new ValenceUrlResolver(instanceUrl, supportedVersions);
		const route = new LERoute('foo', '^1.5');
		expect(res.resolve(route)).to.equal('http://example.com/d2l/api/le/1.6/foo');
	});

	it('should resolve an LP route correctly', function() {
		const res = new ValenceUrlResolver(instanceUrl, supportedVersions);
		const route = new LPRoute('foo', '^1.5');
		expect(res.resolve(route)).to.equal('http://example.com/d2l/api/lp/1.6/foo');
	});
});
