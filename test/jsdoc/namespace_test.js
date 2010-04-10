function sample() {
	// documenting the name of a namespace

 	/**
 	 *	@name ns1
 	 *	@namespace
 	 */
 	ns1 = {
 		// most verbose technique
 		// provide the name and isa information separately
 	};
 	
	/** @namespace ns2 */
	var ns2 = {
		// most compact way
		// provide the full name as an argument to @namespace
		
		//   @namespace x
		// equates to
		//   @name x
		//   @namespace
	};
 	
 	/** @namespace ns2.ns3 */
 	ns2.ns3 = {
 		/**
 			@namespace ns4
 			@member ns2.ns3
 			@desc A description.
 		 */
 		ns4: function() {} // like @name ns2.ns3.ns4
 	};
}



include('ringo/unittest');
include('jsdoc/parse');

exports.setUp = exports.tearDown = function() {}

exports.testNamespaceName = function () {
	var docSet = parseDocs('apps/jsdoc-toolkit/test/jsdoc/', 'namespace_test.js');
	/*debug*///docSet.docs.forEach(function($) { print('doc name: '+$.name); });
	
	// can find all doc comments
	assertEqual(docSet.docs.length, 4);
	
	assertEqual('ns1', docSet.docs[0].name);
	assertEqual('namespace', docSet.docs[0].isa);
	
	assertEqual('ns2', docSet.docs[1].name);
	assertEqual('namespace', docSet.docs[1].isa);
	
	assertEqual('ns2.ns3', docSet.docs[2].name);
	assertEqual('namespace', docSet.docs[2].isa);
	
	assertEqual('ns2.ns3.ns4', docSet.docs[3].name);
	assertEqual('A description.', docSet.docs[3].desc);
}
