/*
 * @Author: Sexy
 * @Date: 2018-10-23 13:40:24
 * @LastEditors: Sexy
 * @LastEditTime: 2018-11-14 18:06:41
 * @Description: file content
 */
import {
  ATK_FIX,
  RANDOM_FIX,
  CARD_MAP,
  CLASS_MAP,
  PARTY_MAP,
  PARTY_KEYS
} from './conf';

const CONFIG_MODE = JSON.stringify({
  treasure_rate: 0,

  trea_extra_damage: [],

  card_buff: 0,
  atk_buff: 0,
  trea_buff: 0,

  extra_damage: [],
  fixed_damage: 0,

  def_debuff: 0
});
const CONFIG_MAX = {
  trea_extra_damage: 100,
  card_buff: 4,
  extra_damage: 5,
  atk_buff: 100,
  trea_buff: 5,
  def_debuff: 1,
  fixed_damage: 100000
};

/**
 * 格式化从者伤害信息
 * @param {data, treasure_lv, treasure_oc, skill_lvs} param0
 */
export function getConfig({
  data,
  treasure_lv,
  treasure_oc,
  skill_lvs,
  open_event
}) {
  treasure_lv = treasure_lv || 1;
  treasure_oc = treasure_oc || 1;
  open_event = open_event || 1e6;
  skill_lvs = skill_lvs || [0, 0, 0];
  data = JSON.parse(JSON.stringify(data));
  let output = JSON.parse(CONFIG_MODE);
  let treasure = data.treasure.pop();
  if (treasure.open_event > open_event) treasure = data.treasure.pop();
  let treasure_type = treasure.treasure_type.toLowerCase();
  let t_effect = treasure.effect;
  output.treasure_type = treasure_type;
  output.card_rate = CARD_MAP[treasure_type];
  output.class = data.class.toLowerCase();
  output.class_fix = CLASS_MAP[output.class].fixed || 1;
  output.party = data.addition.match(/"(天|地|人|星|兽)"/)[1];
  output.atk = data.maxAtk + 1000;
  for (let _key of Object.keys(t_effect)) {
    let _item = t_effect[_key];
    if (!_item) continue;
    let effect = _item.effect[0];
    if (_item.mode === 'oc') effect = _item.effect[treasure_oc - 1];
    else if (_item.mode === 'lv') effect = _item.effect[treasure_lv - 1];
    effect = effect.replace('%', '') / 100;
    if (_key === 'trea_extra_damage') {
      output[_key].push({ effect, include: _item.include });
    } else if (output[_key] !== undefined) output[_key] += effect;
    else if (_key.indexOf(treasure_type) >= 0) output.card_buff += effect;
  }

  let _count = [0, 0, 0];
  (data.skill || [])
    .filter(val => {
      let { effect, type, idx, open_event: _open_event } = val;
      if (!_open_event || type == 0) return true;
      let _ret = false;
      if (open_event < _open_event && _count[idx] == 0) {
        _ret = true;
      } else if (open_event > _open_event && _count[idx] == 1) _ret = true;
      _count[idx]++;
      return _ret;
    })
    /* .map(val => {
      val.effect = JSON.parse(val.effect);
      return val;
    }) */
    .map(({ effect, type, idx }, _idx) => {
      if (skill_lvs[idx] === 0) return { effect, type, idx };
      let __skill_lv_idx =
        type == 1 && skill_lvs[_idx] ? skill_lvs[_idx] - 1 : 0;
      for (let _key of Object.keys(effect)) {
        let _item = effect[_key];

        if (_item && !Array.isArray(_item)) _item = [_item];
        if (!_item.length) continue;
        if (_key === 'extra_damage') {
          _item = _item.map(val => {
            val.effect = val.effects[__skill_lv_idx].replace('%', '') / 100;
            delete val.effects;
            return val;
          });
          output.extra_damage.push(..._item);
        } else if (_key == 'fixed_damage') {
          output.fixed_damage += _item[__skill_lv_idx];
        } else {
          let _effect;
          try {
            _effect =
              (_item[__skill_lv_idx] || _item[0]).replace('%', '') / 100;
          } catch (e) {
            throw new Error(data);
          }

          if (output[_key] !== undefined) output[_key] += _effect;
          else if (_key.indexOf(treasure_type) >= 0)
            output.card_buff += _effect;
        }
        //
      }
    });
  return output;
}

/**
 * @msg: 附加伤害buff
 * @param {*} data 从者伤害数据（getConfig()）
 * @param {*} buffs buff数据
 * @return {*}
 */
export function addExtraBuffs(data, buffs = {}) {
  if (!data || typeof data !== 'object' || !data.treasure_type)
    throw new Error('data 格式有误');
  data = JSON.parse(JSON.stringify(data));
  for (let buff_name of Object.keys(buffs)) {
    let _buff = buffs[buff_name];

    _buff = ('' + _buff).replace(/(\d+)%/, '.$1') * 1;
    if (typeof _buff !== 'number') {
      console.warn(` ${buff_name} 数据格式有误`);
      continue;
    }
    if (buff_name === 'extra_damage') {
      data[buff_name].push({
        include: '.*',
        effect: _buff
      });
    } else if (data[buff_name] !== undefined) {
      data[buff_name] += _buff;
    } else if (buff_name.indexOf(data.treasure_type.toLowerCase()) >= 0) {
      data.card_buff += _buff;
    }
  }
  return data;
}

/**
 * 对指定敌人的伤害数据
 * @param {*} servantData 从者伤害数据
 * @param {*} enemyData 敌人属性数据
 * @returns {*}
 */
export function enemyDamage(servantData, enemyData) {
  let {
    party: s_party,
    class: s_class,
    extra_damage,
    trea_extra_damage
  } = servantData;
  let { class: e_class, addition } = enemyData;
  let e_party = addition.match(/"(天|地|人|星|兽)"/)
    ? addition.match(/"(天|地|人|星|兽)"/)[1]
    : '';
  let _add_up = {
    extra_damage: 0,
    trea_extra_damage: 0
  };
  _add_up.class_comp_fix = CLASS_MAP[s_class][e_class.toLowerCase()] || 1;
  _add_up.party_fix = PARTY_MAP[PARTY_KEYS[s_party]][PARTY_KEYS[e_party]] || 1;
  for (let e_dam of extra_damage) {
    let i_reg = new RegExp(e_dam.include, 'i'),
      e_reg = e_dam.exclude ? new RegExp(e_dam.exclude, 'i') : '';
    if (i_reg.test(addition) && (!e_reg || !e_reg.test(addition)))
      _add_up.extra_damage += e_dam.effect;
  }
  for (let e_dam of trea_extra_damage) {
    let i_reg = new RegExp(e_dam.include, 'i'),
      e_reg = e_dam.exclude ? new RegExp(e_dam.exclude, 'i') : '';
    if (i_reg.test(addition) && (!e_reg || !e_reg.test(addition)))
      _add_up.trea_extra_damage += e_dam.effect;
  }
  return Object.assign({}, servantData, _add_up);
}

/**
 * 宝具伤害计算函数
 * @param {*} param0
 * @returns {min,max}
 */
export function treasureDamage({
  atk,
  treasure_rate,
  card_rate,
  card_buff,
  class_fix,
  class_comp_fix,
  party_fix,
  atk_buff,
  def_debuff,
  fixed_damage,
  trea_extra_damage,
  extra_damage,
  trea_buff
}) {
  const FIXED_ATK = atk * ATK_FIX * treasure_rate;
  const CARD_BUFFS =
    card_rate * (1 + Math.min(CONFIG_MAX.card_buff, card_buff || 0));
  const CNP_FIX = class_fix * class_comp_fix * party_fix;
  const ATK_DEF_BUFFS =
    1 + (atk_buff || 0) + Math.min(CONFIG_MAX.def_debuff, def_debuff || 0);
  const EXTRA_DAMAGE = Math.min(5, extra_damage || 0);
  const TREA_BUFF = Math.min(5, trea_buff || 0);
  const TREA_EXTRA_DAMAGE = Math.max(1, trea_extra_damage);

  let base =
    FIXED_ATK *
    CARD_BUFFS *
    CNP_FIX *
    ATK_DEF_BUFFS *
    (1 + EXTRA_DAMAGE + TREA_BUFF) *
    TREA_EXTRA_DAMAGE;
  return {
    min: Math.round(base * RANDOM_FIX[0] + (fixed_damage || 0)),
    max: Math.round(base * RANDOM_FIX[1] + (fixed_damage || 0)),
    avg: Math.round(
      base * (RANDOM_FIX[1] + RANDOM_FIX[0]) * 0.5 + (fixed_damage || 0)
    )
  };
}
