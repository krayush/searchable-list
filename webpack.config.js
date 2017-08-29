const path = require('path');
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')

const HTMLWebpackPlugin = require('html-webpack-plugin');
const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
    template: path.join(__dirname, '/index.html'),
    filename: 'index.html',
    inject: 'body',
    hash: getEnvironment() === "production"
});

function getEnvironment() {
     return process.env.NODE_ENV || "development";
};

function getEntryPoints() {
    return {
        bundle: path.join(__dirname, "index.js"),
        fonts: path.join(__dirname, "webfont.config.js"),
    };
};

let pathsToClean = [
    'dist'
];

const extractSass = new ExtractTextPlugin({
    filename: "[name].css"
});

var devServerConfig = {
    historyApiFallback: true,
    port: 8080,
    disableHostCheck: true
};

module.exports = function () {
    const environment = getEnvironment();
    const entryPoints = getEntryPoints();
    return {
        devtool: 'source-map',
        context: path.resolve(__dirname, './app/components'),
        entry: entryPoints,
        output: {
            filename: '[name].bundle.js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/'
        },
        module:{
            rules: [{
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components|webfont.config.js)/,
                use: {
                    loader: 'babel-loader'
                }
            }, {
                test: /\.scss$/,
                exclude: path.resolve(__dirname, './app/components'),
                use: ExtractTextPlugin.extract({
                    use: ["css-loader", "sass-loader"],
                    fallback: "style-loader"
                })
            }, {
                test: /\.(eot|ttf|woff|woff2)$/,
                loader: 'file-loader?name=[name].[ext]'
            }, {
                include: path.resolve(__dirname, './app/components'),
                use: ExtractTextPlugin.extract({
                    use: [
                        'css-loader?importLoader=1&modules&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
                        'sass-loader'
                    ],
                    fallback: "style-loader"
                }),
                test: /\.scss$/
            }, {
                test: /webfont\.config\.js/,
                use: [
                    'style-loader',
                    'css-loader',
                    'webfonts-loader'
                ]
            }, {
                test: /\.json$/,
                loader: 'json-loader'
            }]
        },
        devServer: devServerConfig,
        plugins: [
            HTMLWebpackPluginConfig,
            extractSass,
            new ProgressBarPlugin(),
            new webpack.DefinePlugin({
                environment:  JSON.stringify(environment)
            }),
            new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 5, // Must be greater than or equal to one
                minChunkSize: 1000
            }),
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify(environment)
                }
            }),
            new CleanWebpackPlugin(pathsToClean)
            // environment === 'production' ? new UglifyJsPlugin(): undefined
        ]
    };
};
