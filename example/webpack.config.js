const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        path.resolve(__dirname, 'example.js')
    ],

    output: {
        path: path.resolve(__dirname, '.'),
        filename: '[name].[hash].js',
        chunkFilename: '[name].[hash].js'
    },
    stats: 'minimal',
    mode: 'production',
    optimization: {
        splitChunks: {
            cacheGroups: {
                // create vendor chunk from node_modules
                vendor: {
                    chunks: 'initial',
                    name: 'vendor',
                    test: /node_modules/,
                    enforce: true
                }
            }
        },
        minimize: true,
        minimizer: [
            // Minify JS
            new UglifyJSPlugin({
                uglifyOptions: {
                    compress: {
                        // Disabled because of an issue with Uglify breaking seemingly valid code:
                        // Pending further investigation:
                        // https://github.com/mishoo/UglifyJS2/issues/2011
                        comparisons: false
                    },
                    output: {
                        comments: false
                    }
                },
                sourceMap: true,
                parallel: true
            })
        ]
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['babel-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'index.html'),
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            },
            inject: true,
            // Note that you can add custom options here if you need to handle other custom logic in index.html
            // To track JavaScript errors via TrackJS, sign up for a free trial at TrackJS.com and enter your token below.
            trackJSToken: ''
        })
    ]
};
