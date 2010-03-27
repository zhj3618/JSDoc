export('docName', 'docName.fromSource');

include('jsdoc/common');

function connect(name, memberof, opts) {
	if (memberof.endsWith('#')) {
		opts.isstatic = false;
		return memberof + name;
	}
	
	if (opts.isinner) {
		return memberof + '-' + name;
	}
	
	return memberof + '.' + name;
};

function divide(name, opts) {
	var parts = {
		memberof: '',
		name: name,
		shortname: name
	};
	
	if (
		/^(?:(.+)([#.-]))?("(\"|[^"])+")$/.test(name) // like one#"two#three"
		||
		/^(.+)([#.-])([^#.-]+)$/.test(name) // like one#two
	) {

		parts.connector = RegExp.$2;
		parts.memberof = RegExp.$1;
		parts.shortname = RegExp.$3 || name;
		
		parts.name = name;
		parts.memberof += (parts.connector === '#'? '#' : '');
		
		if (parts.connector === '-') { opts.isinner = true; }
		if (parts.connector === '.') { opts.isstatic = true; }
	}
	
	return parts;
}

/**
	Determine what the various name related values are from the tags present.
 */
function docName(name, memberof, props) {
	if (!name) {
		throw new Error('Missing required value for @name.');
	}
	
	props = props || {};
	
	var result = {
		name: '',
		memberof: '',
		shortname: ''
	};
	
	if (memberof) {
		// fix this
		if (name.indexOf('this.') === 0) {
			name = name.replace('this.', '');
		}
		
		result.memberof = memberof;
		result.shortname = name;
		result.name = connect(result.shortname, result.memberof, props);
	}
	else {
		var parts = divide(name, props);
		
		result.memberof = parts.memberof;
		result.shortname = parts.shortname;
		result.name = parts.name;
	}
	
	result.isinner = props.isinner || false;
	result.isstatic = props.isstatic || false;
	
	return result;
}

/**
	The name was found in the source code, may need some clean up, then add new tag to doc.
	@param {string} sourceName
	@return {string}
 */
docName.fromSource = function(sourceName) {
print("docName.fromSource("+sourceName+")");
	
	var name = sourceName.replace(/\.prototype\.?/g, '#');
 	
 	if (name.indexOf('[') > -1) { // stringy name, like foo["bar"] or foo['bar']
 		name = name
			.replace(/(["'])\]\[\1/g, '"."')
			.replace(/["']\]\./g, '".')
			.replace(/\.\[["']/g, '."')
			.replace(/["']\]#/g, '"#')
			.replace(/#\[["']/g, '#"')
			.replace(/\[["']/g, '."')
			.replace(/["']\](.*)/g, "\"$1")
		;
	}
	
	return name;
}