const HOME = arguments[0].match(/^(.+[\\\/])/)[0]; // base dir for main.js

load(HOME + '/lib/require2.js'), require.dir = HOME + '/modules/';

var jsdoc  = require('jsdoc-toolkit');

if ( jsdoc.opts.help ) {
	print( jsdoc.help() );
	quit();
}
		
// run unit tests?
if (jsdoc.opts.test) {
	require('jsdoc-toolkit/tests/all');
	// just one?
	// require('jsdoc-toolkit/test').run(require('jsdoc-toolkit/tests/opts'));
	quit();
}

var publisher = require('jsdoc-toolkit/templates/' + jsdoc.opts.template);

var data = {
    name: "George",
    profile: {
        age: 34,
        gender: "M"
    },
    articles: [
        { title: "Hello world", count: 34 },
        { title: "Another article", count: 23 },
        { title: "The final", count: 7 }
    ],
    admin: true
};

print( publisher.publish(data, jsdoc.opts) );
