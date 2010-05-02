/**
	@overview Represents a doc comment tag.
	@author Michael Mathews <micmath@gmail.com>
	@license Apache License 2.0 - See file 'LICENSE.markdown' in this project.
 */

/**
	Create tag objects.
	@module jsdoc/tag
	@exports jsdoc.tag
	@namespace jsdoc.tag
 */
var jsdoc = jsdoc || {};
jsdoc.tag = (typeof exports === 'undefined')? {} : exports; // like commonjs

(function() {

	jsdoc.tag.fromTagText = function(tagText) {
		return new Tag(tagText);
	}
	
	/**
		@private
		@constructor Tag
		@param {string} tagText
	 */
	function Tag(tagText) {
		this.name = '';
		this.type = '';
		this.text = '';
		this.pname = '';
		this.pdesc = '';
		
		// tagText is like: "tagname tag text"
		var bits = tagText.match(/^(\S+)(?:\s([\s\S]*))?$/);
	
		if (bits) {
			this.name = (bits[1] || '').toLowerCase();
			this.text = bits[2] || '';
			
			var typeText = splitType(this.text);
			this.type = typeText.type;
			this.text = trim(typeText.text);

			if (this.name === 'param') { // is a parameter w/ long format
				var [pname, pdesc] = splitPname(this.text);
				this.pname = pname;
				this.pdesc = pdesc;
			}
		}
	}
	
	/**
		Split the parameter name and parameter desc from the tag text.
		@private
		@method splitPname
		@param {string} tagText
		@returns Array.<string> The pname and the pdesc.
	 */
	function splitPname(tagText) {
		tagText.match(/^(\S+)(\s+(\S.*))?$/);
		
		return [RegExp.$1, RegExp.$3];
	}
	
	/**
		Split the tag type and remaining tag text from the tag text.
		@private
		@method splitType
		@param {string} tagText
		@returns Object Like {type: tagType, text: tagText}
	 */
	function splitType(tagText) {
		var type = '',
			text = tagText,
			count = 0;
		
		if (tagText[0] === '{') {
			count++;
			
			for (var i = 1, leni = tagText.length; i < leni; i++) {
				if (tagText[i] === '{') { count++; }
				if (tagText[i] === '}') { count--; }
				if (count === 0) {
					type = trim(tagText.slice(1, i));
					text = trim(tagText.slice(i+1));
					break;
				}
			}
		}
		
		return { type: type, text: text };
	}
	
	/**
		Remove leading and trailing whitespace.
		@private
		@method trim
		@param {string} text.
		@returns {string}
	 */
	function trim(text) {
		return text.replace(/^\s+|\s+$/g, '');
	}
	
})();