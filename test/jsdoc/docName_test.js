include('ringo/unittest');
include('jsdoc/docName')

exports.setUp = exports.tearDown = function() {}

exports.testSimple = function () {
	assertEqual(
		{
			name: 'foo',
			memberof: '',
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
			memberof: 'foo',
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
			memberof: 'foo',
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
			memberof: 'foo#',
			shortname: 'bar',
			isinner: false,
			isstatic: false
		},
		docName('foo#bar')
	);
};

exports.testMemberof = function () {
	assertEqual(
		{
			name: 'foo#bar',
			memberof: 'foo#',
			shortname: 'bar',
			isinner: false,
			isstatic: false
		},
		docName('bar', 'foo#')
	);
};

exports.testMemberofStatic = function () {
	assertEqual(
		{
			name: 'foo.bar',
			memberof: 'foo',
			shortname: 'bar',
			isinner: false,
			isstatic: true
		},
		docName('bar', 'foo', {isstatic: true})
	);
};

exports.testMemberofInner = function () {
	assertEqual(
		{
			name: 'foo-bar',
			memberof: 'foo',
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
			memberof: 'foo.bar#',
			shortname: 'baz',
			isinner: false,
			isstatic: false
		},
		docName('foo.bar#baz')
	);
	
	assertEqual(
		{
			name: 'foo#bar.baz',
			memberof: 'foo#bar',
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
			memberof: '$f **.b@^1#',
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
			memberof: '',
			shortname: '"f.oo"',
			isinner: false,
			isstatic: false
		},
		docName('"f.oo"')
	);
	
	assertEqual(
		{
			name: '"f##"#bar',
			memberof: '"f##"#',
			shortname: 'bar',
			isinner: false,
			isstatic: false
		},
		docName('"f##"#bar')
	);
	
	assertEqual(
		{
			name: '"f.#.#"."b#r"#"b.z"',
			memberof: '"f.#.#"."b#r"#',
			shortname: '"b.z"',
			isinner: false,
			isstatic: false
		},
		docName('"f.#.#"."b#r"#"b.z"')
	);
	
	assertEqual(
		{
			name: 'one."two.three"',
			memberof: 'one',
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
			memberof: 'one.two',
			shortname: 'th\"ree\"',
			isinner: false,
			isstatic: true
		},
		docName('one.two.th\"ree\"')
	);
	
	assertEqual(
		{
			name: '"f##"#"\"b#r,\" she said."',
			memberof: '"f##"#',
			shortname: '"\"b#r,\" she said."',
			isinner: false,
			isstatic: false
		},
		docName('"f##"#"\"b#r,\" she said."')
	);
};
