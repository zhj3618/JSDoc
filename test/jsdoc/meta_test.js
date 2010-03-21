include('ringo/unittest');
include('jsdoc/parse');

exports.setUp = exports.tearDown = function() {}

exports.testParseTagsNamespace = function () {
	var symbolSet = parseDocs('apps/jsdoc-toolkit/test/data/', 'shapely.js');
	
	// can find all doc comments
	assertEqual(4, symbolSet.symbols.length);

 	assertEqual(13, symbolSet.symbols[2].meta.line);
}
