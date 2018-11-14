import Vue from 'vue';
const state = {
  list: [],
  list4Treasure: []
};
const getters = {};
const mutations = {
  setList(state, list) {
    state.list = list;
  },
  setList4Treasure(state, list) {
    state.list4Treasure = list;
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
