// USAGE:
// Parse js/src.js for JSON doc comments, output as JSON to default folder: out
//     $ bin/ringo apps/jsdoc-toolkit/main.js js/src.js
// Set output format explicitlty to JSON
//     $ bin/ringo apps/jsdoc-toolkit/main.js -t JSON js/src.js
// Output to a different destination
//     $ bin/ringo apps/jsdoc-toolkit/main.js -d mydocs js/src.js
// Run unit tests and quit
//     $ bin/ringo apps/jsdoc-toolkit/main.js -T

include('ringo/engine'); // for addRepository
include('ringo/shell');
include('ringo/file');

addRepository('apps/jsdoc-toolkit/modules/');
include('jsdoc/common');
include('jsdoc/parse');
include('jsdoc/publish');

function getArgs(argv) {
	var	args = {},
		parser = new (require('ringo/args').Parser),
		defaults = {
			destination: 'out/',
			template: 'JSON'
		};
	
	args.main = argv[0]; // path to this script, main.js
	argv = Array.slice(argv, 1);
	
	parser.addOption('t', 'template', 'TEMPLATE', 'The path to the template folder.');
	parser.addOption('T', 'test', null, 'Run unit tests.');
	parser.addOption('d', 'destination', 'DESTINATION', 'The path to output folder.');
	parser.addOption('h', 'help', null, 'Print help message and exit');
	
	// parser removes options from argv
	args.options = parser.parse(argv, defaults);
	
	// what's left is the source file. TODO: support file glob
	args.options.src = argv[0];
	
	return args;
}

function usage() {
    print('Usage:');
    print('', cmd, '[OPTIONS]', '[PATH]');
    print('Options:');
    print(parser.help());
    quit();
}

var options = getArgs(arguments).options;

if (options.help) { usage(); }

if (options.test) {
	addRepository('apps/jsdoc-toolkit/');
	include('test/jsdoc/all');
	quit();
}

if (!options.src) {
	die('Missing required value for code source to parse.');
}

if (!options.destination) {
	die('Missing value for required option "destination".');
}
else {
	options.destination = new File(options.destination);
}

if (!options.template || options.template === 'JSON') {
	template = options.template;
}
else {
	var templateFile = new File(options.template),
		templateSrc,
		template;
		
	try {
		templateSrc = templateFile.readAll();
	}
	catch(e) {
		die( 'Could not find or read template file at that location: ' + templateFile.getAbsolutePath() );
	}
	
	template = require('normal/normal-template').compile(templateSrc);
}

var symbolSet = parse(options.src);
render(template, symbolSet, options.destination);
