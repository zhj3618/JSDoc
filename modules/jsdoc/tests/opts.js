/**
	@overview Testing the jsdoc/opts module.
	@author Michael Mathews <micmath@gmail.com>
	@license Apache License 2.0 - See file 'LICENSE.markdown' in this project.
 */
var test = require('jsdoc/test');
var opts = require('jsdoc/opts');

// the -h/--help option
exports.testOptsOptionH = function() {
	var app = {}; // dummy
	
	test.expect(4);
	
	opts.set(['-h']);
	app.opts = opts.get();
	
	test.assertEqual(
		true, app.opts.help, 'shortname -h sets "help" option to true'
	);
	
	opts.set(['--help']);
	app.opts = opts.get();
	
	test.assertEqual(
		true, app.opts.help, 'longname --help sets "help" option to true'
	);
	
	var helpText = opts.help()
	var firstLine = helpText.split("\n")[0]; // first line
	var hasHelpOpt = (helpText.indexOf('--help') !== -1);
	test.assertEqual(
		'OPTIONS:', firstLine, 'help() returns list of options'
	);
	test.assertEqual(
		true, hasHelpOpt, 'list of options mention --help option'
	);
}

// the -t option
exports.testOptsOptionT = function() {
	var app = {}; // dummy
	
	test.expect(4);
	
	app.opts = opts.get();
	
	test.assertEqual(
		'default', app.opts.template, 'no template option causes default value to be used'
	);
	
	test.throwsError(
		function() { app.opts.set(['-t']); },
		Error,
		'using the template option with no value throws an Error.'
	)
	
	opts.set(['-t', 'mytemplate']);
	app.opts = opts.get();
	
	test.assertEqual(
		'mytemplate', app.opts.template, 'shortname -t sets "template" option'
	);
	
	opts.set(['--template', 'mytemplate']);
	app.opts = opts.get();
	
	test.assertEqual(
		'mytemplate', app.opts.template, 'longname --test sets "template" option'
	);
}

// the unnamed options
exports.testOptsOptionUnnamed = function() {
	var app = {}; // dummy
	
	test.expect(4);
	
	var files = [];
	opts.set(files);
	app.opts = opts.get();
	
	test.assertEqual(
		Array, app.opts._.constructor, 'the _ option is an instance of Array'
	);
	
	test.assertEqual(
		files.length, app.opts._.length, 'unnamed options (length 0) sets the _ option'
	);
	
	files = ['.'];
	opts.set(files);
	app.opts = opts.get();
	
	test.assertEqual(
		files[0], app.opts._[0], 'unnamed options (length 1) sets the _ option'
	);
	
	files = ['../path/to/file/one.js', '/file/two.js', 'three.js'];
	opts.set(files);
	app.opts = opts.get();
	
	test.isSame(
		files, app.opts._, 'unnamed options (length many) sets the _ option'
	);
}

