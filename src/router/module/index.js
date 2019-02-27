/*
 * @Author: Sexy
 * @Date: 2018-12-12 13:47:16
 * @LastEditors: Sexy
 * @LastEditTime: 2018-12-12 14:52:24
 * @Description: 路由模块自动加载
 */

const INDEX_PATH = './index.js';

const files = require.context('.', true, /\.js$/);
export default files
  .keys()
  .reduce(
    (prevs, key) =>
      key === INDEX_PATH ? prevs : [...prevs, ...files(key).default],
    []
  );
