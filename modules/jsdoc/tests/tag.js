/**
	@overview Testing the jsdoc/tag module.
	@author Michael Mathews <micmath@gmail.com>
	@license Apache License 2.0 - See file 'LICENSE.markdown' in this project.
 */
var test = require('jsdoc/test');
var tag = require('jsdoc/tag');

exports.testTagAPI = function() {
	test.expect(1);
	
	test.assertEqual(
		'function', typeof tag.fromTagText, 'tag.fromTagText is defined as a function'
	);
}

exports.testTagFromTagText = function() {
	test.expect(3);
	
	var myTag = tag.fromTagText("zip     La dee dah.\n");
	test.assertEqual(
		'Tag', myTag.constructor.name, 'tag.fromTagText returns a Tag'
	);
	
	test.assertEqual(
		'zip', myTag.name, 'tag name is found'
	);
	
	test.assertEqual(
		'La dee dah.', myTag.text, 'tag text is found'
	);
}

exports.testTagType = function() {
	test.expect(4);
	
	var myTag = tag.fromTagText("zip { number } La dee dah.");
	
	test.assertEqual(
		'zip', myTag.name, 'tag name is found when type is present'
	);
	
	test.assertEqual(
		'La dee dah.', myTag.text, 'tag text is found when type is present'
	);
	
	test.assertEqual(
		'number', myTag.type, 'tag type is found'
	);
	
	myTag = tag.fromTagText("zip {{x: number, y: number} } La dee dah.");
	
	test.assertEqual(
		 '{x: number, y: number}', myTag.type, 'tag type can contain curly braces'
	);
}

exports.testTagReturns = function() {
	test.expect(3);
	
	// white space (including returns) should be trimmed
	var myTag = tag.fromTagText("returns	 {	String}\n\r	The name of the Foo.\n	");
	
	test.assertEqual(
		'returns', myTag.name, 'tag returns name is found'
	);
	
	test.assertEqual(
		'String', myTag.type, 'tag returns type is found, leading whitespace trimmed'
	);
	
	test.assertEqual(
		'The name of the Foo.', myTag.text, 'tag returns desc is found, wrapping whitespace trimmed'
	);
}