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
	
	/** @desc An @nameless this-method with no memberof tag.
		@method
	*/
	this.dab = function() { // Foo#dab
	}
	
// 	var that = this;
// 	
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
	/** @desc an @nameless this-method with no memberof tag.
		@method
	*/
	this.foo = function() { // Foo.Bar#foo
	}
}

/** @desc An anonymous function, assigned to a bare name, documented as a constructor.
	@constructor
 */
Piz = function(x, y) {
	/** @desc an @nameless this-method with no memberof tag.
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
	/** @desc an @nameless this-constructor with no memberof tag.
		@constructor
	*/
	this.Zoo = function() { // Zat#Zoo
		/** @desc an @nameless nested this-method with no memberof tag.
			@method
		*/
		this.zuz = function() { // Zat#Zoo#zuz
		}
	}
	
	/** @desc an @nameless this-method with no memberof tag.
		@method
	*/
	this.zik = function() { // Zat#zik
	}
}