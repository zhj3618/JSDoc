/** @desc a class
	@constructor
 */
Foo = function(e, f) {
	/** @desc an instance method on prototype
		@methodOf Foo.prototype
 	*/
	this.bar = function() {
	}
	
	/** @desc an instance method on #
		@methodOf Foo#
 	*/
	this.cud = function() {
	}
	
	var that = this;
	
	/** @desc an instance method on that
		@name dab
		@methodOf Foo#
 	*/
	that.dab = function() {
	}
}
