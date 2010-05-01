/**
	@overview A documentation tool for JavaScript.
	@author Michael Mathews <micmath@gmail.com>
	@license Apache License 2.0 - See file 'LICENSE.markdown' in this project.
 */

/**
	@namespace jsdoc
 */
var jsdoc = (typeof exports === 'undefined')? {} : exports; // like commonjs

(function() {
	var opts = opts || require('jsdoc/opts'),
		src =   src || require('jsdoc/src'),
		parse = parse || require('jsdoc/parse');
	
	opts.set(global().arguments.slice(1)); // first argument is a the path to main.js
	
	/**
		The command line options passed in to this app.
		@name jsdoc.opts
		@type Object
	 */
	jsdoc.opts = opts.get();
	
	/**
		Get the help text for the command line options.
		@name jsdoc.help
		@type Function
	 */
	jsdoc.help = function() { return opts.help(); }
	
	jsdoc.src = src.getFilePaths(jsdoc.opts._);
	jsdoc.docSet = parse.docSet;
	
	jsdoc.parse = function(filepaths) {
		var docset = [];
		filepaths.forEach(function(filepath) {
			parse.getDocs(filepath, docset);
		});
		return docset;
	}
	
})();