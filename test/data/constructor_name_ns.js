// Example: documenting the name of a namespaced constructor

// tags used:
// @name
// @namespace
// @constructor
// @memberOf

(function() {
	var Foo1, Foo2, Foo3;
	
	/**
		@namespace
		@name ns
	 */
	ns = {};
	
	/**
		@constructor
		@name Foo1
		@memberOf ns
	 */
	Foo1 = function() {
		// most verbose technique
		// provide the name, membership and isa information separately
	};
	ns.Foo1 = Foo1;
	
	/**
		@constructor
		@name ns.Foo1
	*/
	Foo2 = function() {
		// provide the full name, which includes membership
	};
	ns.Foo2 = Foo2;
	

	/** @constructor ns.Foo3 */
	Foo3 = function() {
		// most compact way
		// provide the full name as an argument to @constructor
		
		//   @constructor x
		// equates to
		//   @name x
		//   @constructor
	}
	ns.Foo3 = Foo3;
	
	/** @constructor */
	ns.Foo4 = function() {
		// rely on the parser to find the full name for you
		// not guaranteed to work
	}
})();

var myFoo = new ns.Foo1();