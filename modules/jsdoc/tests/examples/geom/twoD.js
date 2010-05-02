/**
	A collection of objects that relate to 2D geometry.
	@module geom/twoD
	@exports geom.twoD
	@requires geom/plane
 */

geom = geom || {};
geom.twoD = (typeof exports === 'undefined')? {} : exports; // like commonjs
geom.plane = require('geom/plane');

(function() {
	var undefined;
	
	/**
		A 2D shape.
		@constructor Shape
	 */
	geom.twoD.Shape = function() {
		/**
			@property Shape#sides
			@id x99
			@type number
			@desc How many sides does the shape have.
	 */
		this.sides = 1;
		this.pos = {top: undefined, left: undefined};
	}
	
	/**
		@name Shape#position
		@id geom_twod_shape_position
		@shortname position
		@methodOf Shape#
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