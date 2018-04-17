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
            console.log('Error while building source code (Webpack)');
            console.error(err, stats);
            rej(err);
        } else {
            // Start building the code into a NW app
            console.log('Source code built (Webpack)!');
            res();
        }
    });
});

const mainCompilePromise = new Promise((res, rej) => {
    mainCompiler.run((err, stats) => {
        if (err || stats.hasErrors()) {
            console.log('Error while building source code (Webpack)');
            console.error(err, stats);
            rej(err);
        } else {
            // Start building the code into a NW app
            console.log('Source code built (Webpack)!');
            res();
        }
    });
});

Promise.all([rendererCompilePromise, mainCompilePromise]).then(() => {
    buildApp();
});


// Build the app
function buildApp() {
    builder.build({
        config: {
            appId: 'com.questionsbox',
            productName: 'QuestionsBox',
            directories: {
                output: 'build'
            },
            mac: {
                target: 'dmg',
                icon: path.join(__dirname, '..', 'src', 'assets', 'img', 'logo.icns')
            }
        }
    }).then(() => {
        console.log('App built!');
    }).catch((error) => {
        console.log('Error while building app (electron-builder)');
        console.error(error);
    })
}