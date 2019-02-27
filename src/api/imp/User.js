import Api from '../Api';
import { controller, post, get } from '../decorator/decorator';
import { LOGIN, CHECK_LOGIN, LOGOUT, DATA } from '../config/url';
import { Toast } from 'vant';
import store from '@/store';
@controller('')
class EventApi extends Api {
  constructor() {
    super(EventApi);
  }
  reject(err) {
    Toast.clear();
    throw err;
  }
  @post(LOGIN, false)
  async _login(params) {
    params.loading_message = '登录中...';
    params.abnormal = () => {};
    params.success = () => {
      Toast.success({
        message: '登录成功',
        duration: 1500
      });
    };
    params.error = err => {
      let message = err.request.statusText;
      if (err.status === 401) {
        message = 'ID/密码不匹配';
      }
      Toast.fail({
        message,
        duration: 1500
      });
    };
    return await this.common(params);
  }
  after() {
    return new Promise(resolve => {
      //Indicator.close();
      //Toast.clear();
      resolve();
    });
  }
  login({ userID, password }) {
    return this._login({
      data: {
        userID,
        password
      }
    });
  }
  @get(CHECK_LOGIN)
  _checkLogin(params) {
    params.abnormal = () => {};
    params.error = (e, params) => {};
    return this.common(params);
  }
  checkLogin() {
    return this._checkLogin({}).then(info => {
      store.dispatch('userData/setInfo', info);
      return info;
    });
  }
  @get(LOGOUT)
  _logout(params) {
    params.abnormal = () => {};
    return this.common(params).then(res => {
      store.dispatch('userData/clearInfo');
      return res;
    });
  }
  logout() {
    return this._logout({});
  }
  @get(DATA)
  _getData(params) {
    params.loading_message = '同步中...';
    params.abnormal = () => {};
    return this.common(params);
  }
  getData() {
    return this._getData({}).then(res => {
      res.materialMap = JSON.parse(res.materialMap);
      res.servantMap = JSON.parse(res.servantMap);
      return res;
    });
  }
  @post(DATA)
  _uploadData(params) {
    params.loading_message = '上传中...';
    params.abnormal = () => {};
    return this.common(params);
  }
  uploadData() {
    let data = {
      servantMap: JSON.stringify(store.state.userData.servant_map),
      materialMap: JSON.stringify(store.state.userData.material_map)
    };
    return this._uploadData({
      data
    });
  }
}
export default new EventApi();
