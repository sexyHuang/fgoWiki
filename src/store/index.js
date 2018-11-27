import Vue from 'vue';
import Vuex from 'vuex';
import servant from './modules/servant';
import system from './modules/system';
import craftessence from './modules/craftessence';
import material from './modules/material';
import userData from './modules/userData';
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    servant,
    system,
    craftessence,
    material,
    userData
  }
});
