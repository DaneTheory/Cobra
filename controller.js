function launch() {
	var mainRend = require('./rend.js');
	var router = require('./router');
	var server = require('./server');

	var routes = {
		'/': mainRend.home,
		'/home': mainRend.home,
		'/upload': mainRend.upload,
		'_static': mainRend.serveStatic
	};

	server.serverUp(router.routesReady, routes);

}

module.exports = {
	launch
};
