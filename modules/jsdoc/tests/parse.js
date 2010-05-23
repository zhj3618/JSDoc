/**
	@overview Testing the jsdoc/parse module.
	@author Michael Mathews <micmath@gmail.com>
	@license Apache License 2.0 - See file 'LICENSE.markdown' in this project.
 */
var test = require('jsdoc/test');
var parse = require('jsdoc/parse');
/*debug*///var jsdump = require("flesler/jsdump").jsDump;

exports.testParseAPI = function() {
	test.expect(2);
	
	test.assertEqual(
		'function', typeof parse.parseDocs, 'parse.parseDocs is defined as a function'
	);
	
	test.assertEqual(
		0, parse.docSet.length, 'parse.docSet is defined and has an initial length of 0'
	);
}

exports.testParseNamedSimple = function() {
	test.expect(2);
	
	var filePaths = [HOME + '/modules/jsdoc/tests/parse/namedSimple.js'];
	
	parse.parseDocs(filePaths[0]);
	
	var docSet = parse.docSet;

	test.assertEqual(
		1, parse.docSet.length, 'docSet has been populated by 1 docs'
	);
	
	test.assertEqual(
		'here.Is.The#Name#', parse.docSet[0].tagText('name'), 'the doc name is set to the first word of the @name'
	);
}

exports.testParseNamedSimpleDesc = function() {
	test.expect(1);
	
	var filePaths = [HOME + '/modules/jsdoc/tests/parse/namedSimple.js'];
	
	parse.docSet.length = 0;
	parse.parseDocs(filePaths[0]);
	
	var docSet = parse.docSet;

	test.assertEqual(
		'This is the only valid doclet\nin this file.', parse.docSet[0].tagText('desc'), 'the doc desc is set to the first untagged line'
	);
}

exports.testParseNamespace = function() {
	test.expect(10);
	
	var filePaths = [HOME + '/modules/jsdoc/tests/parse/namespace.js'];
	
	parse.docSet.length = 0;
	parse.parseDocs(filePaths[0]);
	
	var docSet = parse.docSet;
	/*debug*///print('DUMP: '+jsdump.parse(docSet));

	test.assertEqual(
		5, parse.docSet.length, 'All 5 valid doclets were found: '+parse.docSet.length
	);
	
	// 0
	test.assertEqual(
		'namespace', parse.docSet[0].tagText('kind'), 'the kind can be found when there is a @namespace tag'
	);
	test.assertEqual(
		'nameFromNamespaceTag', parse.docSet[0].tagText('name'), 'the name can be found when there is a @namespace tag'
	);
	
	// 1
	test.assertEqual(
		'namespace', parse.docSet[1].tagText('kind'), 'the kind can be found when there is a @name tag plus a @namespace tag'
	);
	test.assertEqual(
		'nameFromNameTag', parse.docSet[1].tagText('name'), 'the name can be found in the @name tag when there is a @namespace tag'
	);
	
	// 2
	test.assertEqual(
		'namespace', parse.docSet[2].tagText('kind'), 'the kind can be found when there is no @name tag plus a @namespace tag'
	);
	test.assertEqual(
		'nameFromCode', parse.docSet[2].tagText('name'), 'the name can be found in the code when there is a @namespace tag'
	);
	
	// 3
	test.assertEqual(
		'nested', parse.docSet[3].tagText('name'), 'the nested name can be found in the code when there is a @namespace tag'
	);
	test.assertEqual(
		'nameFromCode.nested', parse.docSet[3].tagText('longname'), 'the nested long name can be found in the code when there is a @namespace tag'
	);
	
	// 4
	test.assertEqual(
		'nameFromVar', parse.docSet[4].tagText('name'), 'the var name can be found in the code when there is a @namespace tag'
	);
}

exports.testParseConstructor = function() {
	test.expect(13);
	
	var filePaths = [HOME + '/modules/jsdoc/tests/parse/constructor.js'];
	
	parse.docSet.length = 0;
	parse.parseDocs(filePaths[0]);
	
	var docSet = parse.docSet;
	/*debug*///print('DUMP: '+jsdump.parse(docSet));

	test.assertEqual(
		true, parse.docSet.length === 6, 'All 6 valid doclets were found: '+parse.docSet.length
	);
	
	// 0
	test.assertEqual(
		'constructor', parse.docSet[0].tagText('kind'), 'the kind can be found when there is a @constructor tag'
	);
	test.assertEqual(
		'nameFromConstructorTag', parse.docSet[0].tagText('name'), 'the name can be found in the @name tag when there is a @constructor tag'
	);
	
	// 1
	test.assertEqual(
		'constructor', parse.docSet[1].tagText('kind'), 'the kind can be found in the @constructor tag'
	);
	test.assertEqual(
		'nameFromNameTag', parse.docSet[1].tagText('name'), 'the name can be found in the @constructor tag'
	);
	
	// 2
	test.assertEqual(
		'constructor', parse.docSet[2].tagText('kind'), 'the kind can be found in the code with an empty @constructor tag'
	);
	test.assertEqual(
		'nameFromCode', parse.docSet[2].tagText('name'), 'the name can be found in the code with an empty @constructor tag'
	);
	
	// 3
	test.assertEqual(
		'constructor', parse.docSet[3].tagText('kind'), 'the kind can be found in the `var` code with an empty @constructor tag'
	);
	test.assertEqual(
		'nameFromVar', parse.docSet[3].tagText('name'), 'the name can be found in the `var` code with an empty @constructor tag'
	);
	
	// 4
	test.assertEqual(
		'constructor', parse.docSet[4].tagText('kind'), 'the kind can be found in the `var` code list with an empty @constructor tag'
	);
	test.assertEqual(
		'anotherNameFromVar', parse.docSet[4].tagText('name'), 'the name can be found in the `var` code list with an empty @constructor tag'
	);
	
	// 5
	test.assertEqual(
		'constructor', parse.docSet[5].tagText('kind'), 'the kind can be found in the function declaration code with an empty @constructor tag'
	);
	test.assertEqual(
		'fromFunction', parse.docSet[5].tagText('name'), 'the name can be found in the function declaration code with an empty @constructor tag'
	);
}

exports.testParsePrototype = function() {
 	test.expect(5);
 	
 	var filePaths = [HOME + '/modules/jsdoc/tests/parse/prototype.js'];
 	
 	parse.docSet.length = 0;
 	parse.parseDocs(filePaths[0]);
 	
 	var docSet = parse.docSet;
 	
 	test.assertEqual(
 		true, parse.docSet.length === 6, 'All 6 valid doclets were found: '+parse.docSet.length
 	);
 	
 	var docs = docSet.getDocsByName('Foo#memberfoo1');
 	
 	test.assertEqual(
 		1, docs.length, 'Renamed `this` using @methodof tag: Foo#memberfoo1'
 	);
 	
 	docs = docSet.getDocsByName('Base#memberbase1');
 	
 	test.assertEqual(
 		1, docs.length, 'Can resolve `this` inside a function declaration: Base#memberbase'
 	);
 	
 	docs = docSet.getDocsByName('Foo#memberfoo2');
 	
 	test.assertEqual(
 		1, docs.length, 'Can resolve memberof for method inside an object literal: Foo#memberfoo2'
 	);
 	
 	docs = docSet.getDocsByName('Base#memberbase2');
 	
 	test.assertEqual(
 		1, docs.length, 'Prototype name is reduced to # in tagged name: Base#memberbase2'
 	);
}

exports.testParseExports = function() {
	test.expect(3);
	
	var filePaths = [HOME + '/modules/jsdoc/tests/parse/exports.js'];
	
	parse.docSet.length = 0;
	parse.parseDocs(filePaths[0]);
	
	var docSet = parse.docSet;
	/*debug*///print('DUMP: '+jsdump.parse(docSet));

	var docs = docSet.getDocsByName('math/geom');
	
	test.assertEqual(
		1, docs.length, 'Module math/geom was found.'
	);

	var doc = docs[0].toObject();
	test.assertEqual(
 		'object', typeof doc.exports, 'Module math/geom exports is an object.'
 	);
 	
 	
 	test.assertEqual(
 		2, doc.exports.length, 'Module math/geom exports 2 members.'
 	);
}