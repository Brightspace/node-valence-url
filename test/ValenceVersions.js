/* global describe, it */

'use strict';

const
	chai = require('chai'),
	expect = chai.expect;

const
	errors = require('../src/errors'),
	ValenceVersions = require('../src/ValenceVersions');

describe('ValenceVersion', function() {
	it('should require an array of products', function() {
		expect(function() {
			new ValenceVersions(1);
		}).to.throw;
	});

	it('should require each product have a ProductCode string', function() {
		expect(function() {
			new ValenceVersions([{
				ProductCode: 1,
				LatestVersion: '1.5'
			}]);
		}).to.throw;
	});

	it('should require each product have a LatestVersion string', function() {
		expect(function() {
			new ValenceVersions([{
				ProductCode: 'le',
				LatestVersion: 1
			}]);
		}).to.throw;
	});

	describe('getting product version', function() {
		it('should return the latest matching version of the desired product', function() {
			const ver = new ValenceVersions([{
				ProductCode: 'le',
				LatestVersion: '1.6'
			}]);

			expect(ver.version('le', '^1.5.0')).to.equal('1.6');
		});

		it('should throw if no matching version of the desired product is found', function() {
			const ver = new ValenceVersions([{
				ProductCode: 'le',
				LatestVersion: '1.5'
			}]);

			expect(ver.version.bind(ver, 'le', '^1.6.0')).to.throw(errors.NoMatchingVersionFound);
		});

		it('should throw if the desired product is not found', function() {
			const ver = new ValenceVersions([{
				ProductCode: 'le',
				LatestVersion: '1.5'
			}]);

			expect(ver.version.bind(ver, 'lp', '1.5')).to.throw(errors.ProductNotSupported);
		});

		it('should throw if the given semver range is invalid', function() {
			const ver = new ValenceVersions([{
				ProductCode: 'le',
				LatestVersion: '1.5'
			}]);

			expect(ver.version.bind(ver, 'le', 'foo')).to.throw(errors.InvalidSemVerRange);
		});
	});
});
