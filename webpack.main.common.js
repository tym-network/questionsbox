const path = require('path');

module.exports = {
    entry: './src/js/main.js',
    output: {
        path: path.resolve(__dirname, 'web'),
        filename: 'js/main.js'
    },
    target: 'electron-main',
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, "src", "js")
                ],
                use: [{
                    loader:'babel-loader'
                }, {
                    loader: 'eslint-loader'
                }]
            }
        ]
    },
    resolve: {
        symlinks: true
    },
    node: {
        __dirname: false,
        __filename: false
    }
}