/**
	A collection of objects that relate to 2D geometry.
	@module geom/twoD
	@exports geom.twoD
	@requires geom/plane
 */

geom = geom || {};

/** @namespace */
geom.twoD = (typeof exports === 'undefined')? {} : exports; // like commonjs
geom.plane = require('geom/plane');

(function() {
	var undefined;
	
	/**
		A 2D shape.
		@constructor
	 */
	geom.twoD.Shape = function() {
		/**
			@name sides
			@propertyof geom.twoD.Shape#
			@id x99
			@type number
			@desc How many sides does the shape have.
	 */
		this.sides = 1;
		this.pos = {top: undefined, left: undefined};
	}
	
	/**
		@method position
		@id geom_twod_shape_position
		@methodOf geom.twoD.Shape#
		@desc Set or get the position of this shape.
		@param {number} top The top value.
		@param left
		@returns {{top: number, left: number}}
	 */
	geom.twoD.Shape.prototype.position = function(top, left){
		if (top) this.top = top;
		if (left) this.left = left;
		
		return { top: this.top, left: this.left };
	}
	
})();