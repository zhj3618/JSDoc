/**
	@overview Run all unit tests.
	@author Michael Mathews <micmath@gmail.com>
	@license Apache License 2.0 - See file 'LICENSE.markdown' in this project.
 */

var test = require('jsdoc-toolkit/test');

test.run(require('jsdoc-toolkit/tests/opts'));
test.run(require('jsdoc-toolkit/tests/src'));