/**
	@overview Parse a file for jsdoc comments.
	@author Michael Mathews <micmath@gmail.com>
	@license Apache License 2.0 - See file 'LICENSE.markdown' in this project.
 */

importPackage(org.mozilla.javascript);

/**
	@module jsdoc/parse
	@exports jsdoc.parse
	@requires common/fs
	@requires jsdoc/doclet
	@requires jsdoc/name
 */
var jsdoc = jsdoc || {};

/** @namespace */
jsdoc.parse = (typeof exports === 'undefined')? {} : exports; // like commonjs

(function() {
	var fs  = require('common/fs');
	
	jsdoc.doclet = jsdoc.doclet || require('./doclet');
	jsdoc.name = jsdoc.name     || require('jsdoc/name');
	
	/**
		Populated by {@link jsdoc/parse.parseDocs}
		@property jsdoc.parse.docSet
		@type Array.<Doclet>
	 */
	jsdoc.parse.docSet = [];
	
	/**
		@method jsdoc.parse.docSet.getDocsByName
		@returns Array.<Doclet>
	 */
	jsdoc.parse.docSet.getDocsByName = function(docName) {
		var docs = [],
			i = this.length;
		
		while (i--) {
			if (this[i].tagText('longname') === docName) {
				docs.unshift(this[i]);
			}
		}
		
		return docs;
	}
	
	jsdoc.parse.docSet.toObject = function() {
		var docsObjects = [],
			i = this.length;
	
		while (i--) {
			docsObjects.unshift( this[i].toObject() );
		}
		
		return { doc: docsObjects };
	}
	
	jsdoc.parse.docSet.toJSON = function() {
		return require('flesler/jsdump').jsDump.parse( jsdoc.parse.docSet.toObject() );
	}
	
	jsdoc.parse.docSet.toXML = function() {
		var o = jsdoc.parse.docSet.toObject();
		
		// make `id` an attribute of the doc tag
		for (var i = 0, leni = o.doc.length; i < leni; i++) {
			for (var p in o.doc[i]) {
				if (p === 'id') {
					o.doc[i]['@id'] = o.doc[i].id;
					delete o.doc[i].id;
				}
			}
		}
		
		return require('goessner/json2xml').convert(
			{ jsdoc: o }
		);
	}
	
	var currentModule, currentExport, exported;
	
	/**
		Extract information from jsdoc comments in contents of the given filepath.
		@method jsdoc.parse.parseDocs
		@param {String} filepath
		@throws {Error} If filepath does not exist or cannot be read.
		@returns undefined
	 */
	jsdoc.parse.parseDocs = function(filepath) {
		currentModule = '';
		currentExport = '';
		exported = [];
		
		if ( !fs.exists(filepath) ) {
			throw new Error('That file does not exist or cannot be read: ' + filepath);
		}
		
		parseScript(filepath, visitNode);	
	}

	/**
		Analyse the current node, possibly add a new Doclet to jsdoc.parse.docSet
		@private
		@function visitNode
		@param {org.mozilla.javascript.ast.AstNode} node
		@returns {boolean} True to visit child nodes, false to skip.
	 */
	function visitNode(node) {
		var commentSrc = '',
			thisDoclet = null,
			thisDocletName = '';
		
		// look for all comments that have names provided
		if (node.type === Token.SCRIPT && node.comments) { 			
			for each (var comment in node.comments.toArray()) {
				if (comment.commentType === Token.CommentType.JSDOC) {
					commentSrc = '' + comment.toSource();

					if (commentSrc) {
						thisDoclet = jsdoc.doclet.fromComment(commentSrc);
						if ( thisDoclet.hasTag('name') ) {
							jsdoc.parse.docSet.push(thisDoclet);
						}
					}
				}
			}
		}
		
		// like function foo() {}
		if (node.type == Token.FUNCTION) {
			if (node.jsDoc) {
				commentSrc = '' + node.jsDoc;
				
				thisDoclet = jsdoc.doclet.fromComment(commentSrc);
				thisDocletName = thisDoclet.tagText('longname');
				
				if (!thisDocletName) {
					thisDoclet.setName('' + node.name);
					jsdoc.parse.docSet.push(thisDoclet);
				}
			}
		}
		
		// like foo = function(){} or foo: function(){}
		if (node.type === Token.ASSIGN || node.type === Token.COLON) {
			var name = nodeToString(node.left);
			commentSrc = node.jsDoc || node.left.jsDoc;

			if (commentSrc) {
				commentSrc = '' + commentSrc;

				thisDoclet = jsdoc.doclet.fromComment(commentSrc);
				thisDocletName = thisDoclet.tagText('name');

				if (!thisDocletName) {
					name = jsdoc.name.resolveThis( name, node, thisDoclet );
					thisDoclet.setName(name);
					jsdoc.parse.docSet.push(thisDoclet);
				}
			}
			jsdoc.name.anons.push([node.right, (thisDocletName||name)]);

			return true;
		}
		
		// like var foo = function(){}
		if (node.type == Token.VAR || node.type == Token.LET) {
			var counter = 0;
			
			if (node.variables) for each (var n in node.variables.toArray()) {

				if (n.target.type === Token.NAME && n.initializer/* && n.initializer.type === Token.FUNCTION*/) {
					commentSrc = (counter++ === 0 && !n.jsDoc)? node.jsDoc : n.jsDoc;
					if (commentSrc) {
						thisDoclet = jsdoc.doclet.fromComment('' + commentSrc);
						thisDocletName = thisDoclet.tagText('longname');
						
						if ( !thisDocletName ) {
							thisDocletName = n.target.string;
							thisDoclet.setName(thisDocletName);
							jsdoc.parse.docSet.push(thisDoclet);
						}
					}
				}
			}
			return true;
		}
		
		return true;
	}
	
	/**
		@private
		@function parseScript
	 */
	function parseScript(name, visitor) {
		var content = fs.read(name, {encoding: 'utf-8'}), // TODO allow encoding to be user-configured
			ast = getParser().parse(content, name, 0);
			
		ast.visit(
			new org.mozilla.javascript.ast.NodeVisitor({
				visit: visitor
			})
		);
	}
	
	/**
		@private
		@function getParser
	 */
	function getParser() {
		var ce = new CompilerEnvirons();
		ce.setRecordingComments(true);
		ce.setRecordingLocalJsDocComments(true);
		ce.initFromContext(Context.getCurrentContext());
		return new Parser(ce, ce.getErrorReporter());
	}
	
	/**
		@private
		@function nodeToString
		@param {org.mozilla.javascript.ast.AstNode} node
		@returns {string}
	 */
	// credit: ringojs ninjas
	function nodeToString(node) {
		var str;
		
		if (node.type === Token.GETPROP) {
			str = [nodeToString(node.target), node.property.string].join('.');
		}
		else if (node.type === Token.NAME) {
			str = node.string;
		}
		else if (node.type === Token.STRING) {
			str = node.value;
		}
		else if (node.type === Token.THIS) {
			str = 'this';
		}
		else if (node.type === Token.GETELEM) {
			str = node.toSource(); // like: Foo['Bar']
		}
		else {
			str = getTypeName(node);
		}
		
		return '' + str;
	};
	
	/**
		@private
		@function getTypeName
		@param {org.mozilla.javascript.ast.AstNode} node
		@returns {string}
	 */
	// credit: ringojs ninjas
	function getTypeName(node) {
		return node ? ''+org.mozilla.javascript.Token.typeToName(node.getType()) : '' ;
	}
	
})();