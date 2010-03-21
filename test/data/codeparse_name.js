// undocumented, unloved, ignored
function whatever() {
}

// @name tag with no code
/** @name Arf
	@constructor
 */
/**@constructor*/ function Bar(a, b) { } // code with no @name tag

/** @desc space after
	@constructor
 */

function
Caz(c, d) {
}
 
/** @desc a Caz.Dop
	@constructor
 */
Caz.Dop = function(e, f) {
}

/** @desc Function assignment with var. JsDoc is before the var.
	@constructor
 */
var Erf = function() { },
	/** @desc Function assignment with with var and commas. JsDoc is after the var.
		@constructor
	 */
	Foo = function() { };

/** @desc Name uses a stringy index.
	@constructor */
Foo["Gub"] = function() {}

/** @desc Name uses a stringy index on prototype.
	@constructor */
Foo["Gub"].prototype["Hoo"] = function() {}

/** @desc Name uses a nested stringy index.
	@constructor */
Foo["Gub"]["Jaz"] = function() {}

/** @desc Name in code, @memberof in the comment.
	@constructor
	@memberof Loo
 */
Kub = function() {}
Loo.Kub = Kub;

/** @desc No name here, there, anywhere: ignored.
	@constructor
 */
