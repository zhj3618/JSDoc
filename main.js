const HOME = arguments[0].match(/^(.+[\\\/])/)[0]; // base dir for main.js

load(HOME + '/lib/require2.js'), require.dir = HOME + '/modules/';


var jsdoc  = require('jsdoc'),
	jsDump = require("flesler/jsdump").jsDump;
	
if ( jsdoc.opts.help ) {
	print( jsdoc.help() );
	quit();
}
		
if (jsdoc.opts.test) {
	require('jsdoc/tests/all');
	// just one: require('jsdoc/test').run(require('jsdoc/tests/opts'));
	quit();
}

jsdoc.parse(jsdoc.src);
var data = { doc: jsdoc.docSet };

var json = jsDump.parse(data);

if ( /xml$/i.test(jsdoc.opts.destination) ) {
	var xml = require('goessner/json2xml').convert( {jsdoc:data} );
	print( xml );
}
else { // default
	print( json );
}
quit();

//var publisher = require('jsdoc/templates/' + jsdoc.opts.template);

//publisher.publish(data, jsdoc.opts);
