import { search } from '@/common/common';
const state = {
  list: [],
  types: [],
  attrs: []
};
const getters = {
  getList: state => ({ searchObj, page }) => {
    let _list = state.list;
    const PAGE_SIZE = 70;
    if (JSON.stringify(searchObj) !== '{}') {
      _list = _list.filter(val => search(val, searchObj));
    }
    let _count = (page || 1) * PAGE_SIZE;
    return _list.slice(0, _count);
  }
};
const mutations = {
  setData(state, { list, types, attrs }) {
    state.list = list;
    if (types) state.types = types;
    if (attrs) state.attrs = attrs;
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
