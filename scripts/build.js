const NwBuilder = require('nw-builder');
const nw = new NwBuilder({
    files: './**/**', // use the glob format
    platforms: ['osx64', 'win', 'linux'],
    flavor: 'normal',
    appName: 'QuestionsBox',
    buildDir: './build',
    cacheDir: './cache',
    macIcns: './src/assets/img/logo.icns'
});

nw.on('log', console.log);

nw.build().then(function () {
    console.log('Build complete');
}).catch(function (error) {
    console.log('Error while building');
    console.error(error);
});