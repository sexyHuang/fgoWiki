import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { icons } from './conf/image';
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
  Slider
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

Vue.config.productionTip = false;
Vue.prototype.$setTitle = function(text) {
  document.querySelector('title').innerHTML = text;
  store.commit('setTitle', text);
};
Vue.filter('bgImage', function(value) {
  return `background-image:url(${value})`;
});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
