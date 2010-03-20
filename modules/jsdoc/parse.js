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

var Tag = function(title, text) {
	this.title = title.toLowerCase();
	this.text = text;
}

Tag.parse = function(doc) {
	var tags = [],
		o = {};
	
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
			case 'memberof':
				o.memberof = $.text;
				o.memberof = o.memberof.replace(/\.prototype\b/g, '#');
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
	});
	
	handleName(tags, o);
	
	// TODO: keep a reference to any/all tags, so can be used in template later
	// o.tags = tags;
	
	return o;
}

Tag.prototype = {
	get type() {
		if (!this._type) { this._type = parseType(this.text); }
		return this._type;
	}
};

function parseType(text) {
	// extract characters between ^{ and matching }
	var nestCounter = 1,
		start = 1,
		end = null;
	
	if (!/^\{/.test(text)) {
		return '';
	}
	
	for (var i = 1, leni = text.length; i < leni; i++) {
		if (text.charAt(i) === '{') {
			nestCounter++;
		}
		else if (text.charAt(i) === '}') {
			nestCounter--;
		}
		
		if (nestCounter === 0) {
			end = i;
			return text.slice(start, stop);
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

function getTag(tags, title) {
	var tag;
	for (var i = 0, leni = tags.length; i < leni; i++) {
		tag = tags[i];
		if (tag.title == title) {
			return trim(tag.text);
		}
	};
	return null;
}

function handleName(tags, doc) {
	var nameTag = doc.name || getTag(tags, 'name'),
		memberofTag = doc.memberof || getTag(tags, 'memberof'),
		isinnerTag = doc.isinner || getTag(tags, 'inner') !== null,
		isstaticTag = doc.isstatic || getTag(tags, 'static') !== null,
		name;

 		name = docName(nameTag, memberofTag, {isstatic: isstaticTag, isinner: isinnerTag});
		
		doc.name = name.name;
		doc.shortname = name.shortname;
		doc.memberof = name.memberof;
		doc.isstatic = name.isstatic;
		doc.isinner = name.isinner;
}