include('ringo/unittest');
include('jsdoc/parse');

exports.setUp = exports.tearDown = function() {}

exports.testParseTagsNamespace = function () {
	var docSet = parseDocs('apps/jsdoc-toolkit/test/data/', 'shapely.js');
	
	// can find all doc comments
	assertEqual(7, docSet.docs.length);

 	assertEqual(13, docSet.docs[2].meta.line);
}
