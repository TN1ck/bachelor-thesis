'use strict';

var webpack           = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    devtool: 'source-map',
    entry: [
        './scripts/routes'
    ],
    output: {
        path: __dirname + '/build/',
        filename: 'bundle.js',
        publicPath: '/build/'
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin("[name].css")
    ],
    resolve: {
        extensions: ['', '.js', '.css', '.scss']
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: [
                    'babel-loader',
                ],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loaders: [
                    'style-loader',
                    'css-loader',
                    'autoprefixer-loader',
                ],
                exclude: /node_modules/
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
            },
        ]
    }
};
