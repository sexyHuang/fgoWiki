import Api from '../Api';
import { controller, get } from '../decorator/decorator';
import { CRAFT_ESSENCE_LIST, CRAFT_ESSENCE_INFO } from '../config/url';
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

  @get(CRAFT_ESSENCE_LIST, true, {
    cache_key: 'CRAFT_ESSENCE_LIST'
    //cache_expried: 2 * 24 * 60 * 60 * 1e3
  })
  async _getList(params) {
    params.abnormal = () => {};
    return await this.common(params);
  }

  async list(order = 'desc') {
    return await this._getList({
      ignore_cache: 1,
      params: {
        order: JSON.stringify({
          id: order
        })
      }
    });
  }

  @get(CRAFT_ESSENCE_INFO, true, {
    cache_expried: 10 * 60 * 1e3
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
}

export default new EventApi();