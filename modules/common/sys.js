/**
	@overview Information about system specific things.
	@author Michael Mathews <micmath@gmail.com>
	@license Apache License 2.0 - See file 'LICENSE.markdown' in this project.
 */

/**
	A collection of information about your system.
	@namespace sys
 */
var sys = (typeof exports === 'undefined')? {} : exports; // like commonjs

(function() {
	importClass(java.lang.System);
	
	sys.os = [
		new String(System.getProperty('os.arch')),
		new String(System.getProperty('os.name')),
		new String(System.getProperty('os.version'))
	].join(', ');
	
	/**
	 	Which way does your slash lean.
	 	@type string
	 */
	sys.slash = System.getProperty('file.separator') || '/';
	
	/**
	 	The path to the working directory where you ran java.
	 	@type string
	 */
	sys.userDir = new String( System.getProperty('user.dir') );
	
	/**
	 	Where is Java's home folder.
	 	@type string
	 */
	sys.javaHome = new String(System.getProperty('java.home'));
	
	// get absolute path to main.js
	// run.jar prepends an argument, with the path to here.
	if (typeof arguments[0] === 'undefined') {
		throw new Error('Use run.jar to invoke this script.');
	}
	else {
		// absolute path?
		if (arguments[0].charAt(0) == SYS.slash || arguments[0].charAt(1) === ':') {
			sys.cwd = fs.directory(arguments[0]);
		}
		else { // relative path?
			sys.cwd = fs.directory(sys.userDir + sys.slash + arguments[0]);
		}
		arguments.pop();
	}
})();





/**
 * @namespace A collection of information about your system.
 */
sys = {
	/**
	 * Information about your operating system: arch, name, version.
	 * @type string
	 */
	os: [
		new String(System.getProperty('os.arch')),
		new String(System.getProperty('os.name')),
		new String(System.getProperty('os.version'))
	].join(', '),
	
	/**
	 * Which way does your slash lean.
	 * @type string
	 */
	slash: System.getProperty('file.separator') || '/',
	
	/**
	 * The path to the working directory where you ran java.
	 * @type string
	 */
	userDir: new String(System.getProperty('user.dir')),
	
	/**
	 * Where is Java's home folder.
	 * @type string
	 */
	javaHome: new String(System.getProperty('java.home')),
	
	/**
	 * The absolute path to the directory containing this script.
	 * @type string
	 */
	pwd: undefined
};

// get absolute path to main.js
// run.jar prepends an argument, with the path to here.
if (typeof arguments[0] === 'undefined') {
	throw new Error('Use run.jar to invoke this script.');
}
else {
	if (RegExp.$1.charAt(0) == SYS.slash || RegExp.$1.charAt(1) == ":") { // absolute path to here
		SYS.pwd = new FilePath(RegExp.$1).toDir().toString();
	}
	else { // relative path to here
		SYS.pwd = new FilePath(SYS.userDir + SYS.slash + RegExp.$1).toDir().toString();
	}
	arguments.pop();
}
else {
	print("The run.js script requires you use jsrun.jar.");
	quit();
}