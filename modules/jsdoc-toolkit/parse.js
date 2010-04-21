importPackage(org.mozilla.javascript);

parseScript('/Users/michael/WorkArea/ccdoc/main.js', visitNode);

/**
 * @param {org.mozilla.javascript.ast.AstNode} node
 */
function visitNode(node) {
	if (node.type === Token.FUNCTION) {
		if (node.jsDoc) {
			print(node.jsDoc);
		}
		print('> function ' + node.name);
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