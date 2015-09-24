function hook() {
	const isRenderer = require('is-electron-renderer');
	const pre = '(' + (isRenderer ? 'RENDERER' : 'MAIN') + ')';
	console.log = function(msg) {
		process.stdout.write(pre + msg + '\n');
	};
}

module.exports = {
	hook
};
