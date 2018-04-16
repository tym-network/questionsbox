const webpack = require('webpack');
const NwBuilder = require('nw-builder');

const webpackConfiguration = require('./../webpack.prod.js');

const nw = new NwBuilder({
    files: ['./web/**/**', './package.json', './questions.json'], // use the glob format
    platforms: ['osx64', 'win', 'linux'],
    flavor: 'normal',
    appName: 'QuestionsBox',
    buildDir: './build',
    cacheDir: './cache',
    macIcns: './src/assets/img/logo.icns'
});

nw.on('log', console.log);


const compiler = webpack(webpackConfiguration);

// Build the source code
compiler.run((err, stats) => {
    if (err || stats.hasErrors()) {
        console.log('Error while building source code (Webpack)');
        console.error(err, stats);
    } else {
        // Start building the code into a NW app
        console.log('Source code build (Webpack)!');
        buildNW();
    }
});

function buildNW() {
    nw.build().then(function () {
        console.log('Build complete');
    }).catch(function (error) {
        console.log('Error while building');
        console.error(error);
    });
}