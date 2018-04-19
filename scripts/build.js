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
                category: 'public.app-category.entertainment',
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