/**
	@overview Get or set options for this app.
	@author Michael Mathews <micmath@gmail.com>
	@license Apache License 2.0 - See file 'LICENSE.markdown' in this project.
 */

/**
	@namespace opts
 */
var opts = (typeof exports === 'undefined')? {} : exports; // like commonjs

(function() {
	var args = args || require('common/args');
	
	var argsParser  = new args.Parser(),
		ourOptions,
		defaults = {
			template: 'default',
			destination: 'out.html'
		};
	
	argsParser.addOption('t', 'template',    true,  'The name of the template to use.');
	argsParser.addOption('T', 'test',        false, 'Run unit tests.');
	argsParser.addOption('d', 'destination', true,  'The path to output folder.');
	argsParser.addOption('h', 'help',        false, 'Print help message and quit.');
	
	/**
		Set the options for this app.
		@name opts.set
		@function
		@throws {Error} Illegal arguments will throw errors.
		@param {String[]} args The command line arguments for this app.
	 */
	opts.set = function(args) {
		ourOptions = argsParser.parse(args, defaults);
	}
	
	opts.help = function() { return argsParser.help(); }
	
	/**
		Get a single option or all the options for this app.
		@name opts.get
		@function
		@param {String} [name] The name of the option.
		@return {String|Object} Either the value associated with the given name,
		or a collection of key/values representing all the options.
	 */
	opts.get = function(name) {
		if (typeof name === 'undefined') {
			return ourOptions;
		}
		else {
			return ourOptions[name];
		}
	}
})();