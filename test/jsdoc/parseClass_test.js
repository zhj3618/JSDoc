include('ringo/unittest');
include('jsdoc/parse');

exports.setUp = exports.tearDown = function() {}

var docSet = parseDocs('apps/jsdoc-toolkit/test/data/', 'codeparse_class.js');

function getDoc(name) {
	var symbol = docSet.getDocByName(name);

	if (symbol === null) {
		throw new Error('No symbol found with that name: ' + name);
	}
	
	return symbol;
}

exports.testBasic = function () {
	// can find all doc comments
	assertEqual(13, docSet.docs.length);
	
	assertEqual('Foo', docSet.getDocByName('Foo').name);
}

exports.testThisWithMemberof = function () {
	assertEqual('Foo#bar', getDoc('Foo#bar').name);
	assertEqual('Foo#cud', getDoc('Foo#cud').name);
	assertEqual('Foo#erp', getDoc('Foo#erp').name);
}

exports.testThisWithNoMemberof = function () {
	assertEqual('Foo#dab', getDoc('Foo#dab').name);
}

exports.testThisWithNoMemberofAnon = function () {
	assertEqual('Foo.Bar#foo', getDoc('Foo.Bar#foo').name);
	assertEqual('Piz#pep', getDoc('Piz#pep').name);
	assertEqual('Zat#Zoo', getDoc('Zat#Zoo').name);
	assertEqual('Zat#Zoo#zuz', getDoc('Zat#Zoo#zuz').name);
	assertEqual('Zat#zik', getDoc('Zat#zik').name);
}