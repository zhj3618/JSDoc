include('jsdoc/common');
export('Tag', 'Tag.translateName', 'Tag.synonyms');

/**
	Represents a single tag.
	@private
	@constructor Tag
	@param {string} name
	@param {string} text
 */
var Tag = function(name, text) {
	this.name = Tag.translateName(name);
	this.text = text;
	
	// @example is only tag where whitespace is preserved
	if (this.name !== 'example') {
		this.text = trim(this.text);
	}
}

Tag.synonyms = {
	'memberof':           'member',
	'description':        'desc',
	'exception':          'throws',
	'argument':           'param',
	'returns':            'return',
	'classdescription':   'class',
	'fileoverview':       'overview',
	'extends':            'augments',
	'base':               'augments',
	'projectdescription': 'overview',
	'link':               'see',
	'borrows':            'inherits'
};

Tag.translateName = function(name) {
	var name = trim((''+name).toLowerCase()),
		synonym;
	
	if (Tag.synonyms.hasOwnProperty(name)) {
		return Tag.synonyms[name];
	}
	
	return name;
}