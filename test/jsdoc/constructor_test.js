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
	 
	/** @desc a Caz.Dop
		@constructor
	 */
	Caz.Dop = function(e, f) {
	}
	
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
	assertEqual('Arf', docSet.docs[0].name);
}

exports.testNoName = function () {
	assertEqual('Bar', docSet.docs[1].name);
}

exports.testNewFunctionConstructor = function () {
	assertEqual('Caz', docSet.docs[2].name);
}

exports.testFindMemberof = function () {
	assertEqual('Caz.Dop', docSet.docs[3].name);
	assertEqual('Dop', docSet.docs[3].shortname);
	assertEqual('Caz', docSet.docs[3].memberof);
}

exports.testMemberofGiven = function () {
	assertEqual('Loo.Kub', docSet.docs[9].name);
	assertEqual('Kub', docSet.docs[9].shortname);
	assertEqual('Loo', docSet.docs[9].memberof);
}

exports.testVarAssign = function () {
	assertEqual('Erf', docSet.docs[4].name);
	assertEqual('Foo', docSet.docs[5].name);
}

exports.testStringIndexed = function () {
	assertEqual('Foo."Gub"', docSet.docs[6].name);
	assertEqual('Foo."Gub"#"Hoo"', docSet.docs[7].name);
	assertEqual('Foo."Gub"."Jaz"', docSet.docs[8].name);
}