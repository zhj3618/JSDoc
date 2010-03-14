include('ringo/unittest');
include('jsdoc/parse')

exports.setUp = exports.tearDown = function() {}

exports.testParseJson = function () {
	var symbolSet = parse('apps/jsdoc-toolkit/test/data/', 'shapely.json.js');
	
	// can find all doc comments
	assertEqual(8, symbolSet.symbols.length);
	
	// can detect and parse JSON formatted comments
	assertEqual('shapely', symbolSet.symbols[0].name);
	assertEqual('shapely.Shape', symbolSet.symbols[1].name);
	assertEqual('A base class for all shapes.', symbolSet.symbols[1].description);
}
