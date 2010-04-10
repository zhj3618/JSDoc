function sample() {
	var foo, bar;
	
	/** member is the name of a tag.
		@namespace foo
	*/
	foo = {};
	
	/** @description is a synonym for @desc
		@namespace bar
	*/
	bar = {};
	
	/** @desc is the preferred tag.
		@property foo.faz
	*/
	foo.faz = {};
	
	/** 
		@property foo.fiz
		@desc order doesn't matter.
	*/
	foo.fiz = {};
	
	/** 
	 * @desc can span
	 *  more than one line.
	 * @property foo.fuz	
	 */
	foo.fuz = {};
}


include('ringo/unittest');
include('jsdoc/parse');

exports.setUp = exports.tearDown = function() {};

var docSet = parseDocs('apps/jsdoc-toolkit/test/jsdoc/', 'desc_test.js');
/*debug*///docSet.docs.forEach(function($) { print('doc name: '+$.name); });

exports.testTagConfusion = function () {
	var doc = docSet.getDocByName('foo'); // not a member of "is the name of a tag."
	assertNotNull(doc);
}

exports.testDescSynonym = function () {
	var doc = docSet.getDocByName('bar');
	assertEqual(doc.desc, 'is a synonym for @desc');
}

exports.testDesc = function () {
	var doc = docSet.getDocByName('foo.faz');
	assertEqual(doc.desc, 'is the preferred tag.');
}

exports.testDescOrder = function () {
	var doc = docSet.getDocByName('foo.fiz');
	assertEqual(doc.desc, 'order doesn\'t matter.');
}

exports.testDescLines = function () {
	var doc = docSet.getDocByName('foo.fuz');
	assertEqual(doc.desc, "can span\n more than one line.");
}