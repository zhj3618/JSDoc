// Example: documenting the name of a method

// tags used:
// @name
// @method
// @memberOf
// @methodOf

(function() {
	var bar1, bar2, bar3, bar4;
	
	/**
		@constructor
		@name Foo
	 */
	Foo = function(){
		// the class that will contain our methods
	};
	
	/**
		@method
		@name bar1
		@memberOf Foo#
	 */
	bar1 = function() {
		// most verbose technique
		// provide the name, membership and isa information separately
		
		//   @methodOf x
		// equates to
		//   @memberOf x
		//   @method
	}
	
	/**
		@method
		@name Foo#bar2
	 */
	bar2 = function() {
		// provide the full name, which includes membership
	}
	
	/** @method Foo#bar3 */
	bar3 = function() {
		// most compact way
		// provide the full name as an argument to @method
		
		//   @method x
		// equates to
		//   @name x
		//   @method
	}
	
	/** @methodOf Foo# */
	bar4 = function() {
		// rely on the parser to find the short name for you
		// not guaranteed to work
	}
	
	/** @method */
	Foo.prototype.bar5 = function() {
		// rely on the parser to find the full name for you
		// not guaranteed to work
	}
	
	Foo.prototype.bar1 = bar1;
	Foo.prototype.bar2 = bar2;
	Foo.prototype.bar3 = bar3;
	Foo.prototype.bar4 = bar4;
})();

var myFoo = new Foo();