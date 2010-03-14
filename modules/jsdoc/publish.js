export('render');

include('ringo/file');
include('jsdoc/common');

function render(template, symbolSet, destination) {
	var output,
		outputFile,
		ext;
		
	if (!destination.exists() && !destination.makeDirectory()) {
		die( 'Could not create that destination directory: ' + destination.getAbsolutePath() );
	}
	
	if (!destination.isDirectory()) {
		die( 'Could not write to that destination directory: ' + destination.getAbsolutePath() );
	}

	if (typeof template === 'string' && template === 'JSON') {
		output = symbolSet.toJSON();
		ext = 'json';
	}
	else {
		// TODO: prepare class data for template from the given symbolSet
		output = template({classes: symbolSet.symbols});
		ext = 'html';
	}
	
	outputFile = new File(destination.getAbsolutePath() + '/classes.'+ext);
	
	if (outputFile.exists()) {
		if (!outputFile.remove()) {
			die( 'Could not overwrite existing output file: ' + outputFile.getAbsolutePath() );
		}
	}
	
	if (!outputFile.open()) {
		die( 'Could not open output file: ' + outputFile.getAbsolutePath() );
	}
	else {
		outputFile.write(output);
		outputFile.close();
	}
	
	print( '1 file created in ' +  destination.getAbsolutePath() );
}