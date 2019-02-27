import { search } from '@/library/common/common';
const state = {
  list: [],
  types: [],
  attrs: []
};
let _cache_list = [];
const getters = {
  getList: state => ({ searchObj, page }) => {
    let _list = _cache_list;
    const PAGE_SIZE = 70;
    if (searchObj) {
      _list = state.list;
      if (JSON.stringify(searchObj) !== '{}')
        _list = _list.filter(val => search(val, searchObj));
      _cache_list = _list;
    }
    let _count = (page || 1) * PAGE_SIZE;
    return {
      list: _list.slice(0, _count),
      finished: _count >= _list.length
    };
  }
};
const mutations = {
  setData(state, { list, types, attrs }) {
    state.list = list;
    _cache_list = list;
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
