/**
	@overview Get options for this app.
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
		options,
		defaults = {
			template: 'default',
			destination: 'out.html'
		};
	
	argsParser.addOption('t', 'template',    true,  'The name of the template to use.');
	argsParser.addOption('T', 'test',        false, 'Run unit tests.');
	argsParser.addOption('d', 'destination', true,  'The path to output folder.');
	argsParser.addOption('h', 'help',        false, 'Print help message and quit.');
	
	opts.set = function(args) {
		// the first global argument is the path to main.js
		options = argsParser.parse(args, defaults);
		
		if ( opts.get('help') ) {
			print( argsParser.help() );
			quit();
		}
	}
	
	opts.get = function(name) {
		if (typeof name === 'undefined') {
			return options;
		}
		else {
			return options[name];
		}
	}
})();