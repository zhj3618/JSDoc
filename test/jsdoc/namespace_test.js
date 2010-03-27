include('ringo/unittest');
include('jsdoc/parse');

exports.setUp = exports.tearDown = function() {}

exports.testNamespaceName = function () {
	var docSet = parseDocs('apps/jsdoc-toolkit/test/data/', 'namespace_data.js');
	
	// can find all doc comments
	assertEqual(4, docSet.docs.length);
	
	assertEqual('ns1', docSet.docs[0].name);
	assertEqual('namespace', docSet.docs[0].isa);
	
	assertEqual('ns2', docSet.docs[1].name);
	assertEqual('namespace', docSet.docs[1].isa);
	
	assertEqual('ns2.ns3', docSet.docs[2].name);
	assertEqual('namespace', docSet.docs[2].isa);
	
	assertEqual('ns2.ns3.ns4', docSet.docs[3].name);
	assertEqual('A description.', docSet.docs[3].description);
}
