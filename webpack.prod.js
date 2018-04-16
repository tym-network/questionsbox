const CleanWebpackPlugin = require('clean-webpack-plugin');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const common = require('./webpack.common.js');

const pathsToClean = [
    'web'
]

module.exports = merge(common, {
    plugins: [
        new CleanWebpackPlugin(pathsToClean),
        new UglifyJSPlugin({
            test: /\.js$/i
        })
    ]
});