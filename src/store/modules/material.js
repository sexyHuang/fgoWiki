import Vue from 'vue';
const state = {
  list: []
};
const getters = {
  getItemById: state => id => {
    return state.list.find(val => val.id === id * 1);
  }
};
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
