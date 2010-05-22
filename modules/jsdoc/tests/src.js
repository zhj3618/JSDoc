/**
	@overview Testing the jsdoc/opts module.
	@author Michael Mathews <micmath@gmail.com>
	@license Apache License 2.0 - See file 'LICENSE.markdown' in this project.
 */
var test = require('jsdoc/test');
var src = require('jsdoc/src');

// the -h/--help option
exports.testGetFilePaths = function() {
	var app = {}; // dummy
	
	test.expect(7);
	
	
	test.assertEqual(
		'function', typeof src.getFilePaths, 'src.getFilePaths is defined as a function'
	);
	
	var filePaths = src.getFilePaths([HOME+'/modules/jsdoc/tests/data/src'], 2);
	//print(filePaths.join('\n'));	
	
	test.assertEqual(
		2, filePaths.length, 'filePaths(tests/data/src) returns 2 filepaths'
	);
	
	test.assertEqual(
		filePaths[0].substr(-7), '/one.js', 'file one.js was found'
	);
	
	test.assertEqual(
		filePaths[1].substr(-7), '/two.js', 'file two.js was found'
	);
	
	
	filePaths = src.getFilePaths([HOME+'/modules/jsdoc/tests/data/'], 1);
	test.assertEqual(
		1, filePaths.length, 'filePaths(tests/data/, 1) returns 1 filepath'
	);
	
	test.assertEqual(
		true, filePaths[0].indexOf('modules/jsdoc/tests/data/zero.js') > 0, 'filePaths(tests/data/, 1) returns the complete filepath.'
	);
	
	filePaths = src.getFilePaths([HOME+'/modules/jsdoc/tests/data/'], 10);
	test.assertEqual(
		4, filePaths.length, 'filePaths(tests/data/, 4) returns 4 filepath'
	);
}
