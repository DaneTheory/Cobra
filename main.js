const app = require('app');
const BrowserWindow = require('browser-window');
const http = require('http');
const crashReporter = require('crash-reporter');
const path = require('path');
const fixPath = require('fix-path');
const ipc = require('ipc');
crashReporter.start({
	submitUrl: 'http://127.0.0.1:9999'
});

// Debug tools for Electron dev
require('electron-debug')();

// Main Process echos out to console JS modules on build
require('./preload').init();

// Generates crash reports. Output is currently set at http://127.0.0.1:9999.
function crashReport(min, max) {
	console.log('CRASH REPORT FOR COBRA STILL IN DEV');
	return Math.floor(Math.random() * (max - min)) + min;
}

var crashServer = http.createServer(function(req, res) {
	res.end(crashReport(1000, 9999).toString());
});

// Prevent Window being garbage collected
var mainWindow;

// Voids Main Window on app close. Alternatively use an array for multiple window instances.
function onClosed() {
	mainWindow = null;
}

function createMainWindow() {
	const win = new BrowserWindow({
		width: 800,
		height: 800,
		frame: false,
		resizable: false
	});

	// Ensures Electron is running from Users $PATH
	fixPath();
	// console.log(process.env.PATH);
	win.loadUrl(path.join('file://', __dirname, '/index.html'));
	win.center();
	win.setTitle('COBRA');

	// Opens DevTools on App launch. Will disable for production build.
	win.openDevTools({
		detatch: true
	});
	win.show();
	win.on('closed', onClosed);

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
	crashServer.listen(9999, '127.0.0.1', function() {
		mainWindow = createMainWindow();
	});
});

ipc.on('close-main-window', function() {
	app.quit();
});
