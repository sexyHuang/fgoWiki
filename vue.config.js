var os = require('os'),
  iptable = {},
  ifaces = os.networkInterfaces();
for (var dev in ifaces) {
  ifaces[dev].forEach(function(details, alias) {
    if (details.family == 'IPv4') {
      iptable[dev + (alias ? ':' + alias : '')] = details.address;
    }
  });
}
//console.log(iptable['WLAN:1']);

module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  },
  outputDir: './../../../myGit/runoob/public/fgowiki',
  baseUrl: '/',
  productionSourceMap: false,
 /*  devServer: {
    host: iptable['WLAN:1']
  }, */
  devServer: {
    proxy: 'http://localhost:3001'
  },
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.scss` 这个文件
        data: `@import "@/scss/reset/_css_viriables.scss";`
      }
    }
  }
};
