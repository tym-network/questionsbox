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

const webpack = require('webpack');
const builder = require('electron-builder');
const path = require('path');
const fs = require('fs');

const webpackRendererConfiguration = require('./../webpack.prod.js');
const webpackMainConfiguration = require('./../webpack.main.js');

// Build the source code
const rendererCompilePromise = function() {
    return new Promise((res, rej) => {
        const rendererCompiler = webpack(webpackRendererConfiguration);
        rendererCompiler.run((err, stats) => {
            if (err || stats.hasErrors()) {
                console.log('Error while building renderer source code (Webpack)');
                console.error(err, stats);
                rej(err);
            } else {
                // Start building the code into an electron app
                console.log('Renderer source code built (Webpack)!');
                res();
            }
        });
    });
};

const mainCompilePromise = function() {
    return new Promise((res, rej) => {
        console.log('PLOP');
        const mainCompiler = webpack(webpackMainConfiguration);
        mainCompiler.run((err, stats) => {
            if (err || stats.hasErrors()) {
                console.log('Error while building main source code (Webpack)');
                console.error(err, stats);
                rej(err);
            } else {
                // Start building the code into a NW app
                console.log('Main source code built (Webpack)!');
                res();
            }
        });
    });
};

// First, clear build folder
const buildDirectory = path.join(__dirname, '..', 'build');
const webDirectory = path.join(__dirname, '..', 'web');
console.log(`CLEAR BUILD FOLDER (${buildDirectory})`);
console.log(`CLEAR BUILD FOLDER (${webDirectory})`);
Promise.all([buildDirectory, webDirectory]).then(() => {
    console.log('CLEAR BUILD FOLDERS OK');
    Promise.all([rendererCompilePromise, mainCompilePromise]).then(() => {
        const buildWindows = buildApp('windows');
        const buildLinux = buildApp('linux');
        const buildMac = buildApp('mac');

        return Promise.all([
            buildWindows,
            buildLinux,
            buildMac
        ]).then(() => {
            console.log('App built for Windows, Linux and Mac');
        });
    });
}, err => {
    console.log(`Unable to clear build folder (${buildDirectory})`, err);
});

function removeFile(filePath) {
    return new Promise((res, rej) => {
        fs.unlink(filePath, err => {
            if (err) {
                return rej(err);
            }

            res();
        });
    });
}

function removeDirectory(filePath) {
    return new Promise((res, rej) => {
        fs.rmdir(filePath, err => {
            if (err) {
                return rej(err);
            }

            res();
        });
    });
}

function handleFile(filePath) {
    return new Promise((res, rej) => {
        fs.lstat(filePath, (err, stats) => {
            if (err) {
                return rej(err);
            }

            if (stats.isDirectory()) {
                return emptyDirectory(filePath).then(() => {
                    return removeDirectory(filePath);
                });
            } else {
                return removeFile(filePath);
            }
        });
    });
}

function emptyDirectory(directory) {
    return new Promise((res, rej) => {
        fs.readdir(directory, (err, files) => {
            const filesPromises = [];
            if (err) {
                return rej(err);
            }

            for (const file of files) {
                const filePath = path.join(directory, file);
                filesPromises.push(handleFile(filePath));
            }

            return Promise.all(filesPromises);
        });
    });
}

// Build the app
function buildApp(platform) {
    builder.build({
        config: {
            appId: 'com.questionsbox',
            productName: 'QuestionsBox',
            directories: {
                output: 'build'
            },
            files: [
                'default-questions.json',
                'web/**/*'
            ],
            mac: {
                category: 'public.app-category.entertainment',
                target: 'dmg',
                icon: path.join(__dirname, '..', 'src', 'assets', 'img', 'logo.icns')
            },
            win: {
                target: 'nsis'
            },
            linux: {
                target: [
                    'AppImage',
                    'deb'
                ],
                category: 'Game'
            }
        },
        platform: platform
    }).then(() => {
        console.log('App built!');
    }).catch((error) => {
        console.log('Error while building app (electron-builder)');
        console.error(error);
    })
}