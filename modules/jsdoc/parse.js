export('parseDocs');

include('ringo/jsdoc');
include('jsdoc/common');
include('jsdoc/parseSteps');

include('ringo/fileutils');
include('ringo/parser');

/**
	Scan source file for documented docs.
	@function parseDocs
	@param root
	@param src
 */
function parseDocs(root, src) {
	var repo,
		script,
		docs,
		docSet;
	
	if (arguments.length === 1) {
		var parts = root.split(separator);
		src = parts.pop();
		root = parts.join(separator);
	}

	repo = new ScriptRepository(root);
	script = repo.getScriptResource(src);
	
	docs = walk(script); // an array of {Doc} objects.
	
	docSet = new DocSet(docs);
	return docSet;
}



/**
	Called automatically by {@link walk}.
	@private
	@function walker
	@param {org.mozilla.javascript.ast.AstNode} node
 */
function walker(node) {
	for (var i = 0, leni = nodeHandlers.length; i < leni; i++) {
		if ( nodeHandlers[i](node, walker.docs) ) {
			break;
		}
	}

	return true;
}

/**
	Walk script nodes in a script resource, collect tag data.
	@private
	@function walk
	@param {org.ringojs.repository.Resource} resource Source file to scan.
	@return {TagSet}
 */
function walk(resource) {
	walker.docs = []; // accumulates docs while walker recurses through the code tree
	
	// see http://ringojs.org/api/ringo/parser
	visitScriptResource(resource, walker);

	return walker.docs;
};


/**
	A collection of symbols. This is what the template will get.
	@constructor DocSet
	@param {Array<Symbol>}
 */
function DocSet(docs) {
	this.docs = docs;
}

DocSet.prototype.addDoc = function(doc) {
	this.docs.push(doc);
}

/**
	Convert this DocSet to a JSON string.
	@name DocSet#toJSON
	@return {string}
 */
DocSet.prototype.toJSON = function() {
	var doc,
		json = [];
	
	for (var i = 0, leni = this.docs.length; i < leni; i++) {
		doc = this.docs[i];
		json.push({
			shortname: doc.shortname,
			name: doc.name,
			description: doc.description,
			memberof: doc.memberof,
			isa: doc.isa
		});
	}
	
	return JSON.stringify(json);
}

/**
	Returns the first doc with the given name.
	@private
	@function DocSet#getDocByName
	@return {Doc|null}
 */
DocSet.prototype.getDocByName = function(name) {
	var doc;
	
	for (var i = 0, leni = this.docs.length; i < leni; i++) {
		doc = this.docs[i];
		if (name === doc.name) {
			return doc; // first one wins
		}
	}
	
	return null;
}


