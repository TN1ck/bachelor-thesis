var webpack           = require('webpack');

module.exports = {
    devtool: 'eval',
    entry: [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        './scripts/routes'
    ],
    output: {
        path: __dirname + '/build/',
        filename: 'bundle.js',
        publicPath: '/build/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    resolve: {
        extensions: ['', '.js', '.css', '.scss']
    },
    module: {
        preLoaders: [
            // Lint javascript using eslint
            {
                test: /\.js$/,
                loader: 'eslint-loader',
                exclude: /node_modules/
            }
        ],
        // file transformers
        loaders: [
            // We use react-hot and babel-loader for javascript files.
            // Babel will compile the ES6 code to ES5 and react-hot Will
            // update the application on the fly
            {
                test: /\.js$/,
                loaders: [
                    'react-hot',
                    'babel-loader'
                ],
                exclude: /node_modules/
            },
            // Transform less files
            {
                test: /\.less$/,
                loader: 'style!css!autoprefixer!less'
            }
        ]
    }
};
