export('Doc');

include('jsdoc/docName');
include('jsdoc/Tag');

var Doc = function(commentSrc) {
	this.commentSrc = unwrapComment(commentSrc);
	this.commentSrc = fixDesc(this.commentSrc);
	this.parse(this.commentSrc);
}


/**
	The name was found in the code, may need some clean up, then add new tag to doc.
	@function Doc#setName
 */
Doc.prototype.setName = function(name) {
	// clean up code-derived name to look like JsDoc namepath
	this.name = docName.fromSource(name);
 	docName.derive(this);
}

/**
	Add in information like the line number and filename.
	@param {org.mozilla.javascript.ast.AstNode} node
	@function Doc#addMeta
 */
Doc.prototype.addMeta = function(node) {
	var lineno;
	
	this.meta = {};
	
	try {
		lineno = node.getLineno();
		this.meta.line = lineno + 1;
		this.meta.file = node.getSourceName();
	}
	catch(e){
	}
}

/**
	@method Doc#hasTag
	@param {string} name
	@return {boolean}
 */
Doc.prototype.hasTag = function(name) {
	return (this.getTags(name) !== null);
}

Doc.prototype.getTag = function(name) {
	var tags = this.getTags(name);
	
	if (tags && tags.length) {
		return tags[0]; // first tag wins
	}
	
	return null;
}

Doc.prototype.getTags = function(name) {
	var tags = [];
	name = ('' + name).toLowerCase();
	
	if (this[name]) { // the set property is more authorative than the user supplied tag value
		return [this[name]];
	}
	
	for (var i = 0, leni = this.tags.length; i < leni; i++) {
		if (this.tags[i].name == name) {
			tags.push(this.tags[i].text);
		}
	}
	return (tags.length)? tags : null;
}

Doc.prototype.addTag = function(name, text) {
	this.tags.unshift(new Tag(name, text));
}

/**
	Given the raw text of the doc comment, finds tags and populates name-based Doc properties.
	@private
	@method Tag.parse
	@param {string} commentSrc Unwrapped.
 */
Doc.prototype.parse = function(commentSrc) {
	var tags = [];
	
	// split out the basic tags
	commentSrc
	.split(/(^|[\r\n])\s*@/)
	.filter( function($){ return $.match(/\S/); } )
	.forEach(function($) {
		// tags are like: @name text...
		var name,
			text,
			bits = $.match(/^(\S+)(?:\s([\s\S]*))?$/);

		if (bits) {
			name = bits[1] || '';
			text = bits[2] || '';
			
			if (name) { tags.push( new Tag(name, text) ); }
		}
	});
	
	// keep a reference to any/all tags, so they can be used in template later
	this.tags = tags;
	
	// clean up, fill in any implied information, validate
	var doc = this;
	tags.forEach(function($) {
		switch ($.name) {
			case 'name':
				doc.name = $.text || '';
			break;
 			case 'namespace':
 				doc.isa = 'namespace';
 				if ($.text) { doc.name = $.text; }
 			break;
 			case 'class':
 				doc.isa = 'constructor';
 			break;
 			case 'constructor':
 				doc.isa = 'constructor';
 				if ($.text) { doc.name = $.text; }
 			break;
 			case 'methodof':
 				doc.isa = 'method';
 				if ($.text) { doc.member = $.text; }
 			break;
 			case 'method':
 				doc.isa = 'method';
 				if ($.text) { doc.name = $.text; }
 			break;
 			case 'propertyof':
 				doc.isa = 'property';
 				if ($.text) { doc.member = $.text; }
 			break;
 			case 'property':
				doc.isa = 'property';
				if ($.text) { doc.name = $.text; }
 			break;
 			case 'desc':
 				doc.desc = $.text;
 			break;
		}
		
		if (doc.member) { doc.member = docName.fromSource(doc.member); }
	});

	// name may not be known yet, if it's defined in the source code
	if (this.name) {
		docName.derive(this);
	}
}

Doc.prototype.addIsa = function(nodeType) {
	if (!this.isa) {
		if (nodeType === Token.FUNCTION) {
			this.isa = 'method';
		}
	}
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