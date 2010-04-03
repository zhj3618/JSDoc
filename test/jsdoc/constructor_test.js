function sample() { // constructors without @names

	// undocumented, unloved, ignored
	function whatever() {
	}
	
	// @name tag with no code
	/** @name Arf
		@constructor
	 */
	/**@constructor*/ function Bar(a, b) { } // code with no @name tag
	
	/** @desc uses the `new` keyword
		@constructor
	 */
	
	Caz = new function (c, d) {
	}
	 
	/** @desc has a @name
		@constructor Caz.Dop
	 */
	Caz.Dop = (function(e, f) { return function(){};
	})();
	
	/** @desc Function assignment with var. JsDoc is before the var.
		@constructor
	 */
	var Erf = function() { },
		/** @desc Function assignment with with var and commas. JsDoc is after the var.
			@constructor
		 */
		Foo = function() { };
	
	/** @desc Name uses a stringy index.
		@constructor */
	Foo["Gub"] = function() {}
	
	/** @desc Name uses a stringy index on prototype.
		@constructor */
	Foo["Gub"].prototype["Hoo"] = function() {}
	
	/** @desc Name uses a nested stringy index.
		@constructor */
	Foo["Gub"]["Jaz"] = function() {}
	
	/** @desc Name in code, @memberof in the comment.
		@constructor
		@memberof Loo
	 */
	Kub = function() {}
	Loo.Kub = Kub;
	
	/** @desc No name here, there, anywhere: ignored.
		@constructor
	 */
}


include('ringo/unittest');
include('jsdoc/parse');

exports.setUp = exports.tearDown = function() {}

var docSet = parseDocs('apps/jsdoc-toolkit/test/jsdoc/', 'constructor_test.js');

exports.testBasic = function () {
	// can find all doc comments
	assertEqual(10, docSet.docs.length);
	
	// @name given
	var doc = docSet.getDocByName('Arf');
	assertNotNull(doc);
}

exports.testNoName = function () {
	var doc = docSet.getDocByName('Bar');
	assertNotNull(doc);
}

exports.testNewFunctionConstructor = function () {
	var doc = docSet.getDocByName('Caz');
	assertNotNull(doc);
}

exports.testFindMemberof = function () {
	var doc = docSet.getDocByName('Caz.Dop');
	assertNotNull(doc);
	assertEqual(doc.shortname, 'Dop');
	assertEqual(doc.memberof, 'Caz');
}

exports.testMemberofGiven = function () {
	var doc = docSet.getDocByName('Loo.Kub');
	assertNotNull(doc);
	
	assertEqual(doc.shortname, 'Kub');
	assertEqual(doc.memberof, 'Loo');
}

exports.testVarAssign = function () {
	assertNotNull(docSet.getDocByName('Erf'));
	assertNotNull(docSet.getDocByName('Foo'));
}

exports.testStringIndexed = function () {
	assertNotNull(docSet.getDocByName('Foo."Gub"'));
	assertNotNull(docSet.getDocByName('Foo."Gub"#"Hoo"'));
	assertNotNull(docSet.getDocByName('Foo."Gub"."Jaz"'));
}