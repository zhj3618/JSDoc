/**
	@overview Run all unit tests.
	@author Michael Mathews <micmath@gmail.com>
	@license Apache License 2.0 - See file 'LICENSE.markdown' in this project.
 */

var test = require('jsdoc/test');

test.run(require('jsdoc/tests/opts'));
test.run(require('jsdoc/tests/src'));
test.run(require('jsdoc/tests/parse'));
test.run(require('jsdoc/tests/tag'));
test.run(require('jsdoc/tests/name'));