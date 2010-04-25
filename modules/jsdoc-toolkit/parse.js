/**
	@overview Parse a file for doc comments.
	@author Michael Mathews <micmath@gmail.com>
	@license Apache License 2.0 - See file 'LICENSE.markdown' in this project.
 */

importPackage(org.mozilla.javascript);

/**
	@namespace parse
 */
var parse = (typeof exports === 'undefined')? {} : exports; // like commonjs

(function() {
	var doc = doc || require('jsdoc-toolkit/doc');
	parse.docSet = [];
	
	parse.docSet.getDocsByName = function(docName) {
		var docs = [],
			i = this.length;
		
		while (i--) {
			if (this[i].name === docName) {
				docs.push(this[i]);
			}
		}
		
		return docs;
	}
	
	parse.getDocs = function(filepath) {
		parseScript(filepath, visitNode);
	}
	
	/**
	 * Adds a new Doc to parse.docSet
	 * @param {org.mozilla.javascript.ast.AstNode} node
	 */
	function visitNode(node) {
		var commentSrc = '',
			thisDoc = null;
		
		if (node.type == Token.SCRIPT && node.comments) { 			
			for each (var comment in node.comments.toArray()) {
				if (comment.commentType == Token.CommentType.JSDOC) {

					commentSrc = '' + comment.toSource();

					if (commentSrc) {
						thisDoc = doc.fromComment(commentSrc);
						if ( thisDoc.hasTag('name') && !thisDoc.hasTag('ignore')) {
							parse.docSet.push( thisDoc.toObject() );
						}
					}
				}
			}
		}

		return true; // visit child nodes?
	}
	
	function parseScript(name, visitor) {
		var content = readFile(name, 'utf-8'),
			ast = getParser().parse(content, name, 0);
			
		ast.visit(
			new org.mozilla.javascript.ast.NodeVisitor({
				visit: visitor
			})
		);
	}
	
	function getParser() {
		var ce = new CompilerEnvirons();
		ce.setRecordingComments(true);
		ce.setRecordingLocalJsDocComments(true);
		ce.initFromContext(Context.getCurrentContext());
		return new Parser(ce, ce.getErrorReporter());
	}
})();



