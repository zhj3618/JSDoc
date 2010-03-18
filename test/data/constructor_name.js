// Example: documenting the name of a top-level constructor

// tags used:
// @name
// @constructor

(function() {
	/**
		@constructor
		@name Foo1
	 */
	Foo1 = function() {
		// most verbose technique
		// provide the name and isa information separately
	};
	
	/** @constructor Foo2 */
	Foo2 = function() {
		// most compact way
		// provide the full name as an argument to @constructor
		
		//   @constructor x
		// equates to
		//   @name x
		//   @constructor
	}
	
	/** @constructor */
	Foo3 = function() {
		// rely on the parser to find the full name for you
		// not guaranteed to work
	}
})();

var myFoo = new Foo1();