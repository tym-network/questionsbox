const path = require('path');
const CleanObsoleteChunks = require('webpack-clean-obsolete-chunks');

module.exports = {
    entry: './src/js/app.js',
    output: {
        path: path.resolve(__dirname, 'web'),
        filename: 'js/app.bundle.js'
    },
    target: 'electron-renderer',
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
            },
            {
                test: /\.(svg|gif|jpg|jpeg|png)$/,
                include: [
                    path.resolve(__dirname, "src", "assets", "img")
                ],
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'img/[name]-[hash].[ext]',
                        publicPath: '../'
                    }
                }]
            },
            {
                test: /\.(eot|woff|svg|ttf)$/,
                include: [
                    path.resolve(__dirname, "src", "assets", "fonts")
                ],
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[name]-[hash].[ext]',
                        publicPath: '../'
                    }
                }]
            },
            {
                test: /\.(ogg)$/,
                include: [
                    path.resolve(__dirname, "src", "assets", "sound")
                ],
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'sound/[name]-[hash].[ext]',
                        publicPath: '../'
                    }
                }]
            }
        ]
    },
    plugins: [
        new CleanObsoleteChunks()
    ],
    resolve: {
        symlinks: true
    }
}