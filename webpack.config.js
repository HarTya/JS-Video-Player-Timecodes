const Dotenv = require('dotenv-webpack');
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = (directory, ext) => isDev ? `${directory}/[name].${ext}` : `${directory}/[name].[hash].${ext}`;

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if (isProd) {
        config.minimizer = [
            new CssMinimizerWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config;
}

const jsLoaders = () => {
    const loaders = [{
        loader: 'babel-loader',
        options: babelOptions()
    }]

    if (isDev) {
        loaders.push('eslint-loader')
    }

    return loaders;
}

const babelOptions = preset => {
    const opts = {
        presets: ['@babel/preset-env']
    }

    if (preset) {
        opts.presets.push(preset)
    }

    return opts;
}

const cssLoaders = extra => {
    const loaders = [
        MiniCssExtractPlugin.loader,
        'css-loader'
    ]
  
    if (extra) {
      loaders.push(extra)
    }
  
    return loaders;
}

module.exports = {
    mode: 'development',
    entry: {
        main: './src/index.jsx'
    },
    output: {
        filename: filename('js', 'js'),
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: isDev ? 'assets/[name].[ext]' : 'assets/[name].[hash].[ext]'
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
        alias: {
            '@src': path.resolve(__dirname, 'src'),
            '@public': path.resolve(__dirname, 'public')
        }
    },
    optimization: optimization(),
    devServer: {
        static: {
            directory: path.join(__dirname, 'src')
        },
        compress: true,
        open: true,
        port: 3000,
        historyApiFallback: true
    },
    devtool: isDev ? 'source-map' : false,
    plugins: [
        new HTMLWebpackPlugin({
            template: './public/index.html'
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, './public/favicon.ico'),
                    to: path.resolve(__dirname, 'dist')
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: filename('css', 'css')
        }),
        new Dotenv()
    ],
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            },
            {
                test: /\.m?ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions('@babel/preset-typescript')
                }
            },
            {
                test: /\.m?jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions('@babel/preset-react')
                }
            },
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader')
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                type: 'asset/resource'
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                type: 'asset/resource'
            },
            {
                test: /\.mp4$/,
                use: 'file-loader?name=videos/[name].[ext]',
            }
        ]
    }
}