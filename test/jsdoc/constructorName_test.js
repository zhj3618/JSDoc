function sample() {
	var Foo1, Foo2, Foo3;
	
	/**
		@namespace
		@name ns
	 */
	ns = {};
	
	/**
		@constructor
		@name Foo1
		@memberOf ns
	 */
	Foo1 = function() {
		// most verbose technique
		// provide the name, membership and isa information separately
	};
	ns.Foo1 = Foo1;
	
	/**
		@constructor
		@name ns.Foo2
	*/
	Foo2 = function() {
		// provide the full name, which includes membership
	};
	ns.Foo2 = Foo2;
	

	/** @constructor ns.Foo3 */
	Foo3 = function() {
		// most compact way
		// provide the full name as an argument to @constructor
		
		//   @constructor x
		// equates to
		//   @name x
		//   @constructor
	}
	ns.Foo3 = Foo3;
	
	/** @constructor */
	ns.Foo4 = function() {
		// rely on the parser to find the full name for you
		// not guaranteed to work
	}
}



include('ringo/unittest');
include('jsdoc/parse');

exports.setUp = exports.tearDown = function() {}

var docSet = parseDocs('apps/jsdoc-toolkit/test/jsdoc/', 'constructorName_test.js');
/*debug*///docSet.docs.forEach(function($) { print('doc name: '+$.name); });

exports.testBasic = function () {
	// can find all doc comments
	assertEqual(docSet.docs.length, 5);
	assertNotNull(docSet.getDocByName('ns'));
}

exports.testMemberofTag = function () {
	assertNotNull(docSet.getDocByName('ns.Foo1'));
}

exports.testNameTag = function () {
	assertNotNull(docSet.getDocByName('ns.Foo2'));
}

exports.testConstructorTag = function () {
	assertNotNull(docSet.getDocByName('ns.Foo3'));
}

exports.testFromSource = function () {
	assertNotNull(docSet.getDocByName('ns.Foo4'));
}

