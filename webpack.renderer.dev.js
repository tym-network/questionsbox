const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.renderer.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        publicPath: '/'
    },
    devServer: {
        contentBase: './web',
        port: 9000,
        compress: true,
        hot: true,
        open: false
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                include: [
                    path.resolve(__dirname, "src", "sass")
                ],
                use: [{
                    loader: 'style-loader'
                },
                {
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
            }
        ]
    },
    plugins:[
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        })
    ]
});