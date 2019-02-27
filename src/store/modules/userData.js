import Vue from 'vue';
import cache from '@/library/cache';
import isEqual from 'lodash/isEqual';
const CACHE_NAME = '__user_data';

const DEFUALT_SERVANT_SETTING = JSON.stringify({
  lvs: [1, 1, 1],
  state: 0,
  getCloth: false
});
const DEFUALT_TC_SERVANT_SETTING = {
  treasure_lv: 1,
  skill_lvs: [1, 1, 1],
  treasure_oc: 1,
  sr_treasure_lv: 1,
  ssr_treasure_lv: 1,
  else_treasure_lv: 5,
  skill_mode: '1'
};
const DEFUALT_EXTRA_BUFFS = {
  support: [],
  craft_essence: [],
  clothes: [],
  costom: {
    value: {
      atk: 0,
      atk_buff: 0,
      def_debuff: 0,
      extra_damage: 0,
      trea_buff: 0,
      buster_buff: 0,
      quick_buff: 0,
      arts_buff: 0
    }
  }
};
const Cache = new cache(CACHE_NAME);
const state = {
  servant_map: Cache.getData('servant_map') || {},
  material_map: Cache.getData('material_map') || {},
  material_calc_result: {},
  tc_servant_setting:
    Cache.getData('tc_servant_setting') || DEFUALT_TC_SERVANT_SETTING,
  tc_extra_buffs: Cache.getData('tc_extra_buffs') || DEFUALT_EXTRA_BUFFS,
  tc_custom_mode: Cache.getData('tc_custom_mode') || false,
  tc_appoint_servant: Cache.getData('tc_appoint_servant') || false,
  tc_enemy: Cache.getData('tc_enemy') || {},
  infos: {
    userID: -1,
    userName: '',
    userAvatar: ''
  }
};
const getters = {
  getServantSettingById: state => servantID => {
    return state.servant_map[servantID];
  },
  isLogin({ infos }) {
    return infos.userID > 0;
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
  },
  updateTreasureCalcSetting(state, { key, data }) {
    key = `tc_${key}`;
    if (state[key] === undefined || isEqual(state[key], data)) return;
    state[key] = data;
    Cache.addData(key, data, 0);
  },
  SET_INFO(state, infos) {
    state.infos = Object.assign(state.infos, infos);
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
  },
  setInfo({ commit }, infos) {
    commit('SET_INFO', infos);
  },
  clearInfo({ commit }) {
    commit('SET_INFO', {
      userID: -1,
      userName: '',
      userAvatar: ''
    });
  }
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
