/**
	@overview Testing the jsdoc-toolkit/opts module.
	@author Michael Mathews <micmath@gmail.com>
	@license Apache License 2.0 - See file 'LICENSE.markdown' in this project.
 */
var test = require('jsdoc-toolkit/test');
var opts = require('jsdoc-toolkit/opts');

exports.testOptsOptionT = function() {
	var app = {}; // dummy
	
	test.expect(3);
	
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
}
