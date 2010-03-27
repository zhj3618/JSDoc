export('parseSteps');

include('jsdoc/Doc');
include('jsdoc/docName');
include('jsdoc/Tag');

/**
	@desc Handlers for source code patterns that are recognized by JsDoc Toolkit.
	@name parseStep
	@function
	@param {org.mozilla.javascript.ast.AstNode} node A source code node.
	@param {DocSet} docs Accumulates new Doc objects derived from processing the nodes.
	@return {boolean} Return true to stop further processing of the current node.
 */

var parseSteps = [

	/**
		Handle a jsdoc comment with a @name tag (the common case).
		@private
		@function
		@example
	     /** @name foo*\/
	     // whatever
	 */
	function handleNamed(node, docs) {
		var commentSrc,
			doc,
			retVal = false;
			
		if (node.type == Token.SCRIPT && node.comments) { 			
			for each (var comment in node.comments.toArray()) {
				if (comment.commentType == Token.CommentType.JSDOC) {
	
					commentSrc = '' + comment.toSource();
					
					if (commentSrc) {
						doc = new Doc(commentSrc);
						if ( doc.hasTag('name') ) {
							doc.addMeta(comment, doc);
							docs.push(doc);
							retVal = true;
						}
					}
				}
			}
		}
		return retVal;
	}
	,
	
	/**
		Handle documented function with no @name tag.
		@private
		@function
		@example
	     /** blah. *\/
	     function foo() {
	     }
	 */
	function handleFunctionDec(node, docs) {
		var commentSrc,
			doc,
			name,
			retVal = false;
		
		if (node.type == Token.FUNCTION) {
			if (commentSrc = node.jsDoc) {
				doc = new Doc(commentSrc);
	
				if ( !doc.hasTag('name') ) {
					name = docName.resolveThis(node.name, node, doc.getTag('memberof'));
					doc.setName(name);
					doc.addMeta(node);
					docs.push(doc);
					retVal = true;
				}
			}
		}
		return retVal;
	}
	,
	
	/**
		Handle documented bare name, on left side of an anonymous function, with no @name tag
		@private
		@function
		@example
	     /** blah. *\/
	     foo = function() {
	     }
	 */
	function handleFunctionAssign(node, docs) {
		var commentSrc,
			doc,
			name,
			retVal = false;
		
		if (node.type === Token.ASSIGN) {
			if (node.right.type === Token.FUNCTION) {
				if (commentSrc = node.jsDoc) {
					doc = new Doc(commentSrc);
	
					if ( !doc.hasTag('name') ) {
						name = docName.resolveThis(nodeToString(node.left), node, doc.getTag('memberof'));
						docName.anons.push([node.right, name]);
						doc.setName(name, doc);
						doc.addMeta(node, doc);
						docs.push(doc);
						retVal = true;
					}
				}
			}
		}
		return retVal;
	}
	,
	
	/**
		Handle documented var declaration(s), on left side of an anonymous function(s), with no @name tag
		@private
		@function
		@example
	     /** blah. *\/
	     var foo = function() {
	         },
	         /** blah. *\/
	         bar = function() {
	         }
	 */
	function handleVarDec(node, docs) {
		var commentSrc,
			doc,
			name,
			retVal = false;
		
		if (node.type == Token.VAR || node.type == Token.LET) {
			var counter = 0;
			for each (var n in ScriptableList(node.variables)) {
				if (n.target.type === Token.NAME && n.initializer && n.initializer.type === Token.FUNCTION) {
					commentSrc = (counter++ === 0 && !n.jsDoc)? node.jsDoc : n.jsDoc;
					if (commentSrc) {
						doc = new Doc(commentSrc);
						
						if ( !doc.hasTag('name') ) {
							name = docName.resolveThis(n.target.string, n.target, doc.getTag('memberof'));
							docName.anons.push([n.initializer, name]);
							doc.setName(name, doc);
							doc.addMeta((node.jsDoc? node : n), doc);
							docs.push(doc);
							retVal = true;
						}
					}
				}
			}
		}

		return retVal;
	}
];


/**
	Represents a JsDoc comment in the source code.
	@param {string} commentSrc
 */

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