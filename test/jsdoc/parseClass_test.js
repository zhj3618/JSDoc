include('ringo/unittest');
include('jsdoc/parse');

exports.setUp = exports.tearDown = function() {}

var symbolSet = parseDocs('apps/jsdoc-toolkit/test/data/', 'codeparse_class.js');

function getSymbol(name) {
	var symbol = symbolSet.getSymbolByName(name);

	if (symbol === null) {
		throw new Error('No symbol found with that name: ' + name);
	}
	
	return symbol;
}

exports.testBasic = function () {
	// can find all doc comments
	assertEqual(13, symbolSet.symbols.length);
	
	assertEqual('Foo', symbolSet.getSymbolByName('Foo').name);
}

exports.testThisWithMemberof = function () {
	assertEqual('Foo#bar', getSymbol('Foo#bar').name);
	assertEqual('Foo#cud', getSymbol('Foo#cud').name);
	assertEqual('Foo#erp', getSymbol('Foo#erp').name);
}

exports.testThisWithNoMemberof = function () {
	assertEqual('Foo#dab', getSymbol('Foo#dab').name);
}

exports.testThisWithNoMemberofAnon = function () {
	assertEqual('Foo.Bar#foo', getSymbol('Foo.Bar#foo').name);
	assertEqual('Piz#pep', getSymbol('Piz#pep').name);
	assertEqual('Zat#Zoo', getSymbol('Zat#Zoo').name);
	assertEqual('Zat#Zoo#zuz', getSymbol('Zat#Zoo#zuz').name);
	assertEqual('Zat#zik', getSymbol('Zat#zik').name);
}