import axios from 'axios';
import Qs from 'qs';
import BASE_URL from './config/baseUrl';
export default class BaseApi {
  static isInit = false;
  constructor() {
    this.createAxios();
    this.initNotice();
  }
  createAxios() {
    if (BaseApi.isInit) {
      return (this.axios = BaseApi.isInit);
    }
    let api = axios.create({
      url: '',
      method: 'post',
      baseURL: BASE_URL,
      withCredentials: true,
      timeout: 100000,
      transformRequest: [
        function(data) {
          // 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs（这个模块在安装axios的时候就已经安装了，不需要另外安装）
          data = Qs.stringify(data);
          return data;
        }
      ],
      transformResponse: [
        function(data) {
          // 这里提前处理返回的数据
          //console.log(data)
          try {
            return JSON.parse(data);
          } catch (e) {
            return data;
          }
        }
      ],
      // 请求头信息
      headers: {},

      // parameter参数
      params: {},

      // post参数，使用axios.post(url,{},config);如果没有额外的也必须要用一个空对象，否则会报错
      data: {},
      // 设置超时时间
      timeout: 5000,
      // 返回数据类型
      responseType: 'json' // default
    });
    api.defaults.headers.post['Content-Type'] =
      'application/x-www-form-urlencoded;charset=utf-8';
    api.interceptors.request.use(
      config => {
        return this.request(config);
      },
      err => {
        return this.reject(err);
      }
    );
    api.interceptors.response.use(
      response => {
        return this.response(response);
      },
      error => {
        return this.reject(error.response);
      }
    );
    BaseApi.isinIt = this.axios = api;
  }
  request() {
    throw Error('必须实现request函数！！！');
  }
  response() {
    throw Error('必须实现response函数！！！');
  }
  reject() {
    throw Error('必须实现reject函数！！！');
  }
  initNotice() {
    throw Error('必须实现通知函数！！！');
  }
}
