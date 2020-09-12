const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const { name, version } = require('../package.json');

// 多线程加速构建
let workers = Math.floor(require('os').cpus().length * 0.7);
if (workers > 5) workers = 5
const threadLoader = {
  'loader': 'thread-loader',
  'options': {
    workers,
    'workerParallelJobs': 20,
    'workerNodeArgs': ['--max-old-space-size=1024'],
    'poolRespawn': false,
    'poolTimeout': 2000,
    'poolParallelJobs': 200,
    'name': 'thd-pool'
  }
}

module.exports = {
  'mode': 'production',
  'entry': {
    [name]: ['./src/index.js']
  },
  'output': {
    'library': name,
    'libraryTarget': 'umd',
    'umdNamedDefine': true,
    'path': path.join(process.cwd(), 'dist'),
    'filename': `main-${version}.min.js`
  },
  'externals': {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  'resolve': {
    'enforceExtension': false,
    'extensions': ['.js', '.jsx', '.json', '.less', '.css']
  },
  'module': {
    'rules': [
      {
        'test': /\.js[x]?$/,
        'use': [
          threadLoader,
          {
            'loader': 'babel-loader?cacheDirectory=true'
          }
        ],
        'exclude': '/node_modules/',
        'include': [path.resolve('src')]
      },
      {
        'test': /\.scss|\.css$/,
        'use': [
          { 'loader': 'style-loader' },
          {
            'loader': 'css-loader',
            'options': { 'importLoaders': 2 }
          },
          {
            'loader': 'postcss-loader',
            'options': {
              plugins: () => [
                require('autoprefixer')({
                  'overrideBrowserslist': ['last 1 version', 'ie >= 10']
                }),
              ]
            }
          },
          {
            'loader': 'sass-loader',
          }
        ]
      },
      {
        'test': /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        'loader': 'url-loader',
        'options': {
          'limit': 10000,
          'name': 'images/[name]-[hash:7].[ext]'
        }
      },
      {
        'test': /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        'loader': 'url-loader',
        'options': {
          'limit': 10000,
          'name': 'media/[name]-[hash:7].[ext]'
        }
      },
      {
        'test': /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        'loader': 'url-loader',
        'options': {
          'limit': 10000,
          'name': 'fonts/[name]-[hash:7].[ext]'
        }
      }
    ]
  },
  'optimization': {
    'minimizer': [
      new UglifyJsPlugin({
        'cache': true,
        'parallel': true,
        'uglifyOptions': {
          'compress': {
            'drop_debugger': true,
            'drop_console': true
          },
        }
      }),
      new OptimizeCSSAssetsPlugin({
        'cssProcessor': require('cssnano'),
        'cssProcessorOptions': { 'discardComments': { 'removeAll': true } },
        'canPrint': true
      })
    ],
    'noEmitOnErrors': true,
  },
  'plugins': [
    new ProgressBarPlugin(),
    new MiniCssExtractPlugin({
      'filename': '[name].min.css'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      '__DEBUG__': false,
    }),
    new webpack.LoaderOptionsPlugin({
      'minimize': true
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // new BundleAnalyzerPlugin(),
  ]
};
