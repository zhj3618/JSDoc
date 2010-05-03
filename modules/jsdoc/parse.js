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
	var fs  = require('common/fs'),
		doclet = doclet || require('./doclet');
		jsdoc.name = jsdoc.name || require('jsdoc/name');
	
	/**
		Populated by {@link jsdoc/parse.parseDocs}
		@property jsdoc.parse.docSet
		@type Array<Doclet>
	 */
	jsdoc.parse.docSet = [];
	
	/**
		@method jsdoc.parse.docSet.getDocsByName
		@returns Array<Doclet>
	 */
	jsdoc.parse.docSet.getDocsByName = function(docName) {
		var docs = [],
			i = this.length;
		
		while (i--) {
			if (this[i].tagText('longname') === docName) {
				docs.push(this[i]);
			}
		}
		
		return docs;
	}
	
	jsdoc.parse.docSet.toObject = function() {
		var docsObjects = [],
			i = this.length;
		
		while (i--) {
			docsObjects.push( this[i].toObject() );
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

	var anonymousDoc;
	
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
			thisDocletName = '',
			thisModule = '';
		
		if (node.jsDoc) {
			// named doclet
			commentSrc = '' + node.jsDoc;
			thisDoclet = doclet.fromComment(commentSrc);
			thisDocletName = thisDoclet.tagText('longname');
			
			if (thisDocletName) {
				anonymousDoc = '';
				
				// module doclets are always named
				if ( thisModule = thisDoclet.tagText('module') ) {
					currentModule = thisModule;
					currentExport = thisDoclet.tagText('exports') || 'exports';
				}
				
				// is this symbol being exported? add @exportedby tag
				if (currentModule && currentExport === thisDoclet.tagText('memberof')) {
					thisDoclet.tagText('exportedby', currentModule);
					exported.push(thisDocletName);
				}
				
				jsdoc.parse.docSet.push(thisDoclet);
			}
			else {
				// stash it until we find a name in the code
				anonymousDoc = commentSrc;
			}
		}
		else {
			// anonymous doclets have no name provided, try to get name from code
			var type = ''+getTypeName(node);
			
			if (type == 'ASSIGN') { // assignment to the exports object?
				thisDocletName = nodeToString(node.left);
				thisDocletName = thisDocletName.replace(/\.prototype\.?/g, '#');
				
				// exported
 				if (jsdoc.name.shorten(thisDocletName)[0] === currentExport) {
					// but not documented				
 					if (exported.indexOf(thisDocletName) === -1) {
 						if (!anonymousDoc) anonymousDoc = '/** @exportedby '+currentModule+' */';
 					}
 				}
			}
			
			// code name used
			if (type == 'GETPROP' || type == 'NAME') {
				thisDocletName = ''+nodeToString(node);
				thisDocletName = thisDocletName.replace(/\.prototype\.?/g, '#');
				
				if ( anonymousDoc) {
					anonymousDoc = anonymousDoc.replace('*/', "\n@name "+thisDocletName+"\n*/");
					thisDoclet = doclet.fromComment(anonymousDoc);
					
					if (currentModule && currentExport === thisDoclet.tagText('memberof')) {
						thisDoclet.tagText('exportedby', currentModule);
						exported.push(thisDocletName);
					}
						
					jsdoc.parse.docSet.push( thisDoclet );
					anonymousDoc = '';
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
	
})();