import Vue from 'vue';
const state = {
  dTime: 0,
  aliveList: []
};
const getters = {};
const mutations = {
  setDTime(state, date) {
    let _now = new Date();
    state.dTime = _now - new Date(date);
  },

  setAliveList(state, list) {
    state.aliveList = list;
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
