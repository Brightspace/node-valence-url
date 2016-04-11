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

describe('ValenceUrlResolver', function() {
	it('should work', function() {
		const versions = new ValenceVersions([{
			ProductCode: 'lp',
			SupportedVersions: ['1.4', '1.5']
		}]);

		const resolver = new ValenceUrlResolver(versions);

		const route = new VersionedValenceRoute('lp', 'foo', '1.5', 'bar');

		expect(resolver.resolve(route)).to.equal('foo/1.5/bar');
	});
});
