/**
	@overview Testing the jsdoc-toolkit/opts module.
	@author Michael Mathews <micmath@gmail.com>
	@license Apache License 2.0 - See file 'LICENSE.markdown' in this project.
 */
var test = require('jsdoc-toolkit/test');
var src = require('jsdoc-toolkit/src');

// the -h/--help option
exports.testGetFilePaths = function() {
	var app = {}; // dummy
	
	test.expect(4);
	
	
	test.assertEqual(
		'function', typeof src.getFilePaths, 'src.getFilePaths is defined as a function'
	);
	
	var filePaths = src.getFilePaths([HOME+'/modules/jsdoc-toolkit/tests/data/src'], 2);
	//print(filePaths.join('\n'));	
	
	test.assertEqual(
		true, (filePaths.length > 1), 'filePaths(HOME) is not empty'
	);
	
	test.assertEqual(
		true, (filePaths[0].indexOf('one.js') > -1), 'file one.js was found'
	);
	
	test.assertEqual(
		true, (filePaths[1].indexOf('two.js') > -1), 'file two.js was found'
	);
}
