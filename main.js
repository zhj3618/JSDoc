const HOME = arguments[0].match(/^(.+[\\\/])/)[0]; // base dir for main.js

load(HOME + '/lib/require2.js'), require.dir = HOME + '/modules/';

var jsdoc  = require('jsdoc');
	
if ( jsdoc.opts.help ) {
	print( jsdoc.help() );
	quit();
}
		
if (jsdoc.opts.test) {
	require('jsdoc/tests/all'); // or just one: require('jsdoc/test').run(require('jsdoc/tests/opts'));
	quit();
}

jsdoc.parse(jsdoc.src);

if (jsdoc.opts.validate) {
	var jsonSchema  = require('sitepen/jsonSchema').JSONSchema;
	var jsdocSchema = require('jsdoc/schema').jsdocSchema;
	var validation = jsonSchema.validate(jsdoc.docSet.toObject(), jsdocSchema);
	print('Validation: ' + validation.toSource());
}

if ( /xml$/i.test(jsdoc.opts.destination) ) {
	print( jsdoc.docSet.toXML() );
}
else { // default
	print( jsdoc.docSet.toJSON() );
}
quit();

//var publisher = require('jsdoc/templates/' + jsdoc.opts.template);

//publisher.publish(data, jsdoc.opts);
