function sample() {
	/** 
		Not a method.
		@namespace ns
	*/
	var ns = {
	}
	
	/** @constructor Foo */
	function Foo() {
	}
	
	/** 
		@method Foo#bar1
	*/
	Foo.prototype.bar1 = function() {
	}
	
	/** 
		@method
	*/
	Foo.prototype.bar2 = function() {
	}
	
	/** This has no name tag or method tag. */
	Foo.prototype.bar3 = function() {
	}
	
	/** Me neither. */
	Foo.prototype.bar4 = new function() {
	}
	
	/** Global function. */
	function fizzle() {
	}
	
	/** Another global function. */
	var fazzle = function() {
	}
}


include('ringo/unittest');
include('jsdoc/parse');

exports.setUp = exports.tearDown = function() {}

var docSet = parseDocs('apps/jsdoc-toolkit/test/jsdoc/', 'isa_test.js');

exports.testBasic = function () {
	// can find all doc comments
	assertEqual(docSet.docs.length, 8);
	
	// @name given
	var doc = docSet.getDocByName('Foo');
	assertNotNull(doc);
}

exports.testFindIsaNsNameGiven = function () {
	var doc = docSet.getDocByName('ns');
	assertNotNull(doc);
	assertEqual(doc.isa, 'namespace');
}

exports.testFindIsaConstructorNameGiven = function () {
	var doc = docSet.getDocByName('Foo');
	assertNotNull(doc);
	assertEqual(doc.isa, 'constructor');
}

exports.testFindIsaMethodNameGiven = function () {
	var doc = docSet.getDocByName('Foo#bar1');
	assertNotNull(doc);
	assertEqual(doc.isa, 'method');
}

exports.testFindIsaMethodTag = function () {
	var doc = docSet.getDocByName('Foo#bar2');
	assertNotNull(doc);
	assertEqual(doc.isa, 'method');
}

exports.testFindIsaNoTag = function () {
	var doc = docSet.getDocByName('Foo#bar3');
	assertNotNull(doc);
	assertEqual(doc.isa, 'method');
	
	doc = docSet.getDocByName('Foo#bar4');
	assertNotNull(doc);
	assertEqual(doc.isa, 'method');
}

exports.testFindIsaGlobalFunction = function () {
	var doc = docSet.getDocByName('fizzle');
	assertNotNull(doc);
	assertEqual(doc.isa, 'method');
}

exports.testFindIsaGlobalAssign = function () {
	var doc = docSet.getDocByName('fazzle');
	assertNotNull(doc);
	assertEqual(doc.isa, 'method');
}