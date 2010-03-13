export('render');

include('ringo/file');
include('jsdoc/common');

function render(template, data, destination) {
	var output = template(data);

	if (!destination.exists() && !destination.makeDirectory()) {
		die( 'Could not create that destination directory: ' + destination.getAbsolutePath() );
	}
	
	if (!destination.isDirectory()) {
		die( 'Could not write to that destination directory: ' + destination.getAbsolutePath() );
	}

	var outputFile = new File(destination.getAbsolutePath() + '/classes.html');
	
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