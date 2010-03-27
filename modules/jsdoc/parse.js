export('parseDocs');

include('ringo/jsdoc');
include('jsdoc/common');
include('jsdoc/docName');
include('jsdoc/parseSteps');

include('ringo/fileutils');
include('ringo/parser');

/**
	Scan source file for documented docs.
	@function parseDocs
	@param root
	@param src
 */
function parseDocs(root, src) {
	var repo,
		script,
		docs,
		docSet;
	
	if (arguments.length === 1) {
		var parts = root.split(separator);
		src = parts.pop();
		root = parts.join(separator);
	}

	repo = new ScriptRepository(root);
	script = repo.getScriptResource(src);
	
	docs = walk(script);
	
	docSet = new DocSet(docs);

	return docSet;
}



/**
	Called automatically by {@link walk}.
	@private
	@function walker
	@param {org.mozilla.javascript.ast.AstNode} node
 */
function walker(node) {
	var commentSrc,
		doc,
		name;
	
	for (var i, leni = parseSteps.length; i < leni; i++) {
		if ( parseSteps[i](node, walker.docSet) ) {
			break;
		}
	}

	return true;
}

/**
	Walk script nodes in a script resource, collect tag data.
	@private
	@function walk
	@param {org.ringojs.repository.Resource} resource Source file to scan.
	@return {TagSet}
 */
function walk(resource) {
	walker.docSet = []; // accumulates docs while walker recurses through the code tree
	
	// see http://ringojs.org/api/ringo/parser
	visitScriptResource(resource, walker);
	
	return walker.docSet;
};


/**
	A collection of symbols. This is what the template will get.
	@constructor DocSet
	@param {Array<Symbol>}
 */
function DocSet(docs) {
	this.docs = docs;
}

/**
	Convert this DocSet to a JSON string.
	@name DocSet#toJSON
	@return {string}
 */
DocSet.prototype.toJSON = function() {
	var doc,
		json = [];
	
	for (var i = 0, leni = this.docs.length; i < leni; i++) {
		doc = this.docs[i];
		json.push({
			shortname: doc.shortname,
			name: doc.name,
			description: doc.description,
			memberof: doc.memberof,
			isa: doc.isa
		});
	}
	
	return JSON.stringify(json);
}

/**
	Returns the first doc with the given name.
	@private
	@function DocSet#getDocByName
	@return {Doc|null}
 */
DocSet.prototype.getDocByName = function(name) {
	var doc;
	
	for (var i = 0, leni = this.docs.length; i < leni; i++) {
		doc = this.docs[i];
		if (name === doc.name) {
			return doc; // first one wins
		}
	}
	
	return null;
}

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

/**
	Represents a JsDoc comment in the source code.
	@param {string} commentSrc
 */
var Doc = function(commentSrc) {
	this.commentSrc = unwrapComment(commentSrc);
	
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
 			case 'constructor':
 				doc.isa = 'constructor';
 				if ($.text) { doc.name = $.text; }
 			break;
 			case 'methodof':
 				doc.isa = 'method';
 				if ($.text) { doc.memberof = $.text; }
 			break;
 			case 'method':
 				doc.isa = 'method';
 				if ($.text) { doc.name = $.text; }
 			break;
 			case 'propertyof':
 				doc.isa = 'property';
 				if ($.text) { doc.memberof = $.text; }
 			break;
 			case 'property':
 				if (!doc.isa) {
 					doc.isa = 'property';
 					if ($.text) { doc.name = $.text; }
 				}
 			break;
 			case 'description':
 			case 'desc':
 				doc.description = $.text;
 			break;
		}
		
		//if (doc.memberof) { docName.fromSource(doc.memberof); }
	});
	
	// keep a reference to any/all tags, so they can be used in template later
	this.tags = tags;

	// name may not be known yet, if it's defined in the source code
	if (this.name) {
		docName.derive(this);
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

// credit: ringojs ninjas
function nodeToString(node) {
    if (node.type === Token.GETPROP) {
        return [nodeToString(node.target), node.property.string].join('.');
    }
    else if (node.type === Token.NAME) {
        return node.string;
    }
    else if (node.type === Token.STRING) {
        return node.value;
    }
    else if (node.type === Token.THIS) {
        return 'this';
    }
    else if (node.type === Token.GETELEM) {
        return node.toSource(); // like: Foo['Bar']
    }
    else {
        return getTypeName(node);
    }
};

// credit: ringojs ninjas
function getTypeName(node) {
    return node ? org.mozilla.javascript.Token.typeToName(node.getType()) : '' ;
}
