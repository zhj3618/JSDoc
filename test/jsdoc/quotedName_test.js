include('ringo/unittest');
include('jsdoc/parse');

exports.setUp = exports.tearDown = function() {}

var docSet = parseDocs('apps/jsdoc-toolkit/test/data/', 'quotedName_data.js');

exports.testQuotedNameInTag = function () {
	assertEqual(docSet.getDocByName('"Foo"').name, '"Foo"');
}

exports.testQuotedMethodInTag = function () {
	var doc = docSet.getDocByName('Foo#"=b@r#;"');
	assertEqual(doc.name, 'Foo#"=b@r#;"');
	assertEqual(doc.memberof, 'Foo#');
	assertEqual(doc.shortname, '"=b@r#;"');
}

exports.testNestedQuotedMethodInTag = function () {
	var doc = docSet.getDocByName('Foo."=b@r#;"#fip');
	assertEqual(doc.name, 'Foo."=b@r#;"#fip');
	assertEqual(doc.memberof, 'Foo."=b@r#;"#');
	assertEqual(doc.shortname, 'fip');
}

exports.testEscapedQuotedMethodInTag = function () {
	var doc = docSet.getDocByName('Foo#"it\'s \\"bar!\\""');
	assertEqual(doc.name, 'Foo#"it\'s \\"bar!\\""');
	assertEqual(doc.memberof, 'Foo#');
	assertEqual(doc.shortname, '"it\'s \\"bar!\\""');
}

exports.testStrangeQuotedMethodInTag = function () {
	var doc = docSet.getDocByName('Foo."@name Foo.\\"@name"#name');
	assertEqual(doc.name, 'Foo."@name Foo.\\"@name"#name');
	assertEqual(doc.memberof, 'Foo."@name Foo.\\"@name"#');
	assertEqual(doc.shortname, 'name');
}

exports.testPrivateQuotedMethodInTag = function () {
	var doc = docSet.getDocByName('"F-o.o#o"-foz');
	assertEqual(doc.name, '"F-o.o#o"-foz');
	assertEqual(doc.memberof, '"F-o.o#o"');
	assertEqual(doc.shortname, 'foz');
	assertEqual(doc.isinner, true);
}

exports.testStaticQuotedMethodInTag = function () {
	var doc = docSet.getDocByName('"F-o.o#o".fez');
	assertEqual(doc.name, '"F-o.o#o".fez');
	assertEqual(doc.memberof, '"F-o.o#o"');
	assertEqual(doc.shortname, 'fez');
	assertEqual(doc.isstatic, true);
}