import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { icons } from './conf/image';
import './registerServiceWorker';
import VueLazyload from 'vue-lazyload';
import {
  Icon,
  SwitchCell,
  CellGroup,
  Popup,
  Search,
  Collapse,
  CollapseItem,
  Checkbox,
  CheckboxGroup,
  Button,
  RadioGroup,
  Radio,
  Tab,
  Tabs,
  NavBar,
  List,
  Loading
} from 'vant';

Vue.use(Loading);

Vue.use(NavBar);
Vue.use(VueLazyload);
Vue.use(Button);

Vue.use(Popup);
Vue.use(Icon);
Vue.use(CellGroup);
Vue.use(SwitchCell);
Vue.use(Search);
Vue.use(Collapse).use(CollapseItem);
Vue.use(Checkbox).use(CheckboxGroup);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(Tab).use(Tabs);
Vue.use(List);

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
