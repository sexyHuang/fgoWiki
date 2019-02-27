import Cache from './cache';
export const symbolPrefix = Symbol('prefix');
export const symbolContext = Symbol('context');
export function controller(path) {
  return target => {
    target.prototype[symbolPrefix] = path;
    target.prototype[symbolContext] = null;
  };
}
function baseMethods(
  target,
  key,
  descriptor,
  name,
  path,
  successNotice,
  cacheSetting
) {
  if (cacheSetting) {
    let { cache_key, cache_expried } = cacheSetting;
    _cache(target, key, descriptor, cache_key, cache_expried);
  }
  let method = descriptor.value;
  descriptor.value = async arg => {
    let _path = path;
    arg.successNotice = successNotice;

    if (name === 'get') {
      let _data = arg.data || {};
      for (let key of Object.keys(_data)) {
        if (_path.indexOf(`:${key}`) >= 0) {
          _path = _path.replace(`:${key}`, encodeURIComponent(_data[key]));
          delete _data[key];
        }
      }
    }
    arg.ache_id = _path;
    arg.url = target[symbolPrefix] ? target[symbolPrefix] + _path : _path;
    arg.method = name;

    return method.call(target[symbolContext], arg);
  };
}
export function get(path, successNotice, cacheSetting) {
  return function(target, key, descriptor) {
    baseMethods(
      target,
      key,
      descriptor,
      'get',
      path,
      successNotice,
      cacheSetting
    );
  };
}
export function post(path, successNotice, cacheSetting) {
  return function(target, key, descriptor) {
    baseMethods(
      target,
      key,
      descriptor,
      'post',
      path,
      successNotice,
      cacheSetting
    );
  };
}

export function autoAddUserInfo(target, key, descriptor) {
  let method = descriptor.value;
  descriptor.value = async arg => {
    arg.data = arg.data || {};
    let _add = {
      user_id: 54545 //localStorage.userID
    };
    arg.data = Object.assign(_add, arg.data);
    return await method.call(target[symbolContext], arg);
  };
}

function _cache(target, key, descriptor, cache_key = '', cache_expried) {
  let method = descriptor.value;
  descriptor.value = async (arg = {}) => {
    let _cache_key = cache_key;
    if (!_cache_key) {
      _cache_key = arg.ache_id;
    }
    let cache_data = Cache.getData(_cache_key);
    if (cache_data) {
      switch (arg.ignore_cache) {
        case 1: {
          let res;
          arg.not_show_loading = true;
          try {
            res = await method.call(target[symbolContext], arg);
            Cache.addData(_cache_key, res, cache_expried);
          } catch (E) {
            res = cache_data;
          }

          return Promise.resolve(res);
        }
        case 2:
          break;
        default:
          return Promise.resolve(cache_data);
      }
    }

    return method.call(target[symbolContext], arg).then(res => {
      Cache.addData(_cache_key, res, cache_expried);
      return res;
    });
  };
}
