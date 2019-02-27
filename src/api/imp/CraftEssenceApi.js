import Api from '../Api';
import { controller, get } from '../decorator/decorator';
import { CRAFT_ESSENCE_LIST, CRAFT_ESSENCE_INFO } from '../config/url';

@controller('')
class EventApi extends Api {
  constructor() {
    super(EventApi);
  }

  @get(CRAFT_ESSENCE_LIST, false, {
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

  @get(CRAFT_ESSENCE_INFO, false, {
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
