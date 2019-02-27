const CACHE_DATA = Symbol('cache_data');
const CACHE_DATA_NAME = Symbol('cache_data_name');
const SAVE = Symbol('save');
const DEFAULT_CACHE_DATA_NAME = '__cache_datas';
const CACHE_TIMER = Symbol('cache_timer');
class Cache {
  constructor(cache_data_name) {
    this[CACHE_DATA_NAME] = cache_data_name || DEFAULT_CACHE_DATA_NAME;
    !localStorage.getItem(this[CACHE_DATA_NAME]) &&
      localStorage.setItem(this[CACHE_DATA_NAME], '{}');
    this[CACHE_DATA] = JSON.parse(localStorage.getItem(this[CACHE_DATA_NAME]));
  }
  [SAVE]() {
    localStorage.setItem(
      this[CACHE_DATA_NAME],
      JSON.stringify(this[CACHE_DATA])
    );
  }
  /**
   * 添加项
   * @param {*} key
   * @param {*} value
   * @param {*} expried
   */
  addData(key, value, expried, cacheNow = true) {
    clearTimeout(this[CACHE_TIMER]);
    if (typeof (expried * 1) === 'number' && expried > 0)
      expried = new Date().getTime() + expried * 1;
    else expried = 1e13;
    if (!key || value === undefined) {
      throw Error('必须有key和value！！！');
    }
    this[CACHE_DATA][key] = {
      value,
      expried
    };
    if (!cacheNow) {
      this[CACHE_TIMER] = setTimeout(() => {
        this[SAVE]();
      }, 0);
      return;
    }
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

export default Cache;
