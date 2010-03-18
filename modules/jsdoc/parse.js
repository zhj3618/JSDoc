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

function Symbol(shortname, name, description, memberof, isa) {
	this.shortname = shortname;
	this.name = name;
	this.description = description;
	this.memberof = memberof;
	this.isa = isa;
}

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
	for (var i = 0, leni = this.symbols.length; i < leni; i++) {
		symbol = this.symbols[i];
		if (name === symbol.name) { return symbol; }
	}
}

/**
	Turn comment texts into symbols.
 */
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
			symbols.push( new Symbol(o.shortname, o.name, o.description, o.memberof, o.isa) );
		}
		else {
			o = Tag.parse(doc);
			symbols.push( new Symbol(o.shortname, o.name, o.description, o.memberof, o.isa) );
		}
	}
	
	return symbols;
}

var Tag = function(title, body) {
	this.title = title.toLowerCase();
	this.body = body;
}

Tag.parse = function(doc) {
	var tags = [],
		o = {};
	
	// split out the basic tags
	doc
	.split(/(^|[\r\n])\s*@/)
	.filter( function($){ return $.match(/\S/); } )
	.forEach(function($) {
		// tags are like: @title body...
		var title,
			body,
			bits = $.match(/^(\S+)(?:\s([\s\S]*))?$/);

		if (bits) {
			title = bits[1] || '';
			body = bits[2] || '';
			
			if (title) { tags.push( new Tag(title, body) ); }
		}
	
	});
	
	// clean up, fill in any implied information, validate
	tags.forEach(function($) {
		switch ($.title) {
			case 'name':
				o.name = $.body;
				o.name = o.name.replace(/\.prototype\b/g, '#');
			break;
			case 'memberof':
				o.memberof = $.body;
				o.memberof = o.memberof.replace(/\.prototype\b/g, '#');
				o.shortname = o.name;
				o.name = (/.#$/.test(o.memberof)? o.memberof : o.memberof + '.') + o.name;
			break;
			case 'namespace':
				o.isa = 'namespace';
				if ($.body) { o.name = $.body; }
			break;
			case 'constructor':
				o.isa = 'constructor';
				if ($.body) { o.name = $.body; }
			break;
			case 'method':
				o.isa = 'method';
				if ($.body) { o.name = $.body; }
			break;
			case 'property':
				if (!o.isa) {
					o.isa = 'property';
					if ($.body) { o.name = $.body; }
				}
			break;
			case 'description':
			case 'desc':
				o.description = $.body;
			break;
		}
	});
	
	// TODO: keep a reference to any/all tags, so can be used in template later
	// o.tags = tags;
	
	return o;
}

Tag.prototype = {
	get type() {
		if (!this._type) { this._type = parseType(this.body); }
		return this._type;
	}
};

function parseType(body) {
	// extract characters between ^{ and matching }
	var nestCounter = 1,
		start = 1,
		end = null;
	
	if (!/^\{/.test(body)) {
		return '';
	}
	
	for (var i = 1, leni = body.length; i < leni; i++) {
		if (body.charAt(i) === '{') {
			nestCounter++;
		}
		else if (body.charAt(i) === '}') {
			nestCounter--;
		}
		
		if (nestCounter === 0) {
			end = i;
			return body.slice(start, stop);
		}
	}
}

/**
	Remove jsdoc comment start and end. Trim white space.
	@private
	@name unwrapComment
 */
function unwrapComment(comment) {
	return comment ? comment.replace(/(^\/\*\*\s*|\s*\*\/$)/g, "").replace(/^\s*\* ?/gm, "") : "";
}