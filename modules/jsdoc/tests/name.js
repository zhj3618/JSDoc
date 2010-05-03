/**
	@overview Testing the jsdoc/name module.
	@author Michael Mathews <micmath@gmail.com>
	@license Apache License 2.0 - See file 'LICENSE.markdown' in this project.
 */
var test = require('jsdoc/test');
var jsdoc = {
	doclet: require('jsdoc/doclet'),
	name: require('jsdoc/name')
};

exports.testNameAPI = function() {
	test.expect(1);
	
	test.assertEqual(
		'function', typeof jsdoc.name.resolve, 'jsdoc.name.resolve is defined as a function'
	);
}

exports.testNameResolve = function() {
	test.expect(12);
	
	// simple name, no memberof
	var doclet = jsdoc.doclet.fromComment('@name foo');
	test.assertEqual(
		'foo', doclet.tagText('name'), 'name is resolved from simple name tag'
	);
	test.assertEqual(
		'', doclet.tagText('memberof'), '(empty) memberof is resolved from simple name tag'
	);
	test.assertEqual(
		'foo', doclet.tagText('longname'), 'longname is resolved from simple name tag'
	);
	
	// name and memberof
	doclet = jsdoc.doclet.fromComment('@name bar\n@memberof foo');
	test.assertEqual(
		'bar', doclet.tagText('name'), 'name is resolved from simple name tag with memberof'
	);
	test.assertEqual(
		'foo', doclet.tagText('memberof'), 'memberof is resolved from simple name tag with memberof'
	);
	test.assertEqual(
		'foo.bar', doclet.tagText('longname'), 'longname is resolved from simple name tag with memberof'
	);
	
	// overlapping name and memberof
	doclet = jsdoc.doclet.fromComment('@name foo.bar\n@memberof foo');
	test.assertEqual(
		'bar', doclet.tagText('name'), 'name is resolved from simple name tag with overlapping memberof'
	);
	test.assertEqual(
		'foo', doclet.tagText('memberof'), 'memberof is resolved from simple name tag with overlapping memberof'
	);
	test.assertEqual(
		'foo.bar', doclet.tagText('longname'), 'longname is resolved from simple name tag with overlapping memberof'
	);
	
	// name contains memberof, no memberof tag
	doclet = jsdoc.doclet.fromComment('@name foo.bar');
	test.assertEqual(
		'bar', doclet.tagText('name'), 'name is resolved from compound name'
	);
	test.assertEqual(
		'foo', doclet.tagText('memberof'), 'memberof is resolved from compound name'
	);
	test.assertEqual(
		'foo.bar', doclet.tagText('longname'), 'longname is resolved from compound name'
	);

}