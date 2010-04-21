/**
	@overview Unit test harness for JsDoc Toolkit.
	@author Michael Mathews <micmath@gmail.com>
	@license Apache License 2.0 - See file 'LICENSE.markdown' in this project.
 */

/**
	@namespace test
 */
var test = (typeof exports === 'undefined')? {} : exports; // like commonjs

(function() {
	var assert = assert || require('narwhal-test/assert');
	var counter, expecting;
	
	function fail(message) {
		print('\033[0;31m' + 'NOT OK: ' + message + '\033[m');
		
		if (!isNaN(counter)) { counter++; }
	}
	
	function pass(message) {
		print('ok: ' + message);
		
		if (!isNaN(counter)) { counter++; }
	}
	
	test.suite = function(name) {
		print('# [' + name + ']');
	}
	
	test.expect = function(n) {
		expecting = n;
		counter = 0;
	}
	
	test.run = function(module) {
		for (var t in module) {
			if (t.indexOf('test') === 0 && typeof module[t] === 'function') {
				print('# '+t);
				module[t]();
			}
		}
		
		if (expecting && counter !== expecting) {
			fail('Expected ' + expecting + ' tests, actual: ' + counter);
			delete counter;
			delete expecting;
		}
	}

	test.assertEqual = function(expected, actual, message) {
		try {
			assert.isEqual(expected, actual, message);
			pass(message);
		}
		catch(e) { fail(e.message); }
	}
	
	test.throwsError = function(block, type, message) {
		try {
			assert.throwsError(block, type, message);
			pass(message);
		}
		catch(e) { fail(e.message); }
	}
})();
