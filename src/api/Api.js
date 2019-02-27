import BaseApi from './BaseApi';
//import { SUCCESS, LOGIN_OUT, ABNORMAL } from './config/code';
import { Toast } from 'vant';
import { symbolContext } from './decorator/decorator';
//import store from '@/store';

export default class Api extends BaseApi {
  constructor(target) {
    super();
    if (target) {
      this.context.call(this, target);
    }
  }
  context(target) {
    target.prototype[symbolContext] = this;
  }
  initNotice() {
    this.Notice = Toast;
  }
  request(config) {
    return config;
  }

  response(response) {
    //store.commit('setDTime', response.headers.date);
    return response;
  }
  loginOut() {
    console.warn('loginout方法未实现');
  }
  reject(error) {
    Toast.clear();
    throw error;
  }
  before(config) {
    if (!config.not_show_loading)
      this.loading(config.loading_message || '加载中...');
  }

  after() {}

  loading(message) {
    this.showNotice({
      message,
      duration: 0,
      type: 'loading'
    });
  }
  abnormal(message) {
    this.showNotice({
      message,
      type: 'fail'
    });
  }

  error(message) {
    this.showNotice({
      message,
      type: 'fail'
    });
  }
  showNotice({ message, position, duration, type }) {
    duration = duration || 1500;
    position = position || 'middle';
    Toast[type]({ message, position, duration });
  }
  async common(param) {
    let _config = Object.assign({}, param);
    await this.before(_config);
    let res;
    try {
      let result = await this.axios(param.url, _config);
      res = result && result.data ? result.data : null;
      param.successNotice
        ? this.showNotice({
            message: res.msg || '加载完成',
            type: 'success'
          })
        : Toast.clear();
      param.success ? param.success(res) : '';
    } catch (e) {
      if (param.error) {
        Toast.clear();
        param.error(e, param);
      } else this.error('网络连接失败');
      res = Promise.reject(e);
    }
    await this.after();
    return res;
  }
}
