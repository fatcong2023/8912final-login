const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  devServer: {
    host: 'localhost', // Force the server to use localhost
    port: 8080,
  },
  transpileDependencies: true,
  configureWebpack: {
    devtool: 'source-map'
  },
  publicPath: '/',
  outputDir: 'dist'
})