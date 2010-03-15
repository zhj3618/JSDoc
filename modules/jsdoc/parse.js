export('parseDocs');

include('ringo/jsdoc');
include('jsdoc/common');

require('core/string');
require('core/array');
include('core/json');
include('ringo/file');
include('ringo/fileutils');
include('ringo/parser');
importPackage(org.mozilla.javascript);
importPackage(org.ringojs.repository);

function parseDocs(root, src) {
	var data = [],
		repo,
		script,
		docs,
		symbols;
	
	if (arguments.length === 1) {
		var parts = root.split(separator);
		src = parts.pop();
		root = parts.join(separator);
	}

	repo = new ScriptRepository(root);
	script = repo.getScriptResource(src);
	
	try {
		docs = getJsDocComments(script);
	}
	catch(e) {
		die('Could not get JsDoc comments from file ' + root + separator + src);
	}
	
	symbols = new SymbolSet(toSymbols(docs));

	return symbols;
}

function getJsDocComments(resource) {
	var comments = [];
	
	visitScriptResource(resource, function(node) {
		// loop through all comments looking for dangling jsdocs
		if (node.type == Token.SCRIPT && node.comments) {
			for each (var comment in node.comments.toArray()) {
				if (comment.commentType == Token.CommentType.JSDOC) {
					comments.push(comment.value);
				}
			}
		}
		return true;
	});

	return comments;
};

function Symbol(shortName, name, description, memberOf, isa) {
	this.shortName = shortName;
	this.name = name;
	this.description = description;
	this.memberOf = memberOf;
	this.isa = isa;
}

function SymbolSet(symbols) {
	this.symbols = symbols;
}

SymbolSet.prototype.toJSON = function() {
	var symbol,
		jsonRoot = [];
	
	for (var i = 0, leni = this.symbols.length; i < leni; i++) {
		symbol = this.symbols[i];
		jsonRoot.push({
			shortName: symbol.shortName,
			name: symbol.name,
			description: symbol.description,
			memberOf: symbol.memberOf,
			isa: symbol.isa
		});
	}
	
	return JSON.stringify(jsonRoot);
}

SymbolSet.prototype.getSymbolByName = function(name) {
	for (var i = 0, leni = this.symbols.length; i < leni; i++) {
		symbol = this.symbols[i];
		if (name === symbol.name) { return symbol; }
	}
}

SymbolSet.prototype.getSymbolByParentName = function(name) {
	for (var i = 0, leni = this.symbols.length; i < leni; i++) {
		symbol = this.symbols[i];
		if (name === symbol.memberOf) { return symbol; }
	}
}

function toSymbols(docs) {
	var doc,
		o,
		symbols = [];
	
	for (var i = 0, leni = docs.length; i < leni; i++) {
		doc = unwrapComment(docs[i]);
		
		if (doc.charAt(0) === '{') { // starts with "{", treat as JSON
			try {
				o = JSON.parse(doc);
			}
			catch (e) {
				die("Could not parse JSON in doc comment:\n"+doc);
			}
			symbols.push( new Symbol(o.shortName, o.name, o.description, o.memberOf, o.isa) );
		}
	}
	
	return symbols;
}

/**
	Remove jsdoc comment start and end. Trim white space.
	@private
	@name unwrapComment
 */
function unwrapComment(comment) {
	return comment ? comment.replace(/(^\/\*\*\s*|\s*\*\/$)/g, "").replace(/^\s*\* ?/gm, "") : "";
}