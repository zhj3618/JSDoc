/**
	@overview Represents a doc comment.
	@author Michael Mathews <micmath@gmail.com>
	@license Apache License 2.0 - See file 'LICENSE.markdown' in this project.
 */

/**
	Interface to objects representing a jsdoc comment and its tags.
	@module jsdoc/doc
	@namespace jsdoc.js
 */
var jsdoc = jsdoc || {};
jsdoc.doc = (typeof exports === 'undefined')? {} : exports; // like commonjs

(function() {
	var idCounter = 0;
	
	/**
		Factory that creates a Doclet object from a raw jsdoc comment string.
		@method fromComment
		@param {String} commentSrc
		@returns {jsdoc/doc.Doclet}
	 */
	jsdoc.doc.fromComment = function(commentSrc) {
		var tags = [];
		
		commentSrc = unwrapComment(commentSrc);
		commentSrc = fixDesc(commentSrc);
		
		tags = parseTags(commentSrc);
		preprocess(tags);
		return new Doclet(tags);
	}
	
	/**
		@private
		@constructor Doclet
		@param {Array.<Object>} tags
	 */
	function Doclet(tags) {
		/**
			An array of Objects representing tags.
			@type Array.<Object>
			@property Doclet#tags
		 */
		this.tags = tags;
	}
	
	/**
		Return the text of the first tag with the given name.
		@method Doclet#tagText
		@param {String} tagName
		@returns {String} The text of the found tag.
	 */
	Doclet.prototype.tagText = function(tagName) {
		var i = this.tags.length;
		while(i--) {
			if (this.tags[i].name === tagName) {
				return this.tags[i].text;
			}
		}
		return '';
	}
	
	/**
		Does a tag with the given name exist in this doc?
		@method Doclet#hasTag
		@param {String} tagName
		@returns {boolean} True if the tag is found, false otherwise.
	 */
	Doclet.prototype.hasTag = function(tagName) {
		var i = this.tags.length;
		while(i--) {
			if (this.tags[i].name === tagName) {
				return true;
			}
		}
		return false;
	}
	
	// unsafe in JSON
	var exportTags = ['id', 'name', 'kind', 'desc', 'type', 'param', 'returns', 'exportedby', 'memberof'];
	
	/**
		Get a JSON compatible object representing this Doclet.
		@method Doclet#toObject
		@returns {Object}
	 */
	Doclet.prototype.toObject = function() {
		var o = {};
		
		for (var i = 0, leni = this.tags.length; i < leni; i++) {
			var tagName = this.tags[i].name,
				tagValue = this.tags[i].text;
			
			if (exportTags.indexOf(tagName) === -1) { continue; }
			
			if (this.tags[i].pname) { // is a parameter w/ long format
				tagValue = {
					type: this.tags[i].type,
					name: this.tags[i].pname,
					desc: this.tags[i].pdesc
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
		Remove JsDoc comment slash-stars. Trims white space.
		@inner
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
		@inner
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
		Given the source of a jsdoc comment, finds the tags.
		@inner
		@method parseTags
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
				name = (bits[1] || '').toLowerCase();
				text = bits[2] || '';
				
				var typeText = splitType(text);
				text = typeText.text;

				if (name === 'param') { // is a parameter w/ long format
					var [pname, pdesc] = splitPname(text);
				}

				var tag = {
					name: name,
					type: typeText.type,
					text: text,
					pname: pname,
					pdesc: pdesc
				};

				if (name) {
					tags.push(tag);
				}
			}
		});
		
		return tags;
	}
	
	/**
		Split the parameter name and parameter desc from the tag text.
		@inner
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
		@inner
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
		@inner
		@method trim
		@param {string} text.
		@returns {string}
	 */
	function trim(text) {
		return text.replace(/^\s+|\s+$/g, '');
	}
	
	// other tags that can provide the memberof
	var memberofs = {methodof: 'method', propertyof: 'property'};
	// other tags that can provide the symbol name
	var nameables = ['constructor', 'module', 'namespace', 'method', 'property', 'function', 'variable'];
	
	/**
		Expand some shortcut tags. Modifies the tags argument in-place.
		@inner
		@method preprocess
		@param {Array.<Object>} tags
		@returns undefined
	 */
	function preprocess(tags) {
		var name = '',
			taggedName = '',
			kind = '',
			taggedKind = '',
			memberof = '',
			taggedMemberof = '',
			taggedId = '';
		
		var i = tags.length;
		while(i--) {
			if (tags[i].name === 'id') {
				if (taggedId) { tooManyTags('id'); }
				taggedId = tags[i].text;
			}
			
			if (tags[i].name === 'name') {
				if (name && name !== tags[i].text) { tooManyNames(name, tags[i].text); }
				taggedName = name = tags[i].text;
			}
			
			if (tags[i].name === 'kind') {
				if (kind && kind !== tags[i].text) { tooManyKinds(kind, tags[i].text); }
				taggedKind = kind = tags[i].text;
			}
			
			if (tags[i].name === 'memberof') {
				if (memberof) { tooManyTags('memberof'); }
				taggedMemberof = memberof = tags[i].text;
			}
			
			if ( nameables.indexOf(tags[i].name) > -1 ) {
				if (tags[i].text) {
					if (name && name !== tags[i].text) { tooManyNames(name, tags[i].text); }
					name = tags[i].text;
				}
				
				if (kind && kind !== tags[i].name) { tooManyKinds(kind, tags[i].name); }
				kind = tags[i].name;
			}
			
			if ( memberofs.hasOwnProperty(tags[i].name) ) {
				if (tags[i].text) {
					if (memberof) { tooManyTags(tags[i].name); }
					memberof = tags[i].text;
				}
				
				if (kind && kind !== memberofs[tags[i].name]) { tooManyKinds(kind, memberofs[tags[i].name]); }
				kind = memberofs[tags[i].name];
			}
		}
		
		if (name && !taggedName) {
			tags[tags.length] = {name: 'name', text: name };
		}
		
		if (kind && !taggedKind) {
			tags[tags.length] = {name: 'kind', text: kind };
		}
		
		if (memberof && !taggedMemberof) {
			tags[tags.length] = {name: 'memberof', text: memberof };
		}
		
		if (!taggedId) {
			tags[tags.length] = {name: 'id', text: ++idCounter };
		}
	}
	
	/**
		Throw error when two conflicting names are defined in the same doc.
	 	@inner
		@function tooManyNames
	 */
	function tooManyNames(name1, name2) {
		throw new Error('Conflicting names in documentation: '+name1+', '+name2);
	}
	
	/**
		Throw error when two conflicting kinds are defined in the same doc.
	 	@inner
		@function tooManyKinds
	 */
	function tooManyKinds(kind1, kind2) {
		throw new Error('Conflicting kinds in documentation: '+kind1+', '+kind2);
	}
	
	/**
		Throw error when conflicting tags are found.
		@inner
		@function tooManyTags
	 */
	function tooManyTags(tagName) {
		throw new Error('Symbol has too many tags of type: @'+tagName);
	}
})();



