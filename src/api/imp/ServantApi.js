import Api from '../Api';
import { controller, get } from '../decorator/decorator';
import {
  SERVANT_LIST,
  SERVANT_INFO,
  SERVANT_TREASURE_LIST,
  SERVANT_MATERIAL_NEEDS
} from '../config/url';
import { Toast } from 'vant';

@controller('')
class EventApi extends Api {
  constructor() {
    super(EventApi);
  }
  before(config) {
    if (!config.not_show_loading)
      Toast.loading({
        message: '加载中...',
        duration: 0
      });
    //Indicator.open('加载中...');
  }
  after() {
    return new Promise(resolve => {
      //Indicator.close();
      Toast.clear();
      resolve();
    });
  }

  @get(SERVANT_LIST, true, {
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

  @get(SERVANT_TREASURE_LIST, true, {
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

  @get(SERVANT_INFO, true, {
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

  @get(SERVANT_MATERIAL_NEEDS, true, {
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
