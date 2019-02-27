import Api from '../Api';
import { controller, get } from '../decorator/decorator';
import {
  SERVANT_LIST,
  SERVANT_INFO,
  SERVANT_TREASURE_LIST,
  SERVANT_MATERIAL_NEEDS
} from '../config/url';
//import { Toast } from 'vant';

@controller('')
class EventApi extends Api {
  constructor() {
    super(EventApi);
  }

  @get(SERVANT_LIST, false, {
    cache_key: 'SERVANT_LIST'
    //cache_expried: 2 * 24 * 60 * 60 * 1e3
  })
  async _getServantList(params) {
    params.abnormal = () => {};
    return await this.common(params);
  }

  async servantList(order = 'desc') {
    return await this._getServantList({
      ignore_cache: 1,
      params: {
        order: JSON.stringify({
          id: order
        })
      }
    });
  }

  @get(SERVANT_TREASURE_LIST, false, {
    cache_key: 'SERVANT_TREASURE_LIST'
    //cache_expried: 2 * 24 * 60 * 60 * 1e3
  })
  async _servantListForTreasureCalc(params) {
    params.abnormal = () => {};
    return await this.common(params);
  }

  async servantListForTreasureCalc() {
    return await this._servantListForTreasureCalc({
      ignore_cache: 1
    });
  }

  @get(SERVANT_INFO, false, {
    cache_expried: 2 * 24 * 60 * 60 * 1e3
  })
  async _getInfo(params) {
    // params = Object.assign({ ignore_cache: 1 }, params);
    params.abnormal = () => {};
    return await this.common(params);
  }
  async info(id) {
    return await this._getInfo({
      data: {
        id
      }
    });
  }

  @get(SERVANT_MATERIAL_NEEDS, false, {
    cache_expried: 0
  })
  async _getMaterialNeeds(params) {
    params.abnormal = () => {};
    return await this.common(params);
  }

  materialNeeds(id) {
    return this._getMaterialNeeds({
      data: {
        id
      }
    });
  }
}

export default new EventApi();
