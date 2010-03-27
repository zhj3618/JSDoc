include('ringo/unittest');
include('jsdoc/parse');

exports.setUp = exports.tearDown = function() {}

var docSet = parseDocs('apps/jsdoc-toolkit/test/data/', 'constructor_data.js');

exports.testBasic = function () {
	// can find all doc comments
	assertEqual(10, docSet.docs.length);
	
	// @name given
	assertEqual('Arf', docSet.docs[0].name);
}

exports.testNoName = function () {
 	assertEqual('Bar', docSet.docs[1].name);
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