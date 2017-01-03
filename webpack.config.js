var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanPlugin = require('clean-webpack-plugin'); //清理文件夹
const config = require('./conf/config')

module.exports = {
    entry: __dirname + '/src/main.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        // publicPath: '/dist/',// html中嵌入的script的src的路径
        filename: '[name].[hash].build.js'
    },
    resolveLoader: {
        root: path.join(__dirname, 'node_modules'),
    },
/*    resolve: {
        alias: {
            echarts$: "echarts/src/echarts.js",
            echarts: "echarts/src",
            zrender$: "zrender/src/zrender.js",
            zrender: "zrender/src"
        }
    },*/
    module: {
        loaders: [
            {
                test: require.resolve('jquery'),
                loader: 'expose?jQuery!expose?$'
            },
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.html$/,
                loader: 'vue-html'
            },
            {
                test: /\.(eot|woff|woff2|ttf)([\?]?.*)$/,
                loader: "file",
                query: {
                    limit: 10000,
                    name: '[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    plugins: [
        //清空输出目录
        // new CleanPlugin(['dist']),
        new HtmlWebpackPlugin({
            inject: true,
            template: 'index.html',
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
            }
        })
    ],
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        proxy: {
            '/CloudMonitor': {
                target: config.porxy.target,
                changeOrigin: true,
                secure: false
            }
        }
    },
    devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin()
    ])
}
