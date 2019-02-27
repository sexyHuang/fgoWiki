import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import scroll from './plugins/scroll';
import VueLazyload from 'vue-lazyload';
import './plugins/vant';
import globalFilters from './plugins/globalFilters';
Vue.use(VueLazyload);
Vue.use(scroll);
Vue.use(globalFilters);
Vue.config.productionTip = false;
Vue.prototype.$setTitle = function(text) {
  document.querySelector('title').innerHTML = text;
  store.commit('setTitle', text);
};
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
