function sample() {
	var foo = {}, Bar = function(){};
	
	/** 
		@namespace foo
	*/
	
	/** 
		@constructor Bar
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
	
	/** Memberof prototype.
		@property baz
		@memberOf Bar.prototype
	*/
	Bar.prototype.baz = 1;
	
	/** Memberof hash.
		@property bef
		@member Bar#
	*/
	Bar.prototype.bef = 1;
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

exports.testmember = function () {
	var doc = docSet.getDocByName('Bar#baz');
	assertNotNull(doc);
	assertEqual(doc.name, 'Bar#baz');
	assertEqual(doc.memberof, 'Bar#');
	assertEqual(doc.shortname, 'baz');
}

exports.testmember = function () {
	var doc = docSet.getDocByName('Bar#bef');
	assertNotNull(doc);
	assertEqual(doc.name, 'Bar#bef');
	assertEqual(doc.memberof, 'Bar#');
	assertEqual(doc.shortname, 'bef');
}