include('ringo/unittest');
include('jsdoc/parse');

exports.setUp = exports.tearDown = function() {}

var symbolSet = parseDocs('apps/jsdoc-toolkit/test/data/', 'codeparse_name.js');

exports.testBasic = function () {
	// can find all doc comments
	assertEqual(10, symbolSet.symbols.length);
	
	// @name given
	assertEqual('Arf', symbolSet.symbols[0].name);
}

exports.testNoName = function () {
 	assertEqual('Bar', symbolSet.symbols[1].name);
 	assertEqual('Caz', symbolSet.symbols[2].name);
}

exports.testFindMemberof = function () {
 	assertEqual('Caz.Dop', symbolSet.symbols[3].name);
 	assertEqual('Dop', symbolSet.symbols[3].shortname);
 	assertEqual('Caz', symbolSet.symbols[3].memberof);
}

exports.testMemberofGiven = function () {
 	assertEqual('Loo.Kub', symbolSet.symbols[9].name);
 	assertEqual('Kub', symbolSet.symbols[9].shortname);
 	assertEqual('Loo', symbolSet.symbols[9].memberof);
}

exports.testVarAssign = function () {
 	assertEqual('Erf', symbolSet.symbols[4].name);
 	assertEqual('Foo', symbolSet.symbols[5].name);
}

exports.testStringIndexed = function () {
 	assertEqual('Foo."Gub"', symbolSet.symbols[6].name);
 	assertEqual('Foo."Gub"#"Hoo"', symbolSet.symbols[7].name);
 	assertEqual('Foo."Gub"."Jaz"', symbolSet.symbols[8].name);
}
