const {app, BrowserWindow} = require('electron');
const fs = require('fs');
const path = require('path');
const url = require('url');

let win;

function createWindow() {
    win = new BrowserWindow({width: 800, height: 600})

    win.webContents.openDevTools();

    win.loadURL(url.format({
        pathname: path.join(__dirname, '..', 'html', 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    const appPath = `${app.getPath('appData')}/QuestionsBox`;
    const videoPath = `${appPath}/videos`;

    try {
        fs.mkdirSync(appPath);
    } catch (err) {
        if (err.code !== 'EEXIST') {
            console.error(err);
        }
    }

    try {
        fs.mkdirSync(videoPath);
    } catch (err) {
        if (err.code !== 'EEXIST') {
            console.error(err);
        }
    }

    global.paths = {
        'appData': appPath,
        'error': `${appPath}/error.json`,
        'config': `${appPath}/config.json`,
        'videos': videoPath,
        'questions': `${appPath}/questions.json`,
    };

    win.on('closed', () => {
        win = null
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});