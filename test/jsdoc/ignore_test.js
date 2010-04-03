function sample() {
	var foo, bar;
	
	/** This is documented.
		@namespace foo
	*/
	foo = {};
	
	/** This is also documented.
		@namespace foo.fiz
	*/
	foo.fiz = {};
	
	/** This is ignored.
		@ignore
		@namespace bar
	 */
	bar = {};
	
	/** This is not ignored.
		@namespace bar.biz
	 */
	bar.biz = {};
}



include('ringo/unittest');
include('jsdoc/parse');

exports.setUp = exports.tearDown = function() {};

var docSet = parseDocs('apps/jsdoc-toolkit/test/jsdoc/', 'ignore_test.js');
/*debug*///docSet.docs.forEach(function($) { print('doc name: '+$.name); });

exports.testIgnore = function () {
	// can find all doc comments
	assertEqual(docSet.docs.length, 3);
}

exports.testNotIgnoredIsFound = function () {
	assertNotNull(docSet.getDocByName('foo'));
	assertNotNull(docSet.getDocByName('bar.biz'));
}

exports.testIgnoredIsNotFound = function () {
	assertEqual(docSet.getDocByName('bar'), null);
}
