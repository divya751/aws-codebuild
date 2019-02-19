var webpack = require("webpack");

const minimize = process.argv.indexOf('--minimize') >= 0 ? true : false
const plugins = []
var devtool = 'inline-source-map'

if (minimize) {
    plugins.push(new webpack.optimize.UglifyJsPlugin());
    devtool = ''
}

module.exports = {
    entry: {
        javascript: "./index.js",
        html: "../resources/static/index.html"
    },

    output: {
        path: "../resources/static",
        filename: "bundle.js"
    },

    devtool: devtool,

    module: {
        loaders: [
            {
                test: /\.(jsx|js)$/,
                exclude: /node_modules/,
                loaders: ["react-hot", "babel-loader"]
            },
            {
                test: /\.html$/,
                loader: "file?name=[name].[ext]"
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            },
            {
                test: /\.json$/,
                loader: "json-loader"
            }
        ]
    },

    devServer: {
        port: 3000,
        proxy: {
            '/api*': {
                target: 'http://localhost:8082',
                secure: false
            }
        },
        historyApiFallback: true
    }
};
