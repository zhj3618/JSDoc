include('ringo/unittest');
include('jsdoc/parse');

exports.setUp = exports.tearDown = function() {}

var symbolSet = parseDocs('apps/jsdoc-toolkit/test/data/', 'codeparse_class.js');

exports.testBasic = function () {
	// can find all doc comments
	assertEqual(4, symbolSet.symbols.length);
	
	assertEqual('Foo', symbolSet.getSymbolByName('Foo').name);
}

exports.testThisWithMemberof = function () {
	assertEqual('Foo#bar', symbolSet.getSymbolByName('Foo#bar').name);
	assertEqual('Foo#cud', symbolSet.getSymbolByName('Foo#cud').name);
	assertEqual('Foo#dab', symbolSet.getSymbolByName('Foo#dab').name);
}