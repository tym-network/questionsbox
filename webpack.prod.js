const CleanWebpackPlugin = require('clean-webpack-plugin');
const merge = require('webpack-merge');

const common = require('./webpack.common.js');

const pathsToClean = [
    'web'
]

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new CleanWebpackPlugin(pathsToClean)
    ]
});