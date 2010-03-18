include('ringo/unittest');
include('jsdoc/parse')

exports.setUp = exports.tearDown = function() {}

exports.testParseJson = function () {
	var symbolSet = parseDocs('apps/jsdoc-toolkit/test/data/', 'shapely.json.js');
	
	// can find all doc comments
	assertEqual(8, symbolSet.symbols.length);
	
	// can detect and parse JSON formatted comments
	assertEqual('shapely', symbolSet.symbols[0].name);
	assertEqual('shapely.Shape', symbolSet.symbols[1].name);
	assertEqual('A base class for all shapes.', symbolSet.symbols[1].description);
}

exports.testParseTagsNamespace = function () {
	var symbolSet = parseDocs('apps/jsdoc-toolkit/test/data/', 'namespace_name.js');
	
	// can find all doc comments
	assertEqual(4, symbolSet.symbols.length);
	
	// can detect and parse JSON formatted comments
	assertEqual('ns1', symbolSet.symbols[0].name);
	assertEqual('namespace', symbolSet.symbols[0].isa);
	
	assertEqual('ns2', symbolSet.symbols[1].name);
	assertEqual('namespace', symbolSet.symbols[1].isa);
	
// TODO: find name from code
	
	assertEqual('ns3.ns4', symbolSet.symbols[3].name);
	assertEqual('A description.', symbolSet.symbols[3].description);
}
