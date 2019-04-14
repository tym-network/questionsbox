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
const builder = require("electron-builder");
const path = require('path');

const webpackRendererConfiguration = require('./../webpack.prod.js');
const webpackMainConfiguration = require('./../webpack.main.js');

const rendererCompiler = webpack(webpackRendererConfiguration);
const mainCompiler = webpack(webpackMainConfiguration);

// Build the source code
const rendererCompilePromise = new Promise((res, rej) => {
    rendererCompiler.run((err, stats) => {
        if (err || stats.hasErrors()) {
            console.log('Error while building renderer source code (Webpack)');
            console.error(err, stats);
            rej(err);
        } else {
            // Start building the code into a NW app
            console.log('Renderer source code built (Webpack)!');
            res();
        }
    });
});

const mainCompilePromise = new Promise((res, rej) => {
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

Promise.all([rendererCompilePromise, mainCompilePromise]).then(() => {
    const buildWindows = buildApp('windows');
    const buildLinux = buildApp('linux');
    const buildMac = buildApp('mac');

    Promise.all([
        buildWindows,
        buildLinux,
        buildMac
    ]).then(() => {
        console.log('App built for Windows, Linux and Mac');
    });
});


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