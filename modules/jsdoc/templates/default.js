/**
	@overview The default template for JsDoc Toolkit.
	@author Michael Mathews <micmath@gmail.com>
	@license Apache License 2.0 - See file 'LICENSE.markdown' in this project.
 */

/**
	@namespace template
 */
var template = (typeof exports === 'undefined')? {} : exports; // like commonjs

(function() {
	var templateEngine = require('normal-template'),
		fs = require('common/fs');

	template.publish = function(data, opts) {
		var out = '';
		var templateSrc = fs.read(HOME + 'modules/jsdoc/templates/default/jsdoc.xml');
		var template = templateEngine.compile(templateSrc);
		
		out = template(data);
		
		fs.write(HOME + opts.destination, out);
	}
})();