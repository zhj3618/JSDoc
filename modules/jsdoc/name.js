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

})();