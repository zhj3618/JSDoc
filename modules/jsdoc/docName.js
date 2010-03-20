export('docName');

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
	
	if ( /^(.+)([#.-])([^#.-]+)$/.test(name) ) {
		parts.connector = RegExp.$2;
		parts.memberof = RegExp.$1;
		parts.shortname = RegExp.$3;
		
		parts.name = name;
		parts.memberof += (parts.connector === '#'? '#' : '');
		
		if (parts.connector === '-') { opts.isinner = true; }
		if (parts.connector === '.') { opts.isstatic = true; }
	}
	
	return parts;
}

function docName(name, memberof, opts) {
	if (!name) { throw new Error('Missing required value for @name.'); }
	opts = opts || {};
	
	var result = {
		name: '',
		memberof: '',
		shortname: ''
	};
	
	if (memberof) {
		result.memberof = memberof;
		result.shortname = name;
		result.name = connect(result.shortname, result.memberof, opts);
	}
	else {
		var parts = divide(name, opts);
		
		result.memberof = parts.memberof;
		result.shortname = parts.shortname;
		result.name = parts.name;
	}
	
	result.isinner = opts.isinner || false;
	result.isstatic = opts.isstatic || false;
	
	return result;
}