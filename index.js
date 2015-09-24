'use strict';

console.log(process.versions);

const app = require('app');
const ipc = require('ipc');
const BrowserWindow = require('browser-window');
const path = require('path');
const fixPath = require('fix-path');
// const isRenderer = require('is-electron-renderer');

require('./preload').init();

// report crashes to the Electron project
require('crash-reporter').start();

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new BrowserWindow({
		width: 800,
		height: 650
	});

	fixPath();
	// console.log(process.env.PATH);
	// win.loadUrl(`file://${__dirname}/index.html`);
	win.loadUrl(path.join('file://', __dirname, '/index.html'));
	win.center();
	win.setTitle('COBRA');
	win.openDevTools({
		detatch: true
	});
	win.show();
	win.on('closed', onClosed);
	win.webContents.once("did-finish-load", function() {
		var http = require("http");
		var crypto = require("crypto");
		var server = http.createServer(function(req, res) {
			var port = crypto.randomBytes(16).toString("hex");
			ipc.once(port, function(ev, status, head, body) {
				//console.log(status, head, body);
				res.writeHead(status, head);
				res.end(body);
			});
			win.webContents.send("request", req, port);
		});
		server.listen(8881);
		console.log("http://localhost:8881/");
	});
	// win.loadUrl(path.join('http://localhost:8888/'));
	// console.log(path.join('file://', __dirname, '/index.html'));

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate-with-no-open-windows', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	var ipc = require("ipc");
	ipc.on("console", function(ev) {
		var args = [].slice.call(arguments, 1);
		var r = console.log.apply(console, args);
		ev.returnValue = [r];
	});
	ipc.on("app", function(ev, msg) {
		var args = [].slice.call(arguments, 2);
		ev.returnValue = [app[msg].apply(app, args)];
	});
	mainWindow = createMainWindow();
});
