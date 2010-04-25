/**
	@overview Represents a doc comment.
	@author Michael Mathews <micmath@gmail.com>
	@license Apache License 2.0 - See file 'LICENSE.markdown' in this project.
 */

/**
	@namespace doc
 */
var doc = (typeof exports === 'undefined')? {} : exports; // like commonjs

(function() {
	var idCounter = 0;
	
	/**
	 * @param {String} comment
	 */
	doc.fromComment = function(commentSrc) {
		var tags = [];
		
		commentSrc = unwrapComment(commentSrc);
		commentSrc = fixDesc(commentSrc);
		
		tags = parseTags(commentSrc);
		preprocess(tags);
		return new Doc(tags);
	}
	
	function Doc(tags) {
		this.tags = tags;
	}
	
	Doc.prototype.tagText = function(tagName) {
		var i = this.tags.length;
		while(i--) {
			if (this.tags[i].name === tagName) {
				return this.tags[i].text;
			}
		}
		return '';
	}
	
	Doc.prototype.hasTag = function(tagName) {
		var i = this.tags.length;
		while(i--) {
			if (this.tags[i].name === tagName) {
				return true;
			}
		}
		return false;
	}
	
	Doc.prototype.toObject = function() {
		var o = {};
		
		for (var i = 0, leni = this.tags.length; i < leni; i++) {
			var tagName = this.tags[i].name,
				tagValue = this.tags[i].text;
			
			if (this.tags[i].type) {
				tagValue = {
					type: this.tags[i].type,
					name: this.tags[i].text
				}
			}
			
			if (!o[tagName]) { o[tagName] = tagValue; }
			else if (o[tagName].push) { o[tagName].push(tagValue); }
			else {
				o[tagName] = [ o[tagName] ];
				o[tagName].push(tagValue);
			}
		}
		
		return o;
	}
	
	/**
		Remove JsDoc comment artifacts. Trims white space.
		@private
		@function unwrapComment
		@param {string} commentSrc
		@return {string} Stars and slashes removed.
	 */
	function unwrapComment(commentSrc) {
		if (!commentSrc) { return ''; }
	
		// TODO keep leading white space for @examples
		return commentSrc ? commentSrc.replace(/(^\/\*\*\s*|\s*\*\/$)/g, "").replace(/^\s*\* ?/gm, "") : "";
	}
	
	/**
		Add a @desc tag if none exists on untagged text at start of comment.
		@private
		@function fixDesc
		@param {string} commentSrc
		@return {string} With needed @desc tag added.
	 */
	function fixDesc(commentSrc) {
		if (!/^\s*@/.test(commentSrc)) {
			commentSrc = '@desc ' + commentSrc;
		}
		return commentSrc;
	}
	
	/**
		Given the raw text of the doc comment, finds tags.
		@private
		@method Tag.parse
		@param {string} commentSrc Unwrapped.
		@returns Array.<Object>
	 */
	function parseTags(commentSrc) {
		var tags = [];

		// split out the basic tags
		commentSrc
		.split(/(^|[\r\n])\s*@/)
		.filter( function($){ return $.match(/\S/); } )
		.forEach(function($) {
			// tags are like: @name text...
			var name = '',
				type = '',
				text = '',
				bits = $.match(/^(\S+)(?:\s([\s\S]*))?$/);
	
			if (bits) {
				name = bits[1] || '';
				text = bits[2] || '';
				
				var typeText = splitType(text);
				
				if (name) { tags.push( {name: name, type: typeText.type, text: typeText.text} ); }
			}
		});
		
		return tags;
	}
	
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
	
	function trim(str) {
		return str.replace(/^\s+|\s+$/g, '');
	}
	
	function preprocess(tags) {
		var name = '',
			taggedName = '',
			kind = '',
			taggedKind = '',
			taggedId = '';
		
		var i = tags.length;
		while(i--) {
			if (tags[i].name === 'id') {
				if (taggedId) { tooManyTags('id'); }
				taggedId = tags[i].text;
			}
			
			if (tags[i].name === 'name') {
				if (name) { tooManyNames(name); }
				taggedName = name = tags[i].text;
			}
			
			if (tags[i].name === 'kind') {
				if (kind) { tooManyKinds(kind); }
				taggedKind = kind = tags[i].text;
			}
			
			['constructor', 'namespace', 'method', 'property', 'function', 'variable']
			.forEach(function($) {
				if (tags[i].name === $) {
					if (tags[i].text) {
						if (name) { tooManyNames(name); }
						name = tags[i].text;
					}
					
					if (kind) { tooManyKinds(kind); }
					kind = tags[i].name;
				}
			});
		}
		
		if (name && !taggedName) {
			tags[tags.length] = {name: 'name', text: name };
		}
		
		if (kind && !taggedKind) {
			tags[tags.length] = {name: 'kind', text: kind };
		}
		
		if (!taggedId) {
			tags[tags.length] = {name: 'id', text: ++idCounter };
		}
	}
	
	function tooManyNames(name) {
		throw new Error('Symbol name is documented more than once in the same doc comment: '+name);
	}
	
	function tooManyKinds(kind) {
		throw new Error('Symbol kind is documented more than once in the same doc comment: '+kind);
	}
	
	function tooManyTags(tagName) {
		throw new Error('Symbol has too many tags of type: @'+tagName);
	}
})();



