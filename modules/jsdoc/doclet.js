/**
	@overview Represents a doc comment.
	@author Michael Mathews <micmath@gmail.com>
	@license Apache License 2.0 - See file 'LICENSE.markdown' in this project.
 */

/**
	Interface to objects representing a jsdoc comment and its tags.
	@module jsdoc/doclet
	@requires jsdoc/tag
	@namespace jsdoc.doclet
 */
var jsdoc = jsdoc || {};
jsdoc.doclet = (typeof exports === 'undefined')? {} : exports; // like commonjs
jsdoc.tag = require('jsdoc/tag');

(function() {
	var idCounter = 0;
	
	/**
		Factory that creates a Doclet object from a raw jsdoc comment string.
		@method fromComment
		@param {String} commentSrc
		@returns {Doclet}
	 */
	jsdoc.doclet.fromComment = function(commentSrc) {
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
		Get a JSON-compatible object representing this Doclet.
		@method Doclet#toObject
		@returns {Object}
	 */
	Doclet.prototype.toObject = function() {
		var tag, tagName, tagValue,
			o = {};
		
		for (var i = 0, leni = this.tags.length; i < leni; i++) {
			if (exportTags.indexOf(this.tags[i].name) === -1) { continue; }
		
			tag = this.tags[i];
			tagName = tag.name;
			tagValue = {};
			
			if (tag.type) {
				tagValue.type = tag.type;
				if (!tag.pname && tagValue.text) { tagValue.text = tag.text; }
			}
			if (tag.pname) { tagValue.name = tag.pname; }
			if (tag.pdesc) { tagValue.desc = tag.pdesc; }
			
			if (!tag.pname && !tag.type) { tagValue = tag.text; }
			
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
			var tag = new jsdoc.tag.fromTagText($);

			if (tag.name) {
				tags.push(tag);
			}
		});
		
		return tags;
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
			tags[tags.length] = jsdoc.tag.fromTagText('name ' + name);
		}
		
		if (kind && !taggedKind) {
			tags[tags.length] = jsdoc.tag.fromTagText('kind ' + kind);
		}
		
		if (memberof && !taggedMemberof) {
			tags[tags.length] = jsdoc.tag.fromTagText('memberof ' + memberof);
		}
		
		if (!taggedId) {
			tags[tags.length] = jsdoc.tag.fromTagText( 'id ' + (++idCounter) );
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