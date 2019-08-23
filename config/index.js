'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/phone': {
        target: 'http://s224.360fdc.com:8085/img/',
        changeOrigin: true,
        pathRewrite: {
          '^/phone': ''
        }
      },
      '/api': {
        // target: 'http://s224.360fdc.com:8095/api',
        target:'http://newhousesys.t.jjw.com:8095/api',
        // target: 'http://s224.360fdc.com:8095/api',
        // target: 'htttp://192.168.1.38:18081',   // tx
        // target: 'http://192.168.1.68:18081',       // wq
        // target: 'htttp://192.168.1.93:18081',  // zdm
        // target: 'htttp://192.168.1.159:18081',  // 
        // target: 'http://192.168.1.117:8081',
        // target: 'http://s224.360fdc.com:18081',
        //  target: "http://192.168.1.224:18088",
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/img': {
        target: 'http://192.168.1.254:152',
        changeOrigin: true,
        pathRewrite: {
          '^/img': ''
        },
      }
    },

    // Various Dev Server settings
    host: '', // can be overwritten by process.env.HOST
    port: 8089, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
