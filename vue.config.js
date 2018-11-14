module.exports = {
  outputDir:'./../../../myGit/runoob/public/fgowiki',
  baseUrl: '/',
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
