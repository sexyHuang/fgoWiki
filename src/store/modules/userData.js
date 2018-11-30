import Vue from 'vue';
import cache from './../../cache';
const CACHE_NAME = '__user_data';
const DEFUALT_SERVANT_SETTING = JSON.stringify({
  lvs: [1, 1, 1],
  state: 0,
  getCloth: false
});
const Cache = new cache(CACHE_NAME);
const state = {
  servant_map: Cache.getData('servant_map') || {},
  material_map: Cache.getData('material_map') || {},
  material_calc_result: {}
};
const getters = {
  getServantSettingById: state => servantID => {
    return state.servant_map[servantID];
  }
};
const mutations = {
  addServantSetting(state, { servantID, data }) {
    data = data || JSON.parse(DEFUALT_SERVANT_SETTING);
    // Vue.set(state.servant_map, servantID, data);
    state.servant_map = Object.assign({}, state.servant_map, {
      [servantID]: data
    });
    Cache.addData('servant_map', state.servant_map, 0, false);
  },
  initServantMap(state, data) {
    if (!data) return;
    Cache.addData('servant_map', (state.servant_map = data), 0, false);
  },
  removeServantSetting(state, servantID) {
    if (!state.servant_map[servantID]) return;
    Vue.delete(state.servant_map, servantID);
    Cache.addData('servant_map', state.servant_map, 0, false);
  },
  addMaterialSetting(state, { materialID, count }) {
    Vue.set(state.material_map, materialID, count);
    Cache.addData('material_map', state.material_map, 0, false);
  },
  initMaterialMap(state, data) {
    if (!data) return;
    Cache.addData('material_map', (state.material_map = data), 0, false);
  }
};
const actions = {
  init({ commit }, { servantSettings, materialSettings }) {
    servantSettings && commit('initServantMap', servantSettings);
    materialSettings && commit('initMaterialMap', materialSettings);
  },
  _calcMaterial({ commit }, { materialID, dCount }) {
    dCount = dCount * 1;
    if (typeof dCount !== 'number') return;
    state.material_map[materialID] ||
      commit('addMaterialSetting', { materialID, count: 0 });
    let now_count = state.material_map[materialID];
    Vue.set(state.material_map, materialID, now_count + dCount);
  },
  materialsCalc({ dispatch, state }, materialCalcSettings) {
    state.material_calc_result = {};
    for (let { materialID, dCount } of materialCalcSettings) {
      dispatch('_calcMaterial', { materialID, dCount });
    }
  },
  setServantFollows({ commit }, servantIDList) {
    servantIDList.map(servantID => commit('addServantSetting', { servantID }));
  }
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
