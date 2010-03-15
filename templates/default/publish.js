export('publish');

include('ringo/file');
include('normal/normal-template');

function publish(/**SymbolSet*/symbolSet, /**File*/destination) {

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
	var allClasses = symbolSet.symbols.filter(function(symbol) {
		return symbol.isa === 'constructor';
	});
		
	allClasses.forEach(function(classSymbol) {
		classSymbol.methods = symbolSet.symbols.filter(function(symbol) {
			return symbol.memberOf === classSymbol.name + '#' && symbol.isa === 'method';
		});
		
		classSymbol.properties = symbolSet.symbols.filter(function(symbol) {
			return symbol.memberOf === classSymbol.name + '#' && symbol.isa === 'property';
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