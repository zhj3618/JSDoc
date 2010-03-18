// Example: documenting the name of a top-level namespace

// tags used:
// @name
// @namespace
// @memberOf

(function() {

	/**
		@namespace
		@name ns1
	 */
	ns1 = {
		// most verbose technique
		// provide the name and isa information separately
	};
	
	/** @namespace ns2 */
	ns2 = {
		// most compact way
		// provide the full name as an argument to @namespace
		
		//   @namespace x
		// equates to
		//   @name x
		//   @namespace
	}
	
	/** @namespace */
	ns3 = {
		// rely on the parser to find the full name for you
		// not guaranteed to work
		
		/**
			@namespace ns4
			@memberof ns3
			@desc A description.
		 */
		ns4: {
			//
		}
	}
})();