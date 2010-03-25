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
  @description A base class for all shapes.
  @memberOf shapely
  @constructor
  @param {number} [sides=1] The number of sides of this shape.,
*/
shapely.Shape = function(sides) {

	/**	@name sides
	 *	@property
	 *  @memberof shapely.Shape#
	 *	@type number
	*/
	this.sides = sides || 1;
}

/** @constructor */
shapely.Circle = function(radius) {
	var that = new shapely.Shape(1);
	
	that.radius = radius || 1;
}

/** @method */
shapely.Circle.prototype.setDiameter = function(diameter) {
	this.radius = diameter/2;
}

/** @method */
shapely.Circle.prototype.getDiameter = function() {
	return this.radius * 2;
}