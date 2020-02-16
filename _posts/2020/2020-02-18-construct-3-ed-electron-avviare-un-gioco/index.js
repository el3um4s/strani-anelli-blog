const electron = require('electron');
const path = require('path');
const url = require('url');

const {
  app,
  BrowserWindow
} = electron;

let mainWindow;

// 426x240
app.on('ready', () => {
	mainWindow = new BrowserWindow({
		width: 426,
		height: 240,
		useContentSize: true,
		center:true,
		show: false,
		backgroundColor: '#420024',
		title: "KiwiStory (C3 & Electronjs)",
		icon: path.join(__dirname, '/src/icons/icon-256.png')
	});

	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'src', 'index.html'),
		protocol: 'file:',
		slashes: true
	}))


	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
	})

	mainWindow.on('closed', () => {
		mainWindow = null;
	})
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
