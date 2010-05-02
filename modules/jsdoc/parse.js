/**
	@overview Parse a file for jsdoc comments.
	@author Michael Mathews <micmath@gmail.com>
	@license Apache License 2.0 - See file 'LICENSE.markdown' in this project.
 */
importPackage(org.mozilla.javascript);

/**
	@module jsdoc/parse
	@namespace jsdoc.parse
	@requires common/fs
	@requires jsdoc/doc
 */
var jsdoc = jsdoc || {};
jsdoc.parse = (typeof exports === 'undefined')? {} : exports; // like commonjs

(function() {
	var fs  = require('common/fs'),
		doc = doc || require('./doc');
	
	/**
		Populated by {@link jsdoc/parse.parseDocs}
		@property docSet
		@type Array<jsdoc/doc.Doc>
	 */
	jsdoc.parse.docSet = [];
	
	/**
		@method getDocsByName
		@returns Array<jsdoc/doc.Doc>
	 */
	jsdoc.parse.docSet.getDocsByName = function(docName) {
		var docs = [],
			i = this.length;
		
		while (i--) {
			if (this[i].name === docName) {
				docs.push(this[i]);
			}
		}
		
		return docs;
	}
	
	var currentModule;
	
	/**
		Extract information from jsdoc comments in contents of the given filepath.
		@method parseDocs
		@param {String} filepath
		@throws {Error} If filepath does not exist or cannot be read.
		@returns undefined
	 */
	jsdoc.parse.parseDocs = function(filepath) {
		currentModule = '';
		
		if ( !fs.exists(filepath) ) {
			throw new Error('That file does not exist or cannot be read: ' + filepath);
		}
		
		parseScript(filepath, visitNode);
	}
	
	/**
		Analyse the current node, add a new Doc to jsdoc.parse.docSet
		@private
		@function visitNode
		@param {org.mozilla.javascript.ast.AstNode} node
		@returns {boolean} True to visit child nodes, false to skip.
	 */
	function visitNode(node) {
		var commentSrc = '',
			thisDoc = null;
		
		if (node.type == Token.SCRIPT && node.comments) { 			
			for each (var comment in node.comments.toArray()) {
				if (comment.commentType == Token.CommentType.JSDOC) {

					commentSrc = '' + comment.toSource();

					if (commentSrc) {
						if (currentModule) {
							commentSrc = commentSrc.replace(/\*\/$/, "\n@exportedby "+currentModule+"\n*/");
						}
						
						thisDoc = doc.fromComment(commentSrc);
						
						if (thisDoc.hasTag('ignore')) {
							continue;
						}
						
						if (thisDoc.hasTag('module')) {
							currentModule = thisDoc.tagText('module');
						}
						
						if (thisDoc.hasTag('name')) {
							jsdoc.parse.docSet.push( thisDoc.toObject() );
						}
					}
				}
			}
		}

		return true;
	}
	
	/**
		@private
		@function parseScript
	 */
	function parseScript(name, visitor) {
		var content = fs.read(name, {encoding: 'utf-8'}),
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
	
})();