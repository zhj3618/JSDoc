/**
  @name shapelyjs
  @library
  @desc the library overview will go here
 */

/**
 * @name shapely
 * @namespace
 */
var shapely = {};

/**
  @name Shape
  @description A base class for all shapes."
  @memberOf shapely"
  @function
  @param {number} [sides=1] The number of sides of this shape.",
*/
shapely.Shape = function(sides) {

	/**	@name shapely.Shape#sides
	 *	@property
	 *	@type number
	*/
	this.sides = sides || 1;
}

shapely.Circle = function(radius) {
	var that = new shapely.Shape(1);
	
	that.radius = radius || 1;
}

shapely.Circle.prototype.setDiameter = function(diameter) {
	this.radius = diameter/2;
}

shapely.Circle.prototype.getDiameter = function() {
	return this.radius * 2;
}