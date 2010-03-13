// USAGE: bin/ringo apps/jsdoc-toolkit/main.js -t path/to/template path/to/src

var defaults = {
	destination: './out/',
	src: './js/'
}

include('ringo/engine'); // for addRepository
include('ringo/shell');
include('ringo/file');

addRepository('apps/jsdoc-toolkit/modules/');
include('jsdoc/common');

function getArgs(argv, defaults) {
	var	args = {},
		parser = new (require('ringo/args').Parser);
	
	argv = Array.slice(argv);
	defaults = defaults || {};
		
	parser.addOption('t', 'template', 'TEMPLATE', 'The path to the template folder.');
	parser.addOption('d', 'destination', 'DESTINATION', 'The path to output folder.');
	parser.addOption('h', 'help', null, 'Print help message and exit');
	
	args.cmd = argv.shift(),
	args.options = parser.parse(argv, defaults);
	
	return args;
}

function usage() {
    print('Usage:');
    print('', cmd, '[OPTIONS]', '[PATH]');
    print('Options:');
    print(parser.help());
    quit();
}

var options = getArgs(arguments, defaults).options;

if (options.help) { usage(); }

if (! options.template) {
	die('Missing value for required option "template".');
}

if (!options.destination) {
	die('Missing value for required option "destination".');
}
else {
	options.destination = new File(options.destination);
}

var templateFile = new File(options.template),
	templateSrc,
	template;

if (! templateFile.exists() || ! templateFile.canRead()) {
	die( 'Could not find or read template file at that location: ' + templateFile.getAbsolutePath() );
}
else {
	templateSrc = templateFile.readAll();
}

var symbols = require('jsdoc/parse').parse(options.src);

template = require('normal/normal-template').compile(templateSrc);
require('jsdoc/publish').render(template, symbols, options.destination);
