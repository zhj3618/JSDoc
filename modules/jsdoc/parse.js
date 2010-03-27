export('parseDocs');

include('ringo/jsdoc');
include('jsdoc/common');
include('jsdoc/docName');

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
	The name was found in the code, may need some clean up, then add new tag to doc.
	@private
	@function addName
 */
function addName(name, doc) {
print("addName("+name+", doc)");
	// clean up code-derived name to look like JsDoc namepath
	// might be stringy name, like foo["bar"]
	name = docName.fromSource(name);
 	doc.name = name;
 	handleName(doc);
}

/**
	Add in information like the line number and filename.
	@private
	@function addMeta
 */
function addMeta(node, doc) {
	var lineno;
	
	doc.meta = {};
	
	try {
		lineno = node.getLineno();
		doc.meta.line = lineno + 1;
		doc.meta.file = node.getSourceName();
	}
	catch(e){
	}
}

/**
	What does `this` mean in the doc name?
	@private
	@function
	@param {string} name Possibly starting with `this.`
	@param {org.mozilla.javascript.ast.AstNode} node The node in question.
	@param {string} [memberof] If the user provided a @memberof tag, we can use it.
	
	@return {string} The resolved namepath.
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
		if (anons[i][0] === node) {
			return anons[i][1];
		}
	}
	
	return null;
}
// tuples, like [ [noderef, jsdocName], [noderef, jsdocName] ]
var anons = [];

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
		
	//	if (node.type == Token.SCRIPT) { node.getSymbols(); }
	// print(nodeToString(node));

	// documented function with no @name tag
	// like:
	//     /** blah. */
	//     function foo() {
	//     }
	if (node.type == Token.FUNCTION) {
		if (commentSrc = node.jsDoc) {
			doc = new Doc(commentSrc);

			if ( !doc.hasTag('name') ) {
				name = resolveThis(doc.getTag('alias') || node.name, node, doc.getTag('memberof'));
				addName(name, doc);
				addMeta(node, doc);
				walker.docSet.push(doc);
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
				doc = new Doc(commentSrc);

				if ( !doc.hasTag('name') ) {
					name = resolveThis(doc.getTag('alias') || nodeToString(node.left), node, doc.getTag('memberof'));
					anons.push([node.right, name]);
					addName(name, doc);
					addMeta(node, doc);
					walker.docSet.push(doc);
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
					doc = new Doc(commentSrc);
					
					if ( !doc.hasTag('name') ) {
						name = resolveThis(doc.getTag('alias') || n.target.string, n.target, doc.getTag('memberof'));
						anons.push([n.initializer, name]);
						addName(name, doc);
						addMeta((node.jsDoc? node : n), doc);
						walker.docSet.push(doc);
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
					doc = new Doc(commentSrc);
					if ( doc.hasTag('name') ) {
						addMeta(comment, doc);
						walker.docSet.push(doc);
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
	Represents a documented symbol in the source code.
	@constructor Symbol
 */
// function Symbol(shortname, name, description, memberof, isa) {
// 	this.shortname = shortname;
// 	this.name = name;
// 	this.description = description;
// 	this.memberof = memberof;
// 	this.isa = isa;
// }

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
	Turn array of tadSets into an array of Symbols.
	@private
	@function toSymbols
	@param {TagSet} tagSet
	@return {Array<Symbol>}
 */
// function toSymbols(tagSet) {
// 	var symbols = [],
// 		symbol;
// 	
// 	for each (var tags in tagSet) {
// 		symbol = new Symbol(tags.getTag('shortname'), tags.getTag('name'), tags.getTag('description'), tags.getTag('memberof'), tags.getTag('isa'));
// 		symbol.meta = tags.meta;
// 		symbols.push( symbol );
// 	}
// 	
// 	return symbols;
// }

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
	this.commentSrc = unwrapComment(('' || commentSrc));
	
	this.parse(this.commentSrc);
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
	Get the texts of all the tags with the given title.
	@private
	@methodOf Tag#
	@param {string} title
	@return {Array<string>}
//  */
// function getTags(title) {
// 	var text = [];
// 	
// 	title = (''+title).toLowerCase();
// 	
// 	if (this[title]) { return this[title]; }
// 	
// 	for (var i = 0, leni = this.tags.length; i < leni; i++) {
// 		if (this.tags[i].title === title) { text.push(this.tags[i].text); }
// 	}
// 	
// 	return text;
// }

/**
	Given the raw text of the doc comment, returns an object representing that doc.
	@private
	@method Tag.parse
	@param {string} commentSrc Unwrapped.
	@return {Object}
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
				doc.name = doc.name.replace(/\.prototype\b/g, '#');
	
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
		
		if (doc.memberof) { doc.memberof = doc.memberof.replace(/\.prototype\b/g, '#'); }
	});
	// keep a reference to any/all tags, so they can be used in template later
	this.tags = tags;

	// name may not be known yet, if it's defined in the source code
	if (this.name) {
		handleName(this);
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
function handleName(doc) {
	var nameTag     = doc.name     || doc.getTag('name'),
		memberofTag = doc.memberof || doc.getTag('memberof'),
		isinnerTag  = doc.isinner  || doc.hasTag('inner'),
		isstaticTag = doc.isstatic || doc.hasTag('static'),
		name;
	name = docName(nameTag, memberofTag, {isstatic: isstaticTag, isinner: isinnerTag});
	
	doc.name      = name.name;
	doc.shortname = name.shortname;
	doc.memberof  = name.memberof;
	doc.isstatic  = name.isstatic;
	doc.isinner   = name.isinner;
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
