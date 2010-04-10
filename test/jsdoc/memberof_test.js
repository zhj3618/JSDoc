function sample() {
	var foo = {}, Bar = function(){};
	
	/** 
		@namespace foo
	*/
	
	/** 
		@constructor Bar
	*/
	
	/** typical member.
		@namespace fiz
		@member foo
	*/
	foo.fiz = {};
	
	/** @desc Letter case shouldn't matter
		@method foz
		@member foo
	*/
	foo.foz = function() {};
	
	/** @desc can use older synonym "@memberOf".
		@property fuz
		@memberOf foo
	*/
	foo.fuz = {};
	
	/** @desc member prototype.
		@property baz
		@member Bar.prototype
	*/
	Bar.prototype.baz = 1;
	
	/** @desc member hash.
		@property bef
		@member Bar#
	*/
	Bar.prototype.bef = 1;
	
	/** @desc First member wins.
		@property bib
		@member Bar#
		@member Gesundheit
	*/
	Bar.prototype.bib = 1;
}


include('ringo/unittest');
include('jsdoc/parse');

exports.setUp = exports.tearDown = function() {};

var docSet = parseDocs('apps/jsdoc-toolkit/test/jsdoc/', 'memberof_test.js');
/*debug*///docSet.docs.forEach(function($) { print('doc name: '+$.name); });

exports.testMember = function () {
	var doc = docSet.getDocByName('foo.fiz');
	assertNotNull(doc);
	assertEqual(doc.name, 'foo.fiz');
	assertEqual(doc.member, 'foo');
	assertEqual(doc.shortname, 'fiz');
}

exports.testMemberUpcase = function () {
	var doc = docSet.getDocByName('foo.foz');
	assertNotNull(doc);
	assertEqual(doc.name, 'foo.foz');
	assertEqual(doc.member, 'foo');
	assertEqual(doc.shortname, 'foz');
}

exports.testMemberOfSynonym = function () {
	var doc = docSet.getDocByName('foo.fuz');
	assertNotNull(doc);
	assertEqual(doc.name, 'foo.fuz');
	assertEqual(doc.member, 'foo');
	assertEqual(doc.shortname, 'fuz');
}

exports.testMemberProto = function () {
	var doc = docSet.getDocByName('Bar#baz');
	assertNotNull(doc);
	assertEqual(doc.name, 'Bar#baz');
	assertEqual(doc.member, 'Bar#');
	assertEqual(doc.shortname, 'baz');
}

exports.testMemberHash = function () {
	var doc = docSet.getDocByName('Bar#bef');
	assertNotNull(doc);
	assertEqual(doc.name, 'Bar#bef');
	assertEqual(doc.member, 'Bar#');
	assertEqual(doc.shortname, 'bef');
}

exports.testMemberMulti = function () {
	var doc = docSet.getDocByName('Bar#bib');
	assertNotNull(doc);
	assertEqual(doc.name, 'Bar#bib');
	assertEqual(doc.member, 'Bar#');
	assertEqual(doc.shortname, 'bib');
}