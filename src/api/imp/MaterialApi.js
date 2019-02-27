import Api from '../Api';
import { controller, get } from '../decorator/decorator';
import { MATERIAL_LIST, MATERIAL_NEEDS } from '../config/url';
import { Toast } from 'vant';

@controller('')
class EventApi extends Api {
  constructor() {
    super(EventApi);
  }
  @get(MATERIAL_LIST, false, {
    cache_key: 'MATERIAL_LIST'
    //cache_expried: 2 * 24 * 60 * 60 * 1e3
  })
  async _getList(params) {
    params.abnormal = () => {};
    return await this.common(params);
  }

  async list() {
    return await this._getList({
      ignore_cache: 1
    });
  }

  @get(MATERIAL_NEEDS, false, {
    cache_expried: 10 * 60 * 1e3
  })
  async _needs(params) {
    // params = Object.assign({ ignore_cache: 1 }, params);
    params.abnormal = () => {};
    return await this.common(params);
  }
  async needs(id) {
    return await this._needs({
      data: {
        id
      }
    });
  }
}

export default new EventApi();
