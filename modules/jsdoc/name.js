/**
	@overview Calculate a symbol's name and its parts.
	@author Michael Mathews <micmath@gmail.com>
	@license Apache License 2.0 - See file 'LICENSE.markdown' in this project.
 */

/**
	Functionality relating to symbol name manipulation.
	@module jsdoc/name
	@requires jsdoc/tag
	@exports jsdoc.name
 */
var jsdoc = jsdoc || {};
jsdoc.name = (typeof exports === 'undefined')? {} : exports; // like commonjs
jsdoc.tag = require('jsdoc/tag');

(function() {
	/**
		@method jsdoc.name.resolve
		@param {Doclet} doclet
	 */
	jsdoc.name.resolve = function(doclet) {
		var name = doclet.tagText('name'),
			memberof = doclet.tagText('memberof'),
			longname = name,
			shortname = name,
			prefix;
		
		if (memberof) {
			if (name.indexOf(memberof) === 0) {
				longname = name;
				[prefix, shortname] = jsdoc.name.shorten(name);
				doclet.tagText('name', shortname);
			}
		}
		else {
			[prefix, shortname] = jsdoc.name.shorten(name);
			doclet.tagText('memberof', prefix);
			doclet.tagText('name', shortname);
		}
		
		// overlapping member of, like @name foo.Bar, @memberof foo
		if (memberof && name.indexOf(memberof) !== 0) {
			longname = memberof + (/#$/.test(memberof)? '' : '.') + name;
		}

		doclet.tags.push( jsdoc.tag.fromTagText('longname ' + longname) );
	}
	
	jsdoc.name.shorten = function(longname) {
		var shortname = longname.split(/([#.])/).pop(),
			splitOn = RegExp.$1,
			splitAt = longname.lastIndexOf(splitOn),
			prefix = (splitAt === -1)? '' : longname.slice(0, splitAt);
		
		if (splitOn === '#') { prefix = prefix + splitOn; }
		return [prefix, shortname];
	}
	
	jsdoc.name.resolveThis = function(name, node, memberof) {
		var enclosingFunction;
	
		if (name.indexOf('this.') === 0) {
			if (!memberof || memberof === 'this') {
				if (enclosingFunction = node.getEnclosingFunction()) {
					memberof = ''+enclosingFunction.getName(); // empty string for anonymous functions
				}
	
				if (memberof) {
					name = memberof + '#' + name.slice(5); // replace this. with foo#
				}
				else { // it's an anonymous function
					memberof = ''+jsdoc.name.nameFromAnon(enclosingFunction);
					
					if (!memberof) {
						memberof = 'anonymous';
					}

					if (memberof) {
						name = memberof + '#' + name.slice(5); // replace `this.` with memberof
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
		@method jsdoc.name.nameFromAnon
		@param {org.mozilla.javascript.ast.AstNode} node
		@return {string|null} The documented name, if any.
	 */
	jsdoc.name.nameFromAnon = function(node) {
		var i = jsdoc.name.anons.length;
		while (i--) {
			if (jsdoc.name.anons[i][0] === node) {
				return jsdoc.name.anons[i][1];
			}
		}
	
		return null;
	}
	// tuples, like [ [noderef, jsdocName], [noderef, jsdocName] ]
	jsdoc.name.anons = [];
})();