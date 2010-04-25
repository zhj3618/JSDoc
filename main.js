const HOME = arguments[0].match(/^(.+[\\\/])/)[0]; // base dir for main.js

load(HOME + '/lib/require2.js'), require.dir = HOME + '/modules/';

var jsdoc  = require('jsdoc-toolkit'),
	jsDump = require("narwhal-test/jsdump").jsDump;

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

var encrypt = require('common/encrypt');

jsdoc.parse(jsdoc.src);
var data = { docs: jsdoc.docSet };
//print(jsDump.parse(data)); quit();

// {
// 	docs: [
// 		{
// 			name: 'Shape',
// 			uid: encrypt.sha1Hash('Shape').substr(0, 7),
// 			kind: 'constructor',
// 			members: [
// 				'Shape#position',
// 				'Shape#sides'
// 			]
// 		},
// 		{
// 			name: 'Shape#position',
// 			uid: encrypt.sha1Hash('Shape#position').substr(0, 7),
// 			memberof: 'Shape',
// 			membership: 'instance',
// 			kind: 'method',
// 			desc: 'Set or get the position of this shape.',
// 			overloads: [
// 				{
// 					signature: 'Shape#position()',
// 					uid: encrypt.sha1Hash('Shape#position()').substr(0, 7),
// 					desc: 'Get the position of this shape.',
// 					returns: {
// 						type: '{top: number, left: number}',
// 						desc: 'The position of the shape.'
// 					}
// 				},
// 				{
// 					signature: 'Shape#position(top,left)',
// 					uid: encrypt.sha1Hash('Shape#position(top,left)').substr(0, 7),
// 					desc: 'Set the position of this shape.',
// 					params: [
// 						{
// 							type: 'number',
// 							name: 'top',
// 							desc: 'The top position of the shape.'
// 						},
// 						{
// 							type: 'number',
// 							name: 'left',
// 							desc: 'The left position of the shape.'
// 						}
// 					]
// 				}
// 			]
// 		},
// 		{
// 			name: 'Shape#sides',
// 			uid: encrypt.sha1Hash('Shape#sides').substr(0, 7),
// 			memberof: 'Shape',
// 			membership: 'instance',
// 			kind: 'property',
// 			type: 'number',
// 			desc: 'How many sides does the shape have.'
// 		}
// 	]
// }


var publisher = require('jsdoc-toolkit/templates/' + jsdoc.opts.template);

publisher.publish(data, jsdoc.opts);
