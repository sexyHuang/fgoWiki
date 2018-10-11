import Vue from 'vue';
const state = {
  list: [],
  types: [],
  attrs: []
};
const getters = {};
const mutations = {
  setData(state, { list, types, attrs }) {
    state.list = list;
    if (types) state.types = types;
    if (attrs) state.attrs = attrs;
  },
 
};
const actions = {};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
