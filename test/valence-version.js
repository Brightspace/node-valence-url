/* global describe, it */

'use strict';

const
	chai = require('chai'),
	expect = chai.expect;

const
	ValenceVersion = require('../src/index').ValenceVersion;

describe('ValenceVersion', function() {
	it('should require product version be a string', function() {
		expect(function () {
			new ValenceVersion(1, '1.5')
		}).to.throw;
	});

	it('should require Valence API version be a string', function() {
		expect(function () {
			new ValenceVersion('lp', 1.5)
		}).to.throw;
	});

	it('should return productCode and versionString strings', function() {
		const ver = new ValenceVersion('lp', '1.5');
		expect(ver.productCode).to.equal('lp');
		expect(ver.versionString).to.equal('1.5');
	});

	it('should properly match against other versions', function() {
		let ver = new ValenceVersion('lp', '1.5');
		expect(ver.matches('1.5')).to.be.true;

		ver = new ValenceVersion('lp', '^1.5');
		expect(ver.matches('1.4')).to.be.false;
		expect(ver.matches('1.5')).to.be.true;
		expect(ver.matches('1.6')).to.be.true;
	});

	it('should be able to identify if it is a concrete version', function() {
		let ver = new ValenceVersion('lp', '1.5');
		expect(ver.isConcrete()).to.be.true;

		ver = new ValenceVersion('lp', '^1.5');
		expect(ver.isConcrete()).to.be.false;
	});
});
