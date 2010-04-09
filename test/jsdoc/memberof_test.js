function sample() {
	var foo = {}, bar;
	
	/** This is documented.
		@namespace foo
	*/
	
	/** typical memberof.
		@namespace fiz
		@memberof foo
	*/
	foo.fiz = {};
	
	/** Letter case shouldn't matter
		@method foz
		@MEMBEROF foo
	*/
	foo.foz = function() {};
	
	/** can shorten to just "@member".
		@property fuz
		@member foo
	*/
	foo.fuz = {};
}


include('ringo/unittest');
include('jsdoc/parse');

exports.setUp = exports.tearDown = function() {};

var docSet = parseDocs('apps/jsdoc-toolkit/test/jsdoc/', 'memberof_test.js');
/*debug*///docSet.docs.forEach(function($) { print('doc name: '+$.name); });

exports.testmemberof = function () {
	var doc = docSet.getDocByName('foo.fiz');
	assertNotNull(doc);
	assertEqual(doc.name, 'foo.fiz');
	assertEqual(doc.memberof, 'foo');
	assertEqual(doc.shortname, 'fiz');
}

exports.testmemberofUpcase = function () {
	var doc = docSet.getDocByName('foo.foz');
	assertNotNull(doc);
	assertEqual(doc.name, 'foo.foz');
	assertEqual(doc.memberof, 'foo');
	assertEqual(doc.shortname, 'foz');
}

exports.testmember = function () {
	var doc = docSet.getDocByName('foo.fuz');
	assertNotNull(doc);
	assertEqual(doc.name, 'foo.fuz');
	assertEqual(doc.memberof, 'foo');
	assertEqual(doc.shortname, 'fuz');
}