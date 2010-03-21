export('parseDocs');

include('ringo/jsdoc');
include('jsdoc/common');
include('jsdoc/docName');

require('core/string');
require('core/array');
include('core/json');
include('ringo/file');
include('ringo/fileutils');
include('ringo/parser');
importPackage(org.mozilla.javascript);
importPackage(org.ringojs.repository);

/**
	Scan source file for documented symbols.
 */
function parseDocs(root, src) {
	var repo,
		script,
		tagSets,
		symbols;
	
	if (arguments.length === 1) {
		var parts = root.split(separator);
		src = parts.pop();
		root = parts.join(separator);
	}

	repo = new ScriptRepository(root);
	script = repo.getScriptResource(src);
	
	tagSets = getJsDocCommentTags(script);
	
	symbols = new SymbolSet(toSymbols(tagSets));

	return symbols;
}

/**
	Name was found in the code, may need some clean up, then add new tag.
 */
function addName(name, tagSet) {
	// clean up code name, to look like JsDoc name
	name = name
 		.replace('.prototype', '#')
 		.replace('"]["', '"."')
 		.replace('"].', '".').replace('.["', '."')
 		.replace('"]#', '"#').replace('#["', '#"')
 		.replace('["', '."').replace(/\"](.*)/, "\"$1");
 	
 	tagSet.name = name;
 	handleName(tagSet);
}

/**
	Information like the line number and filename.
 */
function addMeta(node, tagSet) {
	var lineno;
	
	tagSet.meta = {};
	
	try {
		lineno = node.getLineno();
		tagSet.meta.line = lineno + 1;
		tagSet.meta.file = node.getSourceName();
	}
	catch(e){}
}

/**
	Walk script nodes in a script resource, collect tag data.
 */
function getJsDocCommentTags(resource) {
	var tagSets = [], // accumulates sets of tags, as they are parsed from the source
		commentSrc,
		tags;
		
	
	visitScriptResource(resource, function(node) {
	
		//	if (node.type == Token.SCRIPT) { node.getSymbols(); }
		// print(nodeToString(node));

		// documented function with no @name tag
		// like: function foo(){}
		if (node.type == Token.FUNCTION) {
			if (commentSrc = node.jsDoc) {
				tags = Tag.parse(commentSrc);

				if ( !tags.hasTag('name') ) {
					addName(node.name, tags);
					addMeta(node, tags);
					tagSets.push(tags);
				}
			}
		}
		
		// documented function assignment with no @name tag
		// like foo = function(){}
		if (node.type === Token.ASSIGN) {

            if (node.right.type === Token.FUNCTION) {
            	if (commentSrc = node.jsDoc) {
					tags = Tag.parse(commentSrc);

					if ( !tags.hasTag('name') ) {
						addName(nodeToString(node.left), tags);
						addMeta(node, tags);
						tagSets.push(tags);
					}
            	}
            }
		}
		
		// documented var declaration, set to a function with no @name tag
		// like var foo = function(){}, bar = function(){}
		if (node.type == Token.VAR || node.type == Token.LET) {
			var counter = 0;
			for each (var n in ScriptableList(node.variables)) {
				if (n.target.type === Token.NAME && n.initializer.type === Token.FUNCTION) {
					commentSrc = (counter++ === 0 && !n.jsDoc)? node.jsDoc : n.jsDoc;
					if (commentSrc) {
						tags = Tag.parse(commentSrc);
						if ( !tags.hasTag('name') ) {
							addName(n.target.string, tags);
							addMeta((node.jsDoc? node : n), tags);
							tagSets.push(tags);
						}
					}
                }
			}
		}
		
		// jsdoc comment with a @name tag
 		if (node.type == Token.SCRIPT && node.comments) { 			
 			for each (var comment in node.comments.toArray()) {
 				if (comment.commentType == Token.CommentType.JSDOC) {

 					commentSrc = '' + comment.toSource();
 					
 					if (commentSrc) {
						tags = Tag.parse(commentSrc);
						if ( tags.hasTag('name') ) {
							addMeta(comment, tags);
							tagSets.push(tags);
						}
					}
 				}
 			}
 		}

		return true;
	});
	
	return tagSets;
};

/**
	Represents a documented symbol in the source code.
 */
function Symbol(shortname, name, description, memberof, isa) {
	this.shortname = shortname;
	this.name = name;
	this.description = description;
	this.memberof = memberof;
	this.isa = isa;
}

/**
	A collection of symbols. This is what the template will get.
 */
function SymbolSet(symbols) {
	this.symbols = symbols;
}

SymbolSet.prototype.toJSON = function() {
	var symbol,
		json = [];
	
	for (var i = 0, leni = this.symbols.length; i < leni; i++) {
		symbol = this.symbols[i];
		json.push({
			shortname: symbol.shortname,
			name: symbol.name,
			description: symbol.description,
			memberof: symbol.memberof,
			isa: symbol.isa
		});
	}
	
	return JSON.stringify(json);
}

SymbolSet.prototype.getSymbolByName = function(name) {
	var symbol;
	
	for (var i = 0, leni = this.symbols.length; i < leni; i++) {
		symbol = this.symbols[i];
		if (name === symbol.name) { return symbol; }
	}
}

/**
	Turn array of tadSets into an array of Symbols.
 */
function toSymbols(tagSets) {
	var symbols = [],
		symbol;
	
	for each (var tags in tagSets) {
		symbol = new Symbol(tags.getTag('shortname'), tags.getTag('name'), tags.getTag('description'), tags.getTag('memberof'), tags.getTag('isa'));
		symbol.meta = tags.meta;
		symbols.push( symbol );
	}
	
	return symbols;
}

/**
	Represents a single tag.
 */
var Tag = function(title, text) {
	this.title = (''+title).toLowerCase();
	this.text = text;
}

function hasTag(name) {
	return (this.getTag(name) !== null);
}

function getTag(name) {
	name = (''+name).toLowerCase();
	
	if (this[name]) { return this[name]; }
	
	for (var i = 0, leni = this.tags.length; i < leni; i++) {
		if (this.tags[i].title === name) { return this.tags[i].text; }
	}
	
	return null;
}

function getTags(name) {
	var text = [];
	name = (''+name).toLowerCase();
	
	if (this[name]) { return this[name]; }
	
	for (var i = 0, leni = this.tags.length; i < leni; i++) {
		if (this.tags[i].title === name) { text.push(this.tags[i].text); }
	}
	
	return text;
}

Tag.parse = function(doc) {
	var tags = [],
		o = {}; // a tagSet?
	
	doc = unwrapComment(('' || doc));
	
	// split out the basic tags
	doc
	.split(/(^|[\r\n])\s*@/)
	.filter( function($){ return $.match(/\S/); } )
	.forEach(function($) {
		// tags are like: @title text...
		var title,
			text,
			bits = $.match(/^(\S+)(?:\s([\s\S]*))?$/);

		if (bits) {
			title = bits[1] || '';
			text = bits[2] || '';
			
			if (title) { tags.push( new Tag(title, text) ); }
		}
	});
	
	// clean up, fill in any implied information, validate
	tags.forEach(function($) {
		switch ($.title) {
			case 'name':
				o.name = $.text;
				o.name = o.name.replace(/\.prototype\b/g, '#');
			break;
			case 'namespace':
				o.isa = 'namespace';
				if ($.text) { o.name = $.text; }
			break;
			case 'constructor':
				o.isa = 'constructor';
				if ($.text) { o.name = $.text; }
			break;
			case 'methodof':
				o.isa = 'method';
				if ($.text) { o.memberof = $.text; }
			break;
			case 'method':
				o.isa = 'method';
				if ($.text) { o.name = $.text; }
			break;
			case 'propertyof':
				o.isa = 'property';
				if ($.text) { o.memberof = $.text; }
			break;
			case 'property':
				if (!o.isa) {
					o.isa = 'property';
					if ($.text) { o.name = $.text; }
				}
			break;
			case 'description':
			case 'desc':
				o.description = $.text;
			break;
		}
		
		if (o.memberof) { o.memberof = o.memberof.replace(/\.prototype\b/g, '#'); }
	});
	
	// keep a reference to any/all tags, so they can be used in template later
	o.tags = tags;
	o.hasTag = hasTag;
	o.getTag = getTag;
	
	// name may not be known yet, if it's defined in the source code
	if (o.name) { handleName(o); }
	
	return o;
}

Tag.prototype = {
	get type() {
		if (!this._type) { this._type = parseType(this.text); }
		return this._type;
	}
};

function parseType(text) {}

/**
	Remove JsDoc comment artifacts. Trims white space.
	@private
	@name unwrapComment
	@param {string} commentSrc
	@return {string} Stars and slashes removed.
 */
function unwrapComment(commentSrc) {
	// TODO keep leading white space for @examples
	return commentSrc ? commentSrc.replace(/(^\/\*\*\s*|\s*\*\/$)/g, "").replace(/^\s*\* ?/gm, "") : "";
}

/**
	Sets various properties related to the symbol name on the doc object,
	based on the tags present. Will throw error in docName if we get this far 
	without a @name.
 */
function handleName(tagSet) {
	var nameTag     = tagSet.name     || tagSet.getTag('name'),
		memberofTag = tagSet.memberof || tagSet.getTag('memberof'),
		isinnerTag  = tagSet.isinner  || tagSet.hasTag('inner'),
		isstaticTag = tagSet.isstatic || tagSet.hasTag('static'),
		name;

	name = docName(nameTag, memberofTag, {isstatic: isstaticTag, isinner: isinnerTag});
	
	tagSet.name      = name.name;
	tagSet.shortname = name.shortname;
	tagSet.memberof  = name.memberof;
	tagSet.isstatic  = name.isstatic;
	tagSet.isinner   = name.isinner;
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
