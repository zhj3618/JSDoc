/**
	A 2D shape.
	@constructor Shape
 */
function Shape() {
	/**
		@property Shape#sides
		@id 3
		@shortname sides
		@memberof Shape
		@membership instance
		@type number
		@desc How many sides does the shape have.
 */
	this.sides = 1;
}

/**
	@name Shape#position
	@id 2
	@shortname position
	@memberof Shape
	@membership instance
	@kind method
	@desc Set or get the position of this shape.
	@param {number} top The top value.
	@param left
 */
