import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
//import { icons } from './conf/image';
import './registerServiceWorker';
import scroll from './scroll';
import VueLazyload from 'vue-lazyload';

import {
  Icon,
  SwitchCell,
  Popup,
  Search,
  Collapse,
  CollapseItem,
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  Radio,
  Button,
  Tab,
  Tabs,
  NavBar,
  Field,
  List,
  Picker,
  Toast,
  Loading,
  PullRefresh,
  Cell,
  CellGroup,
  Slider,
  Dialog,
  SwipeCell,
  Rate,
  Stepper,
  NumberKeyboard
} from 'vant';

Vue.use(Loading);
Vue.use(PullRefresh);
Vue.use(scroll);
Vue.use(Toast);
Vue.use(Field);

Vue.use(NavBar);
Vue.use(VueLazyload);
Vue.use(Button);

Vue.use(Popup);
Vue.use(Icon);

Vue.use(SwitchCell);
Vue.use(Search);
Vue.use(Collapse).use(CollapseItem);
Vue.use(Checkbox).use(CheckboxGroup);
Vue.use(Cell).use(CellGroup);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(Tab).use(Tabs);
Vue.use(List);
Vue.use(Picker);
Vue.use(Slider);
Vue.use(Dialog);
Vue.use(SwipeCell);
Vue.use(Rate);
Vue.use(Stepper);
Vue.use(NumberKeyboard);
Vue.config.productionTip = false;
Vue.prototype.$setTitle = function(text) {
  document.querySelector('title').innerHTML = text;
  store.commit('setTitle', text);
};
Vue.filter('bgImage', function(value) {
  return `background-image:url(${value})`;
});
Vue.filter('formateNumber', function(number) {
  const B_NUMBER = '零一二三四五六七八九十'.split('');
  const UNITS = [[8, '亿'], [4, '万'], [3, '千'], [2, '百'], [1, '十']];
  number += '';
  number = number
    .split('')
    .reverse()
    .map((val, idx) => {
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
    .reverse()
    .reduce((prev, curr) => {
      return prev + curr;
    }, '')

    .replace(/零+([亿|万])/g, '$1')
    .replace(/亿万/g, '亿零')
    .replace(/零+/g, '零')
    .replace(/零$/, '')
    .replace(/一十/g, '十');
  return number;
});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
