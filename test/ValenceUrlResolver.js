/* global describe, it */

'use strict';

const
	chai = require('chai'),
	expect = chai.expect;

const
	ValenceUrlResolver = require('../src/ValenceUrlResolver'),
	ValenceVersions = require('../src/ValenceVersions'),
	route = require('../src/routes'),
	VersionedValenceRoute = route.VersionedValenceRoute;

const supportedVersions = new ValenceVersions([{
	ProductCode: 'lp',
	LatestVersion: '1.6'
}]);

describe('ValenceUrlResolver', function() {
	it('should require an instance of ValenceVersions', function() {
		expect(function() {
			new ValenceUrlResolver(1);
		}).to.throw;
	});

	it('should work', function() {
		const resolver = new ValenceUrlResolver(supportedVersions);

		const route = new VersionedValenceRoute('lp', 'foo', 'bar', '^1.5');

		expect(resolver.resolve(route)).to.equal('foo/1.6/bar');
	});
});
