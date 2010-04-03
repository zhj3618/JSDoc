export('nodeHandlers');

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

var nodeHandlers = [

	/**
		Handle a jsdoc comment with a @name tag.
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
			
/*debug*///print('nodeToString is '+nodeToString(node));

					

//		if (node.type == Token.OBJECTLIT) {
/*debug*///print('>> objectlit');
//for (var p in node) { try{
//	print(">>    "+p+": "+(typeof node[p] === 'function'? 'function' : node[p]) );
//} catch(e){}
//}
//			if (commentSrc = node.getLastSibling()) {
/*debug*///print('>> objectlit getLastSibling is '+nodeToString(commentSrc));			
//			}
//		}
		
		if (node.type == Token.COLON) {
/*debug*///print('>> nodeToString is '+nodeToString(node));	
/*debug*///print('>> node.getLeft is '+nodeToString(node.getLeft()));
/*debug*///print('>> node.getRight is '+nodeToString(node.getRight()));
			//if (nodeToString(node.getRight()) === 'FUNCTION') {
				var left = node.getLeft();
				var name = nodeToString(left);
				if (commentSrc = left.jsDoc) {
					doc = new Doc(commentSrc);
					if ( !doc.hasTag('name') ) {
						var memberof = doc.getTag('memberof');
						
						doc.addIsa(node.getRight().type);
						
						name = docName.resolveThis(name, left, memberof);
						doc.setName(name);
						doc.addMeta(node);
						docs.push(doc);
						retVal = true;
					}
				}
				
/*debug*///print('>> name is '+name);
/*debug*///print('>> node.getLeft() jsdoc is '+node.getLeft().jsDoc);
/*debug*///print('>> enclosingScope is '+nodeToString(node.enclosingScope));
			//}
		}
		else
		if (node.type == Token.SCRIPT && node.comments) { 			
			for each (var comment in node.comments.toArray()) {
				if (comment.commentType == Token.CommentType.JSDOC) {
	
					commentSrc = '' + comment.toSource();
					
					if (commentSrc) {
						doc = new Doc(commentSrc);
						if ( doc.hasTag('name') && !doc.hasTag('ignore')) {
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
		Handle documented function declaration with no @name tag.
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
					doc.addIsa(node.type);

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
		Handle documented bare name, on left side of an anonymous function lit, with no @name tag
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
						doc.addIsa(node.right.type);
						
						name = docName.resolveThis(nodeToString(node.left), node, doc.getTag('memberof'));
						/*debug*///print(">>> "+name);
						
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
		Handle documented bare name, on left side of an anonymous function constructor, with no @name tag
		@private
		@function
		@example
	     /** blah. *\/
	     foo = new function() {
	     }
	 */
	function handleFunctionConstructor(node, docs) {
		var commentSrc,
			doc,
			name,
			retVal = false;
		
		if (node.type === Token.ASSIGN) {
			if (node.right.type === Token.NEW && node.right.getTarget().type === Token.FUNCTION) {
				if (commentSrc = node.jsDoc) {
					doc = new Doc(commentSrc);
					if ( !doc.hasTag('name') ) {
						doc.addIsa(node.right.getTarget().type);
						name = docName.resolveThis(nodeToString(node.left), node, doc.getTag('memberof'));
				
						docName.anons.push([node.right.getTarget(), name]);
						
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
	function handleVarFunctionAssign(node, docs) {
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
							doc.addIsa(n.initializer.type);
							
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