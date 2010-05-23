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
	var counter,
		expecting,
		totalTests = 0,
		fails = 0,
		passes = 0;
	
	function fail(message) {
		print('\033[1;31m' + 'NOT OK ' + String(message).replace(/\n/g, '\n#    ') + '\033[m');
		
		if (!isNaN(counter)) { counter++; }
		fails++;
	}
	
	function pass(message) {
		print('OK ' + message);
		
		if (!isNaN(counter)) { counter++; }
		passes++;
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
				
				try {
					module[t]();
				}
				catch(e) {
					fail(e);
				}
				
				totalTests++;
				
				if (expecting && counter !== expecting) {
					fail('#    Expected ' + expecting + ' asserts, actual: ' + counter);
					delete counter;
					delete expecting;
				}
			}
		}
	}
	
	test.summary = function() {
		print('########################################################');
		print('# ' + totalTests + ' tests ran.');
		print('# ' + fails + ' of '+ (fails+passes) + ' assertions failed.');
		
		if (fails === 0) { print('\033[1;37;42m# ALL PASS.\033[m'); }
		else { print('\033[1;37;41m# FAIL.\033[m'); }
		print('');
	}

	test.assertEqual = function(expected, actual, message) {
		try {
			assert.isEqual(expected, actual, message);
			pass(message);
		}
		catch(e) { fail(e.message); }
	}
	
	test.isSame = function(expected, actual, message) {
		try {
			assert.isSame(expected, actual, message);
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
