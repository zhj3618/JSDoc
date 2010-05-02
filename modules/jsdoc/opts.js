/**
	@overview Get or set options for this app.
	@author Michael Mathews <micmath@gmail.com>
	@license Apache License 2.0 - See file 'LICENSE.markdown' in this project.
 */

/**
	@module jsdoc/opts
	@namespace jsdoc.opts
	@requires common/args
 */
var jsdoc = jsdoc || {};
jsdoc.opts = (typeof exports === 'undefined')? {} : exports; // like commonjs

(function() {
	var args = args || require('common/args');
	
	var argsParser  = new args.Parser(),
		ourOptions,
		defaults = {
			template: 'default',
			destination: 'jsdoc.xml'
		};
	
	argsParser.addOption('t', 'template',    true,  'The name of the template to use.');
	argsParser.addOption('T', 'test',        false, 'Run unit tests and quit.');
	argsParser.addOption('d', 'destination', true,  'The path to output folder.');
	argsParser.addOption('h', 'help',        false, 'Print help message and quit.');
	
	/**
		Set the options for this app.
		@method jsdoc.opts.set
		@throws {Error} Illegal arguments will throw errors.
		@param {String[]} args The command line arguments for this app.
	 */
	jsdoc.opts.set = function(args) {
		ourOptions = argsParser.parse(args, defaults);
	}
	
	/**
		Display help message for options.
		@method jsdoc.opts.help
	 */
	jsdoc.opts.help = function() { return argsParser.help(); }
	
	/**
		Get a single option or all the options for this app.
		@method jsdoc.opts.get
		@param {String} [name] The name of the option.
		@return {String|Object} Either the value associated with the given name,
		or a collection of key/values representing all the options.
	 */
	jsdoc.opts.get = function(name) {
		if (typeof name === 'undefined') {
			return ourOptions;
		}
		else {
			return ourOptions[name];
		}
	}
})();