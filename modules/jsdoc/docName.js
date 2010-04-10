/**
	@fileOverview
	@desc Functionality related to parsing the names of symbols.

 */

export('docName', 'docName.fromSource', 'docName.derive', 'docName.resolveThis');

include('jsdoc/common');

/**
	Combine parts up into name.
 */
function connect(name, member, opts) {
	if (member.endsWith('#')) {
		opts.isstatic = false;
		return member + name;
	}
	
	if (opts.isinner) {
		return member + '-' + name;
	}
	else {
		opts.isstatic = true;
		return member + '.' + name;
	}
};

/**
	Split name up into parts.
 */
function divide(name, opts) {
	var parts = {
		member: '',
		name: name,
		shortname: name
	};
	
	if (
		/^(?:(.+)([#.-]))?("(\"|[^"])+")$/.test(name) // like one#"two#three"
		||
		/^(.+)([#.-])([^#.-]+)$/.test(name) // like one#two
	) {

		parts.connector = RegExp.$2;
		parts.member  = RegExp.$1;
		parts.shortname = RegExp.$3 || name;
		
		parts.name = name;
		parts.member += (parts.connector === '#'? '#' : '');
		
		if (parts.connector === '-') { opts.isinner = true; }
		if (parts.connector === '.') { opts.isstatic = true; }
	}
	
	return parts;
}

/**
	Determine what the various name related values are from the tags present.
 */
function docName(name, member, props) { /*debug*///print('docName('+name+', '+member+', '+props+')');
	if (!name) {
		throw new Error('Missing required value for @name.');
	}
	
	props = props || {};
	
	var result = {
		name: '',
		member: '',
		shortname: ''
	};
	
	if (member) {
		// fix prototype
		member = member.replace(/\.prototype(\.|$)/g, '#');
		
		// fix this
		if (name.indexOf('this.') === 0) {
			name = name.replace('this.', '');
		}
		
		result.member = member;
		result.shortname = name;
		result.name = connect(result.shortname, result.member, props);
	}
	else {
		var parts = divide(name, props);
		
		result.member = parts.member;
		result.shortname = parts.shortname;
		result.name = parts.name;
	}

	result.isinner = props.isinner || false;
	result.isstatic = props.isstatic || false;
	
	return result;
}

/**
	The name was found in the source code, may need some clean up, then add new tag to doc.
	@param {string} sourceName
	@return {string}
 */
docName.fromSource = function(sourceName) {
	var name = sourceName.replace(/\.prototype\.?/g, '#');
 	
 	if (name.indexOf('[') > -1) { // stringy name, like foo["bar"] or foo['bar']
 		name = name
			.replace(/(["'])\]\[\1/g, '"."')
			.replace(/["']\]\./g, '".')
			.replace(/\.\[["']/g, '."')
			.replace(/["']\]#/g, '"#')
			.replace(/#\[["']/g, '#"')
			.replace(/\[["']/g, '."')
			.replace(/["']\](.*)/g, "\"$1")
		;
	}
	
	return name;
}

/**
	Sets various properties related to the doc name on the doc object,
	considering the other tags and properties present.
	@function docName.derive
	@param {Doc} doc
 */
docName.derive = function(doc) {
	var nameTag     = doc.name     || doc.getTag('name'),
		memberTag   = doc.member   || doc.getTag('member'),
		isinnerTag  = doc.isinner  || doc.hasTag('inner'),
		isstaticTag = doc.isstatic || doc.hasTag('static'),
		name;
	name = docName(nameTag, memberTag, {isstatic: isstaticTag, isinner: isinnerTag});
	
	doc.name      = name.name;
	doc.shortname = name.shortname;
	doc.member    = name.member;
	doc.isstatic  = name.isstatic;
	doc.isinner   = name.isinner;
}

/**
	What does `this` mean in the doc name?
	@private
	@function
	@param {string} name Possibly starting with `this.`
	@param {org.mozilla.javascript.ast.AstNode} node The node in question.
	@param {string} [member] If the user provided a @member tag, we can use it.
	
	@return {string} The resolved namepath.
 */
docName.resolveThis = function(name, node, member) {
	var enclosingFunction;
	
	if (name.indexOf('this.') === 0) {
		if (!member) {
			if (enclosingFunction = node.getEnclosingFunction()) {
				member = enclosingFunction.getName(); // empty string for anonymous functions
			}
			
			if (member) {
				name = member + '#' + name.slice(5); // replace this. with foo#
			}
			else { // it's an anonymous function
				member = docName.nameFromAnon(enclosingFunction);
				
				if (member) {
					name = member + '#' + name.slice(5); // replace `this.` with member
				}
			}
		}
		else {
			name = name.slice(5);
		}
	}
	return name;
}

/**
	Keep track of anonymous functions that have been assigned to documented symbols.
	@private
	@function nameFromAnon
	@param {org.mozilla.javascript.ast.AstNode} node
	@return {string|null} The documented name, if any.
 */
docName.nameFromAnon = function(node) {
	var i = docName.anons.length;
	while (i--) {
		if (docName.anons[i][0] === node) {
			return docName.anons[i][1];
		}
	}
	
	return null;
}
// tuples, like [ [noderef, jsdocName], [noderef, jsdocName] ]
docName.anons = [];