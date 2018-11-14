import {
  getConfig,
  addExtraBuffs,
  enemyDamage,
  treasureDamage
} from './CalcObject';
import { curry } from 'lodash';
const _ = curry.placeholder;
const ENEMY = Symbol('enemy');
const EXTRA_BUFFS = Symbol('extra_buff');
const SERVANT_CONF = Symbol('ser_conf');

const _calcTreaDamage = curry((servant, enemy, extra_buff, servant_conf) => {
  servant_conf = servant_conf || {};
  let { treasure_lv, treasure_oc, open_event, skill_lvs } = servant_conf;
  treasure_lv = treasure_lv || 1;
  treasure_oc = treasure_oc || 1;
  open_event = open_event || 1e6;
  skill_lvs = skill_lvs || [1, 1, 1];
  let buffs_obj = enemyDamage(
    addExtraBuffs(getConfig({ ...servant_conf, data: servant }), extra_buff),
    enemy
  );
  let damage_list = treasureDamage(buffs_obj);
  return {
    buffs: buffs_obj,
    servant: {
      class: servant.class,
      name: servant.name,
      imgPath: servant.imgPath,
      id: servant.id
    },
    treaEffect: servant.treaEffect,
    damage: damage_list
  };
});

export default class treasureCalc {
  constructor({ enemy, extra_buff, servant_conf } = {}) {
    this[ENEMY] = undefined;
    this[EXTRA_BUFFS] = undefined;
    this[SERVANT_CONF] = undefined;
    this.setEnemy(enemy)
      .setExtraBuffs(extra_buff)
      .setServantConfig(servant_conf);
  }

  setEnemy({ class: clazz, addition } = {}) {
    if (!clazz || !addition) return this;
    addition = Array.isArray(addition) ? JSON.stringify(addition) : addition;
    this[ENEMY] = {
      class: clazz,
      addition
    };
    return this;
  }
  setExtraBuffs(buffs) {
    if (!buffs) return this;
    this[EXTRA_BUFFS] = buffs;
    return this;
  }

  setServantConfig({ treasure_lv, treasure_oc, skill_lvs, open_event } = {}) {
    if (treasure_lv || treasure_oc || skill_lvs || open_event)
      this[SERVANT_CONF] = {
        treasure_lv,
        treasure_oc,
        skill_lvs,
        open_event
      };
    return this;
  }
  calcFun() {
    let args = [_, _, _, _];
    if (this[ENEMY]) args[1] = this[ENEMY];
    if (this[EXTRA_BUFFS]) args[2] = this[EXTRA_BUFFS];
    if (this[SERVANT_CONF]) args[3] = this[SERVANT_CONF];
    return _calcTreaDamage(...args);
  }
}
