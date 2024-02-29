/// <binding BeforeBuild='Run - Development' />
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const RemovePlugin = require('remove-files-webpack-plugin');
const devMode = process.env.NODE_ENV !== 'production';

var paths = {
    webroot: "./"
};

var jsFiles = [
    `${paths.webroot}src/js/monthly.js`
];

var cssFiles = [
    paths.webroot + "src/css/monthly.css"
];

var rules = {
    cssRule: {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
    },
    fontsRule: {
        test: /.(png|jpg|gif|ttf|otf|eot|ico|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        type: 'asset/resource'
    },
    cssToTextRule: {
        test: /\.(less|css)$/,
        use: [
            { loader: MiniCssExtractPlugin.loader, options: { publicPath: '' } },
            { loader: 'css-loader', options: { sourceMap: false } }]
    }
};

var javascriptExport = {
    mode: devMode ? 'development' : 'production',
    context: path.resolve(__dirname, './'),
    devtool: 'source-map',
    entry: {
        monthly: jsFiles
    },
    target: 'web',
    output: {
        path: path.resolve(__dirname, 'dist'),
        library: 'monthly', // The name of the global variable the library is set to.
        libraryExport: 'default',
        libraryTarget: 'umd',
        filename: 'monthly.js'
    },
    module: {
        rules: [
            rules.cssRule,
            rules.fontsRule,
            rules.jqueryRule
        ]
    },
    resolve: {
        modules: [
            "node_modules"
        ],
        extensions: [".ts", ".tsx", ".js"]
    }
};

var cssExport = {
    mode: devMode ? 'development' : 'production',
    devtool: 'source-map',
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'monthly.css'
        }),
        new RemovePlugin({
            before: {
                // parameters for "before normal compilation" stage.
            },
            watch: {
                // parameters for "before watch compilation" stage.
            },
            after: {
                include: [
                    paths.webroot + 'dist/monthlyTemp.css',
                    paths.webroot + 'dist/monthlyTemp.css.map',
                ],
                trash: true
            }
        })
    ],
    context: path.resolve(__dirname, './'),
    entry: {
        monthlyTemp: cssFiles
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].css'
    },
    module: {
        rules: [
            rules.cssToTextRule,
            rules.fontsRule
        ]
    },
    resolve: {
        modules: [
            "node_modules"
        ]
    }
};

module.exports = (env, args) => {
    if (args.mode === 'production') {
        javascriptExport.mode = 'production';
        cssExport.mode = 'production';
    }
    return [javascriptExport, cssExport];
};