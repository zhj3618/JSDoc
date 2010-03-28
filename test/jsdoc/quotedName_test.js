include('ringo/unittest');
include('jsdoc/parse');

exports.setUp = exports.tearDown = function() {}

var docSet = parseDocs('apps/jsdoc-toolkit/test/data/', 'quotedName_data.js');

exports.testQuotedNameInTag = function () {
	assertEqual(docSet.getDocByName('"Foo"').name, '"Foo"');
}

exports.testQuotedMethodInTag = function () {
	assertEqual(docSet.getDocByName('Foo#"=b@r#;"').name, 'Foo#"=b@r#;"');
	assertEqual(docSet.getDocByName('Foo#"=b@r#;"').memberof, 'Foo#');
	assertEqual(docSet.getDocByName('Foo#"=b@r#;"').shortname, '"=b@r#;"');
}

exports.testNestedQuotedMethodInTag = function () {
	assertEqual(docSet.getDocByName('Foo."=b@r#;"#fip').name, 'Foo."=b@r#;"#fip');
	assertEqual(docSet.getDocByName('Foo."=b@r#;"#fip').memberof, 'Foo."=b@r#;"#');
	assertEqual(docSet.getDocByName('Foo."=b@r#;"#fip').shortname, 'fip');
}

exports.testQuotedEscapedMethodInTag = function () {
	assertEqual(docSet.getDocByName('Foo#"it\'s \\"bar!\\""').name, 'Foo#"it\'s \\"bar!\\""');
	assertEqual(docSet.getDocByName('Foo#"it\'s \\"bar!\\""').memberof, 'Foo#');
	assertEqual(docSet.getDocByName('Foo#"it\'s \\"bar!\\""').shortname, '"it\'s \\"bar!\\""');
}

exports.testStrangeQuotedMethodInTag = function () {
	assertEqual(docSet.getDocByName('Foo."@name Foo.\\"@name"#name').name, 'Foo."@name Foo.\\"@name"#name');
	assertEqual(docSet.getDocByName('Foo."@name Foo.\\"@name"#name').memberof, 'Foo."@name Foo.\\"@name"#');
	assertEqual(docSet.getDocByName('Foo."@name Foo.\\"@name"#name').shortname, 'name');
}

exports.testPrivateQuotedMethodInTag = function () {
	var doc = docSet.getDocByName('"F-o.o#o"-foz');
	assertEqual(doc.name, '"F-o.o#o"');
	assertEqual(doc.memberof, '"F-o.o#o"');
	assertEqual(doc.shortname, 'foz');
	assertEqual(doc.isinner, true);
}