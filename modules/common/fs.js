/**
	@overview File system stuff.
	@author Michael Mathews <micmath@gmail.com>
	@license Apache License 2.0 - See file 'LICENSE.markdown' in this project.
 */

/**
	@namespace fs
 */
var fs = (typeof exports === 'undefined')? {} : exports; // like commonjs

(function() {
	var slash = java.lang.System.getProperty('file.separator') || '/',
		File = Packages.java.io.File,
		//sys = sys || require('common/sys'),
		defaultEncoding = 'utf-8';
	
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
	
	/**
	 * Check if a file exists.
	 * @param {string path The file to check.
	 * @returns {boolean}
	 */
	fs.exists = function(path) {
		file = new File(path);
	
		if (file.isDirectory()){
			return true;
		}
		if (!file.exists()){
			return false;
		}
		if (!file.canRead()){
			return false;
		}
		return true;
	}
	
	/**
	 * @type string[]
	 * @param dir The starting directory to look in.
	 * @param [recurse=1] How many levels deep to scan.
	 * @returns An array of all the paths to files in the given dir.
	 */
	fs.ls = function(/**string*/ dir, /**number*/ recurse, _allFiles, _path) {
		var files, file;
	
		if (_path === undefined) { // initially
			_allFiles = [];
			_path = [dir];
		}
		
		if (_path.length === 0) { return _allFiles; }
		if (recurse === undefined) { recurse = 1; }
		
		dir = new File(dir);
		if (!dir.directory) { return [String(dir)]; }
		files = dir.list();
		
		for (var f = 0, lenf = files.length; f < lenf; f++) {
			file = String(files[f]);
		
			if (file.match(/^\.[^\.\/\\]/)) { continue; } // skip dot files
	
			if ((new File(_path.join(slash) + slash + file)).list()) { // it's a directory
				_path.push(file);
				
				if (_path.length - 1 < recurse) {
					fs.ls(_path.join(slash), recurse, _allFiles, _path);
				}
				_path.pop();
			}
			else { // it's a file	
				_allFiles.push((_path.join(slash) + slash + file).replace(slash + slash, slash));
	
			}
		}
	
		return _allFiles;
	}

})();

