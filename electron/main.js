
'use strict';

console.clear();

const { app, BrowserWindow, ipcMain } = require('electron');

app.on('ready', () => {

	const win = new BrowserWindow({
		webPreferences: {
			webSecurity: false,
			nodeIntegration: true
		},
		width: 360,
		height: 720,
		frame: false,
		resizable: false
	});

	win.loadURL(`file://${__dirname}/index.html`);
	// win.resizable = false;
	
});

ipcMain.on('quit', function() {
	app.quit();
})