export('publish');

include('ringo/file');
include('normal/normal-template');

function publish(/**DocSet*/docSet, /**File*/destination) {

	// create the template object
	var templateFile = new File('apps/jsdoc-toolkit/templates/default/class.html'),
		templateSrc,
		template;
		
	try {
		templateSrc = templateFile.readAll();
	}
	catch(e) {
		die( 'Could not find or read template file at that location: ' + templateFile.getAbsolutePath() );
	}
	
	template = compile(templateSrc);
	
	// find classes, and their properties/methods
	var allClasses = docSet.docs.filter(function(doc) {
		return doc.isa === 'constructor';
	});
		
	allClasses.forEach(function(classDoc) {
		var instanceName = classDoc.name + '#';
		
		classDoc.methods = docSet.docs.filter(function(doc) {
			return doc.member === instanceName && doc.isa === 'method';
		});
		
		classDoc.properties = docSet.docs.filter(function(doc) {
			return doc.member === instanceName && doc.isa === 'property';
		});
	});
	
	
	// pass classes to the template
	var output = template({classes: allClasses});
	
	// create the output file
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
	
	print( '1 output file created in ' +  destination.getAbsolutePath() );
}