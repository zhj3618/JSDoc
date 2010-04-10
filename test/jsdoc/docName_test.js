include('ringo/unittest');
include('jsdoc/docName')

exports.setUp = exports.tearDown = function() {}

exports.testSimple = function () {
	assertEqual(
		{
			name: 'foo',
			member: '',
			shortname: 'foo',
			isinner: false,
			isstatic: false
		},
		docName('foo')
	);
};

exports.testStatic = function () {
	assertEqual(
		{
			name: 'foo.bar',
			member: 'foo',
			shortname: 'bar',
			isinner: false,
			isstatic: true
		},
		docName('foo.bar')
	);
};

exports.testInner = function () {
	assertEqual(
		{
			name: 'foo-bar',
			member: 'foo',
			shortname: 'bar',
			isinner: true,
			isstatic: false
		},
		docName('foo-bar')
	);
};

exports.testInstance = function () {
	assertEqual(
		{
			name: 'foo#bar',
			member: 'foo#',
			shortname: 'bar',
			isinner: false,
			isstatic: false
		},
		docName('foo#bar')
	);
};

exports.testmember = function () {
	assertEqual(
		{
			name: 'foo#bar',
			member: 'foo#',
			shortname: 'bar',
			isinner: false,
			isstatic: false
		},
		docName('bar', 'foo#')
	);
};

exports.testmemberStatic = function () {
	assertEqual(
		{
			name: 'foo.bar',
			member: 'foo',
			shortname: 'bar',
			isinner: false,
			isstatic: true
		},
		docName('bar', 'foo', {isstatic: true})
	);
};

exports.testmemberInner = function () {
	assertEqual(
		{
			name: 'foo-bar',
			member: 'foo',
			shortname: 'bar',
			isinner: true,
			isstatic: false
		},
		docName('bar', 'foo', {isinner: true})
	);
};

exports.testLongname = function () {
	assertEqual(
		{
			name: 'foo.bar#baz',
			member: 'foo.bar#',
			shortname: 'baz',
			isinner: false,
			isstatic: false
		},
		docName('foo.bar#baz')
	);
	
	assertEqual(
		{
			name: 'foo#bar.baz',
			member: 'foo#bar',
			shortname: 'baz',
			isinner: false,
			isstatic: true
		},
		docName('foo#bar.baz')
	);
};

exports.testStrangename = function () {
	assertEqual(
		{
			name: '$f **.b@^1#b@z=',
			member: '$f **.b@^1#',
			shortname: 'b@z=',
			isinner: false,
			isstatic: false
		},
		docName('$f **.b@^1#b@z=')
	);
	
	// use double quotes to surround names that contain
	// special characters
	assertEqual(
		{
			name: '"f.oo"',
			member: '',
			shortname: '"f.oo"',
			isinner: false,
			isstatic: false
		},
		docName('"f.oo"')
	);
	
	assertEqual(
		{
			name: '"f##"#bar',
			member: '"f##"#',
			shortname: 'bar',
			isinner: false,
			isstatic: false
		},
		docName('"f##"#bar')
	);
	
	assertEqual(
		{
			name: '"f.#.#"."b#r"#"b.z"',
			member: '"f.#.#"."b#r"#',
			shortname: '"b.z"',
			isinner: false,
			isstatic: false
		},
		docName('"f.#.#"."b#r"#"b.z"')
	);
	
	assertEqual(
		{
			name: 'one."two.three"',
			member: 'one',
			shortname: '"two.three"',
			isinner: false,
			isstatic: true
		},
		docName('one."two.three"')
	);
	
	// escape double quotes if they are not intended to quote a name
	assertEqual(
		{
			name: 'one.two.th\"ree\"',
			member: 'one.two',
			shortname: 'th\"ree\"',
			isinner: false,
			isstatic: true
		},
		docName('one.two.th\"ree\"')
	);
	
	assertEqual(
		{
			name: '"f##"#"\"b#r,\" she said."',
			member: '"f##"#',
			shortname: '"\"b#r,\" she said."',
			isinner: false,
			isstatic: false
		},
		docName('"f##"#"\"b#r,\" she said."')
	);
};

exports.testStringyNameFromSource = function () {
	assertEqual(
		'foo."bar"',
		docName.fromSource('foo["bar"]')
	);
	
	assertEqual(
		'foo."bar"',
		docName.fromSource("foo['bar']")
	);
	
	assertEqual(
		'foo."bar".zip',
		docName.fromSource('foo["bar"].zip')
	);
	
	assertEqual(
		'foo."bar".zip',
		docName.fromSource("foo['bar'].zip")
	);
	
	assertEqual(
		'foo."bar"."zip"',
		docName.fromSource("foo['bar']['zip']")
	);
	
	assertEqual(
		'foo."bar"."zip"',
		docName.fromSource('foo["bar"]["zip"]')
	);
	
	assertEqual(
		'foo."bar".bap."zip"',
		docName.fromSource("foo['bar'].bap['zip']")
	);
	
	assertEqual(
		'foo."bar".bap."zip"',
		docName.fromSource('foo["bar"].bap["zip"]')
	);
	
	assertEqual(
		'foo."bar".bap."zip".zop',
		docName.fromSource("foo['bar'].bap['zip'].zop")
	);
	
	assertEqual(
		'foo."bar".bap."zip".zop',
		docName.fromSource('foo["bar"].bap["zip"].zop')
	);
	
	assertEqual(
		'foo."bar".bap."zip".zop',
		docName.fromSource('foo[\'bar\'].bap["zip"].zop')
	);
	
	assertEqual(
		'foo."bar"."zip".zop',
		docName.fromSource('foo[\'bar\']["zip"].zop')
	);
	
	assertEqual(
		'foo."bar"."zip".zop',
		docName.fromSource('foo[\'bar\']["zip"].zop')
	);
	
	// contains escaped quotes?
	assertEqual(
		'foo."bar\\\'".zip',
		docName.fromSource('foo[\'bar\\\'\'].zip')
	);
	
	assertEqual(
		'foo."bar\\"".zip',
		docName.fromSource('foo["bar\\\""].zip')
	);
};

exports.testProtoNameFromSource = function () {
	assertEqual(
		'foo#',
		docName.fromSource('foo.prototype')
	);
	
	assertEqual(
		'foo#bar',
		docName.fromSource('foo.prototype.bar')
	);
	
	assertEqual(
		'foo#bar#',
		docName.fromSource('foo.prototype.bar.prototype')
	);
	
	assertEqual(
		'foo#bar#zip',
		docName.fromSource('foo.prototype.bar.prototype.zip')
	);
}

exports.testStringyProtoNameFromSource = function () {
	assertEqual(
		'foo#"constructor"',
		docName.fromSource('foo.prototype.["constructor"]')
	);
	
	assertEqual(
		'foo#"constructor"',
		docName.fromSource("foo.prototype.['constructor']")
	);
	
	assertEqual(
		'foo#"constructor"#',
		docName.fromSource('foo.prototype.["constructor"].prototype')
	);
	
	assertEqual(
		'foo#"constructor"#',
		docName.fromSource("foo.prototype.['constructor'].prototype")
	);
}