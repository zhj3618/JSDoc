export('trim', 'die');

function die(msg) {
	throw new Error('[FATAL] ' + msg);
}

// from http://blog.stevenlevithan.com/archives/faster-trim-javascript
function trim(str) {
	var	str = str.replace(/^\s\s*/, ''),
		ws = /\s/,
		i = str.length;
	
	while (ws.test(str.charAt(--i)));
	return str.slice(0, i + 1);
}