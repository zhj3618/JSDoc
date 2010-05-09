
/** @constructor */
function Foo() {
}

Foo.prototype = { // overwriting prototype
	/** @method */
	memberfoo2: function() { // should be Foo#memberfoo2
	}
}

/** @constructor */
function Base() {
	/** @method */
	this.memberbase1 = function() { // should be Base#memberbase1
	}
	
	/** @methodof Foo# */
	this.memberfoo1 = function() {  // should be Foo#memberfoo1
	}
	
	/** @method Base.prototype.memberbase2 */  // should be Base#memberbase2
}



