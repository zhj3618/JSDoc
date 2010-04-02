function sample() {
	// Documenting the name of a method.
	var bar1, bar2, bar3, bar4, bar5;
	
	/**
		@constructor
		@name Foo
	 */
	Foo = function() { // the class that will contain the methods
	};
	
	/**
		@name bar1
		@memberOf Foo#
		@method
	 */
	bar1 = function() {
		// most verbose technique
		// provide the name, membership and isa information separately
		
		//   @methodOf x
		// equates to
		//   @memberOf x
		//   @method
	};
	
	/**
		@method
		@name Foo#bar2
	 */
	bar2 = function() {
		// provide the full name, which includes membership
	}
	
	/** @method Foo#bar3 */
	bar3 = function() {
		// most compact way
		// provide the full name as an argument to @method
		
		//   @method x
		// equates to
		//   @name x
		//   @method
	};
	
	/** @methodOf Foo# */
	bar4 = function() {
		// rely on the parser to find the short name for you
	}
	
	/** @methodof Foo# */
	function bar5() {
	}
	
	/** @method */
	Foo.prototype.bar6 = function() {
		// rely on the parser to find the full name for you
	};
	
	// exports
	Foo.prototype.bar1 = bar1;
	Foo.prototype.bar2 = bar2;
	Foo.prototype.bar3 = bar3;
	Foo.prototype.bar4 = bar4;
	Foo.prototype.bar5 = bar5;

	var myFoo = new Foo();
}



include('ringo/unittest');
include('jsdoc/parse');

exports.setUp = exports.tearDown = function() {};

function getDoc(docSet, name) {
	var doc = docSet.getDocByName(name);

	if (doc === null) {
		throw new Error('No doc found with that name: ' + name);
	}
	
	return doc;
}

var docSet = parseDocs('apps/jsdoc-toolkit/test/jsdoc/', 'method_name_test.js');

exports.testBasic = function () {
	// can find all doc comments
	assertEqual(docSet.docs.length, 7);
	assertEqual(getDoc(docSet, 'Foo').name, 'Foo');
}

exports.testWithNameAndMemberofTag = function () {
	assertEqual(getDoc(docSet, 'Foo#bar1').name, 'Foo#bar1');
}

exports.testWithNameAndMethodTag = function () {
	assertEqual(getDoc(docSet, 'Foo#bar2').name, 'Foo#bar2');
}

exports.testWithMethodTag = function () {
	assertEqual(getDoc(docSet, 'Foo#bar3').name, 'Foo#bar3');
}

exports.testWithMethodofTag = function () {
	assertEqual(getDoc(docSet, 'Foo#bar4').name, 'Foo#bar4');
}

exports.testFunctionWithMethodofTag = function () {
	assertEqual(getDoc(docSet, 'Foo#bar5').name, 'Foo#bar5');
}

exports.testProtoWithMethodTag = function () {
	assertEqual(getDoc(docSet, 'Foo#bar6').name, 'Foo#bar6');
}
