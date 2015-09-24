function serverUp() {
	const config = require('./config');
	const http = require('http');
	const url = require('url');

	function start(route, routes) {

		function onRequest(request, response) {
			const pathname = url.parse(request.url).pathname;
			var postData = '';

			request.setEncoding('utf8');

			request.addListener('data', function(postDataChunk) {
				postData += postDataChunk;
			});

			request.addListener('end', function() {
				route(routes, pathname, response, postData);
			});
		}

		http.createServer(onRequest).listen(config.port);
		// console.log('Started HTTP server on port ' + config.port + '...');
	}
}
module.exports = {
	serverUp: serverUp
};
