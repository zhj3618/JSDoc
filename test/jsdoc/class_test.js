function sample() { // the @class tag

	/**
		@class This is a description of the Foo class.
		@constructor Foo
	*/
	function Foo() { // name in docs, constructor tag
	}

	/**
		@class  This is a description of the Bar class.
		@constructor
	*/
	function Bar(a, b) { // no name in docs, constructor tag
	}
	
	/**
		@class  This is a description of the Bar class.
	*/
	function Zop(a, b) { // no name in docs, no constructor tag
	}
}


include('ringo/unittest');
include('jsdoc/parse');

exports.setUp = exports.tearDown = function() {}

var docSet = parseDocs('apps/jsdoc-toolkit/test/jsdoc/', 'class_test.js');
/*debug*///docSet.docs.forEach(function($) { print('doc name: '+$.name); });

exports.testBasic = function () {
	// can find all doc comments
	assertEqual(3, docSet.docs.length);
}

exports.testClassWithConstructorName = function () {
	var doc = docSet.getDocByName('Foo');
	assertNotNull(doc);
	assertEqual(doc.isa, 'constructor');
}

exports.testClassWithConstructor = function () {
	var doc = docSet.getDocByName('Bar');
	assertNotNull(doc);
	assertEqual(doc.isa, 'constructor');
}

exports.testJustClass = function () {
	var doc = docSet.getDocByName('Zop');
	assertNotNull(doc);
	assertEqual(doc.isa, 'constructor');
}
