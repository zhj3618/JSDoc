include('ringo/unittest');
include('jsdoc/parse');

exports.setUp = exports.tearDown = function() {}


function getDoc(docSet, name) {
	var doc = docSet.getDocByName(name);

	if (doc === null) {
		throw new Error('No doc found with that name: ' + name);
	}
	
	return doc;
}



var docSet1 = parseDocs('apps/jsdoc-toolkit/test/data/', 'name_data.js');


exports.testNametags = function () {
	// can find all doc comments
	assertEqual(11, docSet1.docs.length);
}

exports.testNametagsJustName = function () {
	assertEqual('apu', getDoc(docSet1, 'apu').name);
}

exports.testNametagsDottedName = function () {
	assertEqual('boo.bee', getDoc(docSet1, 'boo.bee').name);
}

exports.testNametagsHashedName = function () {
	assertEqual('coo#cee', getDoc(docSet1, 'coo#cee').name);
}

exports.testNametagsDashedName = function () {
	assertEqual('doo-dee', getDoc(docSet1, 'doo-dee').name);
}

exports.testNametagsWithMemberof = function () {
	assertEqual('foo.fee', getDoc(docSet1, 'foo.fee').name);
}

exports.testNametagsWithStatic = function () {
	assertEqual('goo.gee', getDoc(docSet1, 'goo.gee').name);
	assertEqual(true, getDoc(docSet1, 'goo.gee').isstatic);
}

exports.testNametagsWithInner = function () {
	assertEqual('hoo-hee', getDoc(docSet1, 'hoo-hee').name);
	assertEqual(true, getDoc(docSet1, 'hoo-hee').isinner);
}

exports.testNametagsNestedMemberof = function () {
	assertEqual('joo.jah.jee', getDoc(docSet1, 'joo.jah.jee').name);
	assertEqual(true, getDoc(docSet1, 'joo.jah.jee').isstatic);
}

exports.testNametagsNestedHashedMemberof = function () {
	assertEqual('koo#kup.kee', getDoc(docSet1, 'koo#kup.kee').name);
	assertEqual(true, getDoc(docSet1, 'koo#kup.kee').isstatic);
}

exports.testNametagsNestedMethodofHashed = function () {
	assertEqual('loo.lah#lee', getDoc(docSet1, 'loo.lah#lee').name);
	assertEqual(false, getDoc(docSet1, 'loo.lah#lee').isstatic);
}

exports.testNametagsNestedPropertyofHashed = function () {
	assertEqual('moo.mah#mee', getDoc(docSet1, 'moo.mah#mee').name);
}





var docSet2 = parseDocs('apps/jsdoc-toolkit/test/data/', 'name_data2.js');

exports.testBasic = function () {
	// can find all doc comments
	assertEqual(13, docSet2.docs.length);
	
	assertEqual('Foo', docSet2.getDocByName('Foo').name);
}

exports.testThisWithMemberof = function () {
	assertEqual('Foo#bar', getDoc(docSet2, 'Foo#bar').name);
	assertEqual('Foo#cud', getDoc(docSet2, 'Foo#cud').name);
	assertEqual('Foo#erp', getDoc(docSet2, 'Foo#erp').name);
}

exports.testThisWithNoMemberof = function () {
	assertEqual('Foo#dab', getDoc(docSet2, 'Foo#dab').name);
}

exports.testThisWithNoMemberofAnon = function () {
	assertEqual('Foo.Bar#foo', getDoc(docSet2, 'Foo.Bar#foo').name);
	assertEqual('Piz#pep',     getDoc(docSet2, 'Piz#pep').name);
	assertEqual('Zat#Zoo',     getDoc(docSet2, 'Zat#Zoo').name);
	assertEqual('Zat#Zoo#zuz', getDoc(docSet2, 'Zat#Zoo#zuz').name);
	assertEqual('Zat#zik',     getDoc(docSet2, 'Zat#zik').name);
}
