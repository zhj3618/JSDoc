const HOME = arguments[0].match(/^(.+[\\\/])/)[0]; // base dir for main.js

load(HOME + '/lib/require2.js'), require.dir = HOME + '/modules/';

var jsdoc  = require('jsdoc'),
	jsDump = require("narwhal-test/jsdump").jsDump;

if ( jsdoc.opts.help ) {
	print( jsdoc.help() );
	quit();
}
		
// run unit tests?
if (jsdoc.opts.test) {
	require('jsdoc/tests/all');
	// just one?
	// require('jsdoc/test').run(require('jsdoc/tests/opts'));
	quit();
}

jsdoc.parse(jsdoc.src);
var data = { docs: jsdoc.docSet };

var publisher = require('jsdoc/templates/' + jsdoc.opts.template);

publisher.publish(data, jsdoc.opts);
