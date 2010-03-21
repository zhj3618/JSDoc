include('ringo/unittest');
include('jsdoc/parse');

exports.setUp = exports.tearDown = function() {}

exports.testParseTagsNamespace = function () {
	var symbolSet = parseDocs('apps/jsdoc-toolkit/test/data/', 'namespace_name.js');
	
	// can find all doc comments
	assertEqual(4, symbolSet.symbols.length);
	
	assertEqual('ns1', symbolSet.symbols[0].name);
	assertEqual('namespace', symbolSet.symbols[0].isa);
	
	assertEqual('ns2', symbolSet.symbols[1].name);
	assertEqual('namespace', symbolSet.symbols[1].isa);
	
	assertEqual('ns2.ns3', symbolSet.symbols[2].name);
	assertEqual('namespace', symbolSet.symbols[2].isa);
	
	assertEqual('ns2.ns3.ns4', symbolSet.symbols[3].name);
	assertEqual('A description.', symbolSet.symbols[3].description);
}
