'use strict';

const util = require('util');

function InvalidSemVerRangeError(semver) {
	this.name = 'InvalidSemVerRangeError';
	this.message = `"${ semver }" is not a valid semver range`;
}
util.inherits(InvalidSemVerRangeError, Error);

function NoMatchingVersionFoundError(tenantUrl, supported, desired) {
	this.name = 'NoMatchingVersionFoundError';
	this.message = `No version matching ${ desired } found; supported versions are: ${ supported } (${tenantUrl})`;
}
util.inherits(NoMatchingVersionFoundError, Error);

function ProductNotSupportedError(tenantUrl, product) {
	this.name = 'ProductNotSupportedError';
	this.message = `"${ product }" is not a valid product on this LMS (${tenantUrl}).`;
}
util.inherits(ProductNotSupportedError, Error);

function UnexpectedVersionsResponseError(tenantUrl, inner) {
	this.name = 'UnexpectedVersionsResponseError';
	this.message = `An unexpected response was received when requesting versions from the LMS (${tenantUrl})`;

	this.inner = inner;
}
util.inherits(UnexpectedVersionsResponseError, Error);

module.exports = {
	InvalidSemVerRange: InvalidSemVerRangeError,
	NoMatchingVersionFound: NoMatchingVersionFoundError,
	ProductNotSupported: ProductNotSupportedError,
	UnexpectedVersionsResponse: UnexpectedVersionsResponseError
};
