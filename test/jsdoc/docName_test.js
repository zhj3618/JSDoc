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
