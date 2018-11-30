//import Vue from 'vue';
const state = {
  dTime: 0,
  aliveList: [],
  isBack: false,
  showTitle: false,
  title: 'fgoWiki',
  isWeixin:
    navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ==
    'micromessenger',
  canGoBack: false
};
const getters = {
  hasTitle(state) {
    return state.showTitle && !state.isWeixin;
  }
};
const mutations = {
  setDTime(state, date) {
    let _now = new Date();
    state.dTime = _now - new Date(date);
  },
  setCanGoBack(state, flag) {
    state.canGoBack = flag;
  },
  setAliveList(state, list) {
    state.aliveList = list;
  },
  setShowTitle(state, data) {
    state.showTitle = data;
  },
  setTitle(state, text) {
    state.title = text;
  },
  setIsBack(state, flag) {
    state.isBack = flag;
  }
};
const actions = {};
export default {
  namespaced: false,
  state,
  getters,
  actions,
  mutations
};
