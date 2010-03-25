export('parseDocs');

include('ringo/jsdoc');
include('jsdoc/common');
include('jsdoc/docName');

include('ringo/fileutils');
include('ringo/parser');

/**
	Scan source file for documented symbols.
	@function parseDocs
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
	@private
	@function addName
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
	Add in information like the line number and filename.
	@private
	@function addMeta
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
	What does `this` mean in the symbol name?
	@private
	@function
	@param {string} name Possibly starting with `this.`
	@param {org.mozilla.javascript.ast.AstNode} node The node in question.
	@param {string} [memberof] If the user provided a @memberof tag, we can use it. 
 */
function resolveThis(name, node, memberof) {
	var enclosingFunction;
	
	if (name.indexOf('this.') === 0) {
		if (!memberof) {
			if (enclosingFunction = node.getEnclosingFunction()) {
				memberof = enclosingFunction.getName(); // empty string for anonymous functions
			}
			
			if (memberof) {
				name = memberof + '#' + name.slice(5); // replace this. with foo#
			}
			else { // it's an anonymous function
				memberof = nameFromAnon(enclosingFunction);
				
				if (memberof) {
					name = memberof + '#' + name.slice(5); // replace `this.` with memberof
				}
			}
		}
		else {
			name = name.slice(5);
		}
	}
	return name;
}

/**
	Keep track of anonymous functions that have been assigned to documented symbols.
	@private
	@function nameFromAnon
	@param {org.mozilla.javascript.ast.AstNode} node
	@return {string|null} The documented name, if any.
 */
function nameFromAnon(node) {
	var i = anons.length;
	while (i--) {
		if (anons[i][0] === node) { return anons[i][1]; }
	}
	
	return null;
}
// tuples, like [ [noderef, jsdocName], [noderef, jsdocName] ]
var anons = [];

/**
	Called automatically by {@link getJsDocCommentTags}.
	@private
	@function walker
	@param {org.mozilla.javascript.ast.AstNode} node
 */
function walker(node) {
	var commentSrc,
		tags,
		name;
		
	//	if (node.type == Token.SCRIPT) { node.getSymbols(); }
	// print(nodeToString(node));

	// documented function with no @name tag
	// like:
	//     /** blah. */
	//     function foo() {
	//     }
	if (node.type == Token.FUNCTION) {
		if (commentSrc = node.jsDoc) {
			tags = Tag.parse(commentSrc);

			if ( !tags.hasTag('name') ) {
				name = resolveThis(tags.getTag('alias') || node.name, node, tags.getTag('memberof'));
				addName(name, tags);
				addMeta(node, tags);
				walker.tagSets.push(tags);
			}
		}
	}
	
	// documented bare name, assigned to an anonymous function, with no @name tag
	// like:
	//     /** blah. */
	//     foo = function() {
	//     }
	if (node.type === Token.ASSIGN) {

		if (node.right.type === Token.FUNCTION) {
			if (commentSrc = node.jsDoc) {
				tags = Tag.parse(commentSrc);

				if ( !tags.hasTag('name') ) {
					name = resolveThis(tags.getTag('alias') || nodeToString(node.left), node, tags.getTag('memberof'));
					anons.push([node.right, name]);
					addName(name, tags);
					addMeta(node, tags);
					walker.tagSets.push(tags);
				}
			}
		}
	}
	
	// documented var declaration(s), assigned to an anonymous function(s), with no @name tag
	// like:
	//     /** blah. */
	//     var foo = function() {
	//         },
	//         /** blah. */
	//         bar = function() {
	//         }
	if (node.type == Token.VAR || node.type == Token.LET) {
		var counter = 0;
		for each (var n in ScriptableList(node.variables)) {
			if (n.target.type === Token.NAME && n.initializer && n.initializer.type === Token.FUNCTION) {
				commentSrc = (counter++ === 0 && !n.jsDoc)? node.jsDoc : n.jsDoc;
				if (commentSrc) {
					tags = Tag.parse(commentSrc);
					if ( !tags.hasTag('name') ) {
						name = resolveThis(tags.getTag('alias') || n.target.string, n.target, tags.getTag('memberof'));
						anons.push([n.initializer, name]);
						addName(name, tags);
						addMeta((node.jsDoc? node : n), tags);
						walker.tagSets.push(tags);
					}
				}
			}
		}
	}
	
	// jsdoc comment with a @name tag (the easy case!)
	// like:
	//     /** @name foo*/
	//     // whatever
	if (node.type == Token.SCRIPT && node.comments) { 			
		for each (var comment in node.comments.toArray()) {
			if (comment.commentType == Token.CommentType.JSDOC) {

				commentSrc = '' + comment.toSource();
				
				if (commentSrc) {
					tags = Tag.parse(commentSrc);
					if ( tags.hasTag('name') ) {
						addMeta(comment, tags);
						walker.tagSets.push(tags);
					}
				}
			}
		}
	}

	return true;
}

/**
	Walk script nodes in a script resource, collect tag data.
	@private
	@function getJsDocCommentTags
	@param {org.ringojs.repository.Resource} resource Source file to scan.
	@return {TagSet}
 */
function getJsDocCommentTags(resource) {
	walker.tagSets = []; // accumulates tagSets while walker recurses through the code tree
	
	// see http://ringojs.org/api/ringo/parser
	visitScriptResource(resource, walker);
	
	return walker.tagSets;
};

/**
	Represents a documented symbol in the source code.
	@constructor Symbol
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
	@constructor SymbolSet
	@param {Array<Symbol>}
 */
function SymbolSet(symbols) {
	this.symbols = symbols;
}

/**
	Convert this SymbolSet to a JSON string.
	@name SymbolSet#toJSON
	@return {string}
 */
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

/**
	Returns the first symbol with the given title.
	@private
	@function SymbolSet#getSymbolByName
	@return {Symbol|null}
 */
SymbolSet.prototype.getSymbolByName = function(name) {
	var symbol;
	
	for (var i = 0, leni = this.symbols.length; i < leni; i++) {
		symbol = this.symbols[i];
		if (name === symbol.name) { return symbol; }
	}
	
	return null;
}

/**
	Turn array of tadSets into an array of Symbols.
	@private
	@function toSymbols
	@param {TagSet} tagSet
	@return {Array<Symbol>}
 */
function toSymbols(tagSet) {
	var symbols = [],
		symbol;
	
	for each (var tags in tagSet) {
		symbol = new Symbol(tags.getTag('shortname'), tags.getTag('name'), tags.getTag('description'), tags.getTag('memberof'), tags.getTag('isa'));
		symbol.meta = tags.meta;
		symbols.push( symbol );
	}
	
	return symbols;
}

/**
	Represents a single tag.
	@private
	@constructor Tag
	@param {string} title
	@param {string} text
 */
var Tag = function(title, text) {
	this.title = (''+title).toLowerCase();
	this.text = text;
}

/**
	Does this TagSet have a tag with the given title.
	@private
	@methodOf Tag#
	@param {string} title
 */
function hasTag(name) {
	return (this.getTag(name) !== null);
}

/**
	Get the text of all the first tag with the given title.
	@private
	@methodOf Tag#
	@param {string} title
	@return {string|null}
 */
function getTag(title) {
	title = (''+title).toLowerCase();
	
	if (this[title]) { return this[title]; }
	
	for (var i = 0, leni = this.tags.length; i < leni; i++) {
		if (this.tags[i].title === title) { return this.tags[i].text; }
	}
	
	return null;
}

/**
	Get the texts of all the tags with the given title.
	@private
	@methodOf Tag#
	@param {string} title
	@return {Array<string>}
 */
function getTags(title) {
	var text = [];
	
	title = (''+title).toLowerCase();
	
	if (this[title]) { return this[title]; }
	
	for (var i = 0, leni = this.tags.length; i < leni; i++) {
		if (this.tags[i].title === title) { text.push(this.tags[i].text); }
	}
	
	return text;
}

/**
	Given the raw text of the doc comment, returns an object representing that doc.
	@private
	@method Tag.parse
	@param {string} doc
	@return {Object}
 */
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

// todo
Tag.prototype = {
	get type() {
		if (!this._type) { this._type = parseType(this.text); }
		return this._type;
	}
};

// todo
function parseType(text) {}

/**
	Remove JsDoc comment artifacts. Trims white space.
	@private
	@function unwrapComment
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
	@private
	@function handleName
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
