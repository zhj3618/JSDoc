export('Tag');

/**
	Represents a single tag.
	@private
	@constructor Tag
	@param {string} name
	@param {string} text
 */
var Tag = function(name, text) {
	this.name = (''+name).toLowerCase();
	this.text = text;
}
