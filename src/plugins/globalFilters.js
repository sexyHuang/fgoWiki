const formateNumber = number =>
  (number + '')
    .split('')
    .reverse()
    .map((val, idx) => {
      const B_NUMBER = '零一二三四五六七八九十'.split('');
      const UNITS = [[8, '亿'], [4, '万'], [3, '千'], [2, '百'], [1, '十']];
      val = B_NUMBER[val];
      if (idx) {
        idx = idx % 8;
        idx = idx % 4 || idx;
        for (let [key, unit] of UNITS) {
          if (idx % key === 0) {
            if (val !== '零') {
              val += unit;
            } else if (val === '零' && idx % 4 === 0) {
              val = unit + '零';
            }
            break;
          }
        }
      } else val = val === '零' ? '' : val;

      return val;
    })
    .reduceRight((prev, curr) => {
      return prev + curr;
    }, '')
    .replace(/零+([亿|万])/g, '$1')
    .replace(/亿万/g, '亿零')
    .replace(/零+/g, '零')
    .replace(/零$/, '')
    .replace(/一十/g, '十');

const install = function(Vue) {
  Vue.filter('bgImage', value => `background-image:url(${value})`);
  Vue.filter('formateNumber', formateNumber);
};

export default install;
