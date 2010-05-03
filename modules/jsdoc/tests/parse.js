/**
	@overview Testing the jsdoc/parse module.
	@author Michael Mathews <micmath@gmail.com>
	@license Apache License 2.0 - See file 'LICENSE.markdown' in this project.
 */
var test = require('jsdoc/test');
var parse = require('jsdoc/parse');
/*debug*/var jsdump = require("flesler/jsdump").jsDump;

exports.testParseAPI = function() {
	test.expect(2);
	
	test.assertEqual(
		'function', typeof parse.parseDocs, 'parse.parseDocs is defined as a function'
	);
	
	test.assertEqual(
		0, parse.docSet.length, 'parse.docSet is defined and has an initial length of 0'
	);
}

exports.testParseGetDocs = function() {
	test.expect(1);
	
	var filePaths = [HOME + '/modules/jsdoc/tests/examples/geom/twoD.js'];
	
	parse.parseDocs(filePaths[0]);
	
	var docSet = parse.docSet;

	test.assertEqual(
		5, parse.docSet.length, 'docSet has been populated by 3 docs'
	);
}

exports.testParseNameProperty = function() {
	test.expect(3);

	var shapeDocs = parse.docSet.getDocsByName('geom.twoD.Shape');
	test.assertEqual(
		'object', typeof shapeDocs[0], 'getDocsByName() returns an array with the (long) named doc'
	);
	
	test.assertEqual(
		1, shapeDocs.length, 'getDocsByName() returns an array with 1 item'
	);
	
	var doc = shapeDocs[0].toObject();
	test.assertEqual(
		'Shape', doc.name, 'Shape doc has property (short) name set to "Shape"'
	);
}

exports.testParseKindProperty = function() {
	test.expect(1);
	
	var shapeDocs = parse.docSet.getDocsByName('geom.twoD.Shape');
	var doc = shapeDocs[0].toObject();
	test.assertEqual(
		'constructor', doc.kind, 'Shape doc has property kind set to "constructor"'
	);
}

exports.testParseDescProperty = function() {
	test.expect(1);
	
	var shapeDocs = parse.docSet.getDocsByName('geom.twoD.Shape');
	var doc = shapeDocs[0].toObject();
	test.assertEqual(
		'A 2D shape.', doc.desc, 'Shape doc has property desc set to the first line of the comment'
	);
}

exports.testParseParamsProperty = function() {
	test.expect(6);
	
	var shapeDocs = parse.docSet.getDocsByName('geom.twoD.Shape#position');
	var doc = shapeDocs[0].toObject();
	test.assertEqual(
		'object', typeof doc.param, 'the param property is defined'
	);
	test.assertEqual(
		2, doc.param.length, 'All params are found'
	);
	
	var param1 = doc.param[0];

	test.assertEqual(
		'top', param1.name, 'Param name is found'
	);
	
	test.assertEqual(
		'The top value.', param1.desc, 'Param desc is found'
	);
	
	var param2 = doc.param[1];

	test.assertEqual(
		'left', param2.name, 'Param name is found when no pdesc'
	);
	
	test.assertEqual(
		undefined, param2.desc, 'Param desc is undefined when no pdesc'
	);
}
/* */