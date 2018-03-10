const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "css/[name].css"
});

module.exports = {
    entry: './src/js/app.js',
    output: {
        path: path.resolve(__dirname, 'web'),
        filename: 'js/app.bundle.js'
    },
    target: 'node',
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, "src", "js"),
                ],
                use: [{
                    loader:'babel-loader'
                }, {
                    loader: 'eslint-loader'
                }]
            },
            {
                test: /\.scss$/,
                include: [
                    path.resolve(__dirname, "src", "sass"),
                ],
                use: extractSass.extract({
                    use: [{
                        loader: 'css-loader',
                        options: {
                            sourceMap: false
                        }
                    }, {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false
                        }
                    }]
                })
            },
            {
                test: /\.(svg|gif|jpg|jpeg|png)$/,
                include: [
                    path.resolve(__dirname, "src", "assets", "img"),
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
                    path.resolve(__dirname, "src", "assets", "fonts"),
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
                    path.resolve(__dirname, "src", "assets", "sound"),
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
        extractSass
    ],
    resolve: {
        symlinks: true
    }
}