function sample() {
	// Documenting the name of a property method.

	var myMethod = function(){}
	
	/** @constructor */
	function Foo() {}
	
	Foo.prototype = {
	
		/** @methodOf Foo# */
		bar1: function(){},
		
		/** @methodOf Foo# */
		bar2: myMethod,
		
		/** @member Foo# */
		fiz: {
			/** @methodOf Foo#fiz */
			'bar3': function(){},
		}
	};
	
	var myFoo = new Foo();
	
	// not a property
	label: while(0) {}
}


include('ringo/unittest');
include('jsdoc/parse');

exports.setUp = exports.tearDown = function() {};


function getDoc(docSet, name) {
	var doc = docSet.getDocByName(name);

	if (doc === null) {
		throw new Error('No doc found with that name: ' + name);
	}
	
	return doc;
}
var docSet = parseDocs('apps/jsdoc-toolkit/test/jsdoc/', 'methodProperty_name.js');

/*debug*///docSet.docs.forEach(function($) { print('doc name: '+$.name); });

exports.testNametags = function () {
	// can find all doc comments
	assertEqual(docSet.docs.length, 5);
}

exports.testNametagsJustName = function () {
	assertEqual(getDoc(docSet, 'Foo#bar1').name, 'Foo#bar1');
	assertEqual(getDoc(docSet, 'Foo#bar2').name, 'Foo#bar2');
	assertEqual(getDoc(docSet, 'Foo#fiz.bar3').name, 'Foo#fiz.bar3');
}
