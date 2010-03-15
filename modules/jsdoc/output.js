export('outputDocs');

include('ringo/file');
include('jsdoc/common');
include('ringo/engine'); // for addRepository
addRepository('apps/jsdoc-toolkit/templates/');

/**
	@name outputDocs
	@function
	@param {string} template Name of template folder.
	@param {SymbolSet} symbolSet Symbols to document.
	@param {string} destination Path to the folder to contain the output.
 */
function outputDocs(template, symbolSet, destination) {
	if (template === 'JSON') {
		print(symbolSet.toJSON());
		quit();
	}
	else {
		publish(template, symbolSet, destination);
	}
}

function publish(template, symbolSet, destination) {
	destination = new File(destination);
	
	if (!destination.exists() && !destination.makeDirectory()) {
		die( 'Could not create that destination directory: ' + destination.getAbsolutePath() );
	}
	
	if (!destination.isDirectory()) {
		die( 'Could not write to that destination directory: ' + destination.getAbsolutePath() );
	}

	require(template + '/publish').publish(symbolSet, destination);
}