import Vue from 'vue';
import Vuex from 'vuex';
import servant from './modules/servant';
import system from './modules/system';
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    servant,
    system
  }
});
