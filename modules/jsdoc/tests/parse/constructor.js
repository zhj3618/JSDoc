// 0
/**@constructor nameFromConstructorTag*/
// blah blah
ignoredCode = function() {}

// 1
/**
 * @constructor
 * @name nameFromNameTag
 */
moreIgnoredCode = function() {}

// 2
/**
@constructor
*/
nameFromCode = new Function("x", "y", "return x * y");

// 3
/** 
	Jsdoc is before the `var`.
	@constructor
*/
var nameFromVar = function() {},
	// 4
	/** 
		In a list of vars.
		@constructor
	*/
	anotherNameFromVar = function() {};

// 5
/** @constructor */
function fromFunction() {}