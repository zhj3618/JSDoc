export('die');

function die(msg) {
	throw new Error('[FATAL] ' + msg);
}