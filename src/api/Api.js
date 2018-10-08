import BaseApi from './BaseApi';
import { SUCCESS, LOGIN_OUT, ABNORMAL } from './config/code';
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
    console.error(error);
  }
  before() {}

  after() {}
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
  showNotice({ message, position, duration, className, type }) {
    duration = duration || 1500;
    Toast[type]({ message, position, duration });
  }
  async common(param) {
    let _config = Object.assign({}, param);
    await this.before(_config);
    let res;
    try {
      let result = await this.axios(param.url, _config);
      res = res = result && result.data ? result.data : null;
      if (
        !res.response ||
        !res.resultCode ||
        ABNORMAL.includes(res.resultCode)
      ) {
        param.abnormal
          ? param.abnormal(param, res)
          : this.abnormal(res.msg || '请求返回格式不标准');
      } else if (LOGIN_OUT.includes(res.resultCode)) {
        this.loginOut();
      } else if (SUCCESS.includes(res.resultCode)) {
        param.successNotice
          ? this.showNotice({
              message: res.msg,
              type: 'success'
            })
          : '';
        param.success ? param.success(res) : '';
      } else {
        param.error ? param.error(res, param) : this.error(res.msg);
      }
    } catch (e) {
      console.error(e);
      if (!window.phoneListener)
        param.error ? param.error(res, param) : this.error('程序在开小差');
      throw Error('程序在开小差');
    }
    await this.after();
    return res;
  }
}
