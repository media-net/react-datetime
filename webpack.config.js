const webpack = require('webpack');
module.exports = {
    resolve: {
        extensions: ['*', '.js', '.jsx', '.json']
        // modules: ['node_modules', 'src']
    },
    target: 'web',
    devtool: 'source-map',
    entry: './DateTime.js',
    output: {
        path: __dirname + '/dist/',
        library: 'Datetime',
        libraryTarget: 'umd'
    },
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': { NODE_ENV: '"production"' }
        })
    ],
    stats: 'minimal',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['babel-loader']
            }
        ]
    }
};
