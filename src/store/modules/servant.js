import Vue from 'vue';
const state = {
  list: []
};
const getters = {};
const mutations = {
  setList(state, list) {
    state.list = list;
  }
};
const actions = {};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
