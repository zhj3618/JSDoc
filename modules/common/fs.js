/**
	@overview File system stuff.
	@author Michael Mathews <micmath@gmail.com>
	@license Apache License 2.0 - See file 'LICENSE.markdown' in this project.
 */

/**
	@namespace fs
 */
var fs = (typeof exports === 'undefined')? {} : exports; // like commonjs

var defaultEncoding = 'utf-8';

(function() {
	fs.read = function(path, options) {
		var options = options || {},
			encoding = options.encoding || defaultEncoding;
		
		return readFile(path, encoding);
	}
	
	fs.write = function(path, content, options) {
		var options = options || {},
			encoding = options.encoding || defaultEncoding;
		
		var out = new Packages.java.io.PrintWriter(
			new Packages.java.io.OutputStreamWriter(
				new Packages.java.io.FileOutputStream(path),
				encoding
			)
		);
		
		out.write(content);
		out.flush();
		out.close();
	}

})();

