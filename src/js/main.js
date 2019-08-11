// Copyright (C) 2018 Théotime Loiseau
//
// This file is part of QuestionsBox.
//
// QuestionsBox is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// QuestionsBox is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with QuestionsBox.  If not, see <http://www.gnu.org/licenses/>.
//

const {app, BrowserWindow} = require('electron');
const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');
const fs = require('fs');
const path = require('path');
const url = require('url');

let win;
let isDev = process.env['NODE_ENV'] === 'development';

function createFoldersAndPaths() {
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
        'appPath': app.getAppPath(),
        'error': `${appPath}/error.json`,
        'config': `${appPath}/config.json`,
        'videos': videoPath,
        'questions': `${appPath}/questions.json`
    };
}

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    createFoldersAndPaths();

    if (isDev) {
        // Load index.html via webpack dev server.
        win.loadURL('http://localhost:9000/html/index.html');
    } else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, '..', 'html', 'index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }

    win.on('closed', () => {
        win = null
    });
}

app.on('ready', () => {
    if (isDev) {
        installExtension(REACT_DEVELOPER_TOOLS)
            .then(name => {
                console.log(`Added Extension:  ${name}`);
                createWindow();
            })
            .catch(err => console.log('An error occurred: ', err));
    } else {
        createWindow();
    }
});

app.on('window-all-closed', () => {
    app.quit();
});