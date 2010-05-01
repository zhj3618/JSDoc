/*
 * An implementation of the CommonJS Modules 1.0
 * This version allows modules to be pre-loaded into the 
 * require._module_functions object which maps from module filename to
 * module function.  This version also defines require._print and
 * require._minimize hooks for generating output in the form of
 * pre-loaded modules. See display_requirements.js.
 *
 * Copyright (c) 2009 by David Flanagan
 */
var require = function require(id) {
    var origid = id, filename;

    // If the module id is relative, convert it to a toplevel id
    // The normalize function is below.
    if (id.substring(0,2) == "./" || id.substring(0,3) == "../")
        id = normalize(require._current_module_dir, id);

    // Now resolve the toplevel id relative to require.dir
    filename = require.dir + id + ".js";

    // Only load the module if it is not already cached.
    if (!require._cache.hasOwnProperty(filename)) {

        // Remember the directory we're loading this module from
        var olddir = require._current_module_dir;
        require._current_module_dir = id.substring(0, id.lastIndexOf('/')+1);
        
        try {
            var f; // The function that defines the module
            if (require._module_functions.hasOwnProperty(filename))
                f = require._module_functions[filename];  // Pre-defined
            else {   // Otherwise load and compile the function
                // Load the text of the module          
                var modtext = gettext(filename);
                // Wrap it in a function
                f = new Function("require", "exports", "module", modtext);

                // Output text (optionally minimized) of the module just loaded
                if (require._print) {
                    var code = modtext;
                    if (require._minimize) code = require._minimize(code);
                    require._print("require._module_functions['" + filename +
                                  "']=function(require,exports,module){" +
                                   code + "};");
                }
            }
            // Prepare function arguments
            var context = {};                            // Invoke on empty obj
            var exports = require._cache[filename] = {}; // API goes here
            var module = { id: id, uri: filename };      // For Modules 1.1
            f.call(context, require, exports, module);   // Execute the module
        }
        catch(e) {
			if(e.rhinoException != null) {
				print("Can't load module '" + origid + "'");
				e.rhinoException.printStackTrace();
			}
			else if(e.javaException != null) {
				print("Can't load module '" + origid + "'");
				e. javaException.printStackTrace();
			}
			else throw new Error("Can't load module '" + origid + "' - " + x);
        }
        finally { // Restore the directory we saved above
            require._current_module_dir = olddir;
        }
    }
    return require._cache[filename];  // Return the module API from the cache

    /* Return the text of the specified url, script element or file */
    function gettext(url) {
        if (typeof XMLHttpRequest !== "undefined") { // Running in a browser
            var req = new XMLHttpRequest();
            req.open("GET", url, false);             // Note synchronous get
            req.send(null);
            if (req.status && req.status != 200) throw req.statusText;
            return req.responseText;
        }
        else if (typeof readFile == "function") return readFile(url); // Rhino
        else if (typeof readUrl == "function") return readUrl("file:" + url);
        else if (typeof snarf == "function") return snarf(url); // Tracemonkey
        else if (typeof read == "function") return read(url);   // V8
        
        else throw "No mechanism to load module text";
    }

    function normalize(dir, file) {
        for(;;) {
            if (file.substring(0,2) == "./")
                file = file.substring(2);
            else if (file.substring(0,3) == "../") {
                file = file.substring(3);
                dir = up(dir);
            }
            else break;
        }
        return dir+file;
        
        function up(dir) { // Return the parent directory of dir
            if (dir == "") throw "Can't go up from ''";
            if (dir.charAt(dir.length-1) != "/") throw "dir doesn't end in /";
            return dir.substring(0, dir.lastIndexOf('/', dir.length-2)+1);
        }
    }


};

// Set require.dir to point to the directory from which modules should be
// loaded.  It must be an empty string or a string that ends with "/".
require.dir = "";

// For relative module names
require._current_module_dir = "";  

// This object holds the exports object of named modules
require._cache = {};

// This object maps module names to module functions.
// If fields of this object are initialized before require() is called,
// then require() will just use these functions without having to load
// any code.
require._module_functions = {};

// If you set this property to an output function, require() will output
// a string of text each time it loads a module.  This string of text
// will initialize a property of require._module_functions.  If you collect
// all this output into a single file, you can use it as a script to
// preload the static dependencies of your program.
require._print = null;

// If you set this to a function, when you set require._print, the function
// will be used as a code minimizer
require._minimize = null;

