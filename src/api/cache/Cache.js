const CACHE_DATA = Symbol('cache_data');
const SAVE = Symbol('save');
const CACHE_DATA_NAME = '__cache_datas';
let user_id = localStorage.userID || 0;
class Cache {
  constructor() {
    if (!localStorage.getItem(CACHE_DATA_NAME + '_' + user_id)) {
      localStorage.setItem(CACHE_DATA_NAME + '_' + user_id, '{}');
    }
    this[CACHE_DATA] = JSON.parse(
      localStorage.getItem(CACHE_DATA_NAME + '_' + user_id)
    );
  }
  [SAVE]() {
    localStorage.setItem(
      CACHE_DATA_NAME + '_' + user_id,
      JSON.stringify(this[CACHE_DATA])
    );
  }
  /**
   * 添加项
   * @param {*} key
   * @param {*} value
   * @param {*} expried
   */
  addData(key, value, expried) {
    if (typeof (expried * 1) === 'number' && expried > 0) expried = new Date().getTime() + expried * 1;
    else expried = 1e13;
    if (!key || !value) {
      throw Error('必须有key和value！！！');
    }
    this[CACHE_DATA][key] = {
      value,
      expried
    };
    this[SAVE]();
  }
  /**
   * 删除项
   * @param {*} key
   */
  removeData(key) {
    delete this[CACHE_DATA][key];
    this[SAVE]();
  }

  /**
   * 获得项
   * @param {*} key
   */
  getData(key) {
    let now = new Date();
    if (!this[CACHE_DATA][key]) return undefined;
    else if (this[CACHE_DATA][key].expried - now < 0) {
      this.removeData(key);
      return undefined;
    }
    return this[CACHE_DATA][key].value;
  }
  /**
   * 重置
   */
  resetCache() {
    this[CACHE_DATA] = {};
    this[SAVE]();
  }
}

export default new Cache();
