function sample() { // no code
	/**
		@name apu
	 */
	
	/**
		@name boo.bee
	 */
	
	/**
		@name coo#cee
	 */
	
	/**
		@name doo-dee
	 */
	
	/**
		@name fee
		@member foo
	 */
	
	/**
		@name gee
		@member goo
		@static
	 */
	 
	/**
		@name hee
		@member hoo
		@inner
	 */
	 
	/**
		@name jee
		@member joo.jah
	 */
	
	/**
		@name kee
		@member koo#kup
	 */
	
	/**
		@name lee
		@methodof loo.lah#
	 */
	
	/**
		@name mee
		@propertyof moo.mah#
	 */
}

function sample2() { // with code
	/** @desc A class defined with a non-anonymous function declaration.
		@constructor
	 */
	function Foo(a, b) {
		/** @desc An @nameless this-method tagged as a member of prototype.
			@methodOf Foo.prototype
		*/
		this.bar = function() { // Foo#bar
		}
		
		/** @desc An @nameless this-method tagged as a member of #.
			@methodOf Foo#
		*/
		this.cud = function() { // Foo#cud
		}
		
		/** @desc An @nameless this-method with no member tag.
			@method
		*/
		this.dab = function() { // Foo#dab
		}
		
		var that = this;

		/** @desc A named instance method on that.
			@name erp
			@methodOf Foo#
		*/
		that.erp = function() { // Foo#erp
		}
	}
	
	/** @desc An anonymous function, assigned to a nested bare name, documented as a constructor.
		@constructor
	 */
	Foo.Bar = function(c, d) {
		/** @desc an @nameless this-method with no member tag.
			@method
		*/
		this.foo = function() { // Foo.Bar#foo
		}
	}
	
	/** @desc An anonymous function, assigned to a bare name, documented as a constructor.
		@constructor
	 */
	Piz = function(x, y) {
		/** @desc an @nameless this-method with no member tag.
			@method
		*/
		this.pep = function() { // Piz.pep
		}
	}
	
	
	// finding the name of @nameless nested instance members...
	
	/** @desc An anonymous function, assigned to a var name, documented as a constructor.
		@constructor
	 */
	var Zat = function (x, y) {
		/** @desc an @nameless this-constructor with no member tag.
			@constructor
		*/
		this.Zoo = function() { // Zat#Zoo
			/** @desc an @nameless nested this-method with no member tag.
				@method
			*/
			this.zuz = function() { // Zat#Zoo#zuz
			}
		}
		
		/** @desc an @nameless this-method with no member tag.
			@method
		*/
		this.zik = function() { // Zat#zik
		}
	}
}


include('ringo/unittest');
include('jsdoc/parse');

exports.setUp = exports.tearDown = function() {}


function getDoc(docSet, name) {
	var doc = docSet.getDocByName(name);

	if (doc === null) {
		throw new Error('No doc found with that name: ' + name);
	}
	
	return doc;
}

var docSet = parseDocs('apps/jsdoc-toolkit/test/jsdoc/', 'name_test.js');


exports.testNametags = function () {
	// can find all doc comments
	assertEqual(24, docSet.docs.length);
}

exports.testNametagsJustName = function () {
	assertEqual('apu', getDoc(docSet, 'apu').name);
}

exports.testNametagsDottedName = function () {
	assertEqual('boo.bee', getDoc(docSet, 'boo.bee').name);
}

exports.testNametagsHashedName = function () {
	assertEqual('coo#cee', getDoc(docSet, 'coo#cee').name);
}

exports.testNametagsDashedName = function () {
	assertEqual('doo-dee', getDoc(docSet, 'doo-dee').name);
}

exports.testNametagsWithMember = function () {
	assertEqual('foo.fee', getDoc(docSet, 'foo.fee').name);
}

exports.testNametagsWithStatic = function () {
	assertEqual('goo.gee', getDoc(docSet, 'goo.gee').name);
	assertEqual(true, getDoc(docSet, 'goo.gee').isstatic);
}

exports.testNametagsWithInner = function () {
	assertEqual('hoo-hee', getDoc(docSet, 'hoo-hee').name);
	assertEqual(true, getDoc(docSet, 'hoo-hee').isinner);
}

exports.testNametagsNestedMember = function () {
	assertEqual('joo.jah.jee', getDoc(docSet, 'joo.jah.jee').name);
	assertEqual(true, getDoc(docSet, 'joo.jah.jee').isstatic);
}

exports.testNametagsNestedHashedMember = function () {
	assertEqual('koo#kup.kee', getDoc(docSet, 'koo#kup.kee').name);
	assertEqual(true, getDoc(docSet, 'koo#kup.kee').isstatic);
}

exports.testNametagsNestedMethodofHashed = function () {
	assertEqual('loo.lah#lee', getDoc(docSet, 'loo.lah#lee').name);
	assertEqual(false, getDoc(docSet, 'loo.lah#lee').isstatic);
}

exports.testNametagsNestedPropertyofHashed = function () {
	assertEqual('moo.mah#mee', getDoc(docSet, 'moo.mah#mee').name);
}

exports.testThisWithMember = function () {
	assertEqual('Foo#bar', getDoc(docSet, 'Foo#bar').name);
	assertEqual('Foo#cud', getDoc(docSet, 'Foo#cud').name);
	assertEqual('Foo#erp', getDoc(docSet, 'Foo#erp').name);
}

exports.testThisWithNoMember = function () {
	assertEqual('Foo#dab', getDoc(docSet, 'Foo#dab').name);
}

exports.testThisWithNoMemberAnon = function () {
	assertEqual('Foo.Bar#foo', getDoc(docSet, 'Foo.Bar#foo').name);
	assertEqual('Piz#pep',     getDoc(docSet, 'Piz#pep').name);
	assertEqual('Zat#Zoo',     getDoc(docSet, 'Zat#Zoo').name);
	assertEqual('Zat#Zoo#zuz', getDoc(docSet, 'Zat#Zoo#zuz').name);
	assertEqual('Zat#zik',     getDoc(docSet, 'Zat#zik').name);
}
