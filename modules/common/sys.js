/**
	@overview Information about system specific things.
	@author Michael Mathews <micmath@gmail.com>
	@license Apache License 2.0 - See file 'LICENSE.markdown' in this project.
 */

/**
	Information about your system.
	@namespace sys
 */
var sys = (typeof exports === 'undefined')? {} : exports; // like commonjs

(function() {
	importClass(java.lang.System);
	
	/**
	 	What are we running on.
	 	@type string
	 */
	sys.os = [
		new String(System.getProperty('os.arch')),
		new String(System.getProperty('os.name')),
		new String(System.getProperty('os.version'))
	].join(', '); // like "x86_64, Mac OS X, 10.6.3"
	
	/**
	 	Which way does your slash lean.
	 	@type string
	 */
	sys.slash = System.getProperty('file.separator') || '/';
	
	/**
	 	The path to the working directory where you ran java.
	 	@type string
	 */
	sys.pwd = new String( System.getProperty('user.dir') );
	// or? sys.pwd = new String(System.getenv('PWD'));
	
})();
