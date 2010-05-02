const HOME = arguments[0].match(/^(.+[\\\/])/)[0]; // base dir for main.js

load(HOME + '/lib/require2.js'), require.dir = HOME + '/modules/';


var jsdoc  = require('jsdoc');
	
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



if ( /xml$/i.test(jsdoc.opts.destination) ) {
	print( jsdoc.docSet.toXML() );
}
else { // default
	print( jsdoc.docSet.toJSON() );
}
quit();

//var publisher = require('jsdoc/templates/' + jsdoc.opts.template);

//publisher.publish(data, jsdoc.opts);
