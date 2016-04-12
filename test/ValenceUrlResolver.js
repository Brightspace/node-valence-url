/* global describe, it */

'use strict';

const
	chai = require('chai'),
	expect = chai.expect;

const
	ValenceUrlResolver = require('../src/ValenceUrlResolver'),
	ValenceRoute = require('../src/ValenceRoute'),
	VersionedValenceRoute = ValenceRoute.Versioned;

const supportedVersions = [{
	ProductCode: 'lp',
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
			new ValenceUrlResolver('foo', 1);
		}).to.throw;
	});

	it('should work', function() {
		const resolver = new ValenceUrlResolver('http://example.com', supportedVersions);
		const route = new VersionedValenceRoute('lp', 'foo', 'bar', '^1.5');

		expect(resolver.resolve(route)).to.equal('http://example.com/foo/1.6/bar');
	});
});
