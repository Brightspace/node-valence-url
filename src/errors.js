'use strict';

const util = require('util');

function ProductNotSupportedError(product) {
	this.name = 'ProductNotSupportedError';
	this.message = `"${ product }" is not a valid product on this LMS`;
}
util.inherits(ProductNotSupportedError, Error);

module.exports = {
	ProductNotSupported: ProductNotSupportedError
};
