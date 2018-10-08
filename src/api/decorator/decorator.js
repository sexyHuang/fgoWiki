import Cache from './../cache/Cache';
export const symbolPrefix = Symbol('prefix');
export const symbolContext = Symbol('context');
export function controller(path) {
  return target => {
    target.prototype[symbolPrefix] = path;
    target.prototype[symbolContext] = null;
  };
}
function baseMethods(target, key, descriptor, name, path, successNotice) {
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
    if (cacheSetting)
      _cache(
        target,
        key,
        descriptor,
        cacheSetting.cache_key,
        cacheSetting.cache_expried
      );
    baseMethods(target, key, descriptor, 'get', path, successNotice);
  };
}
export function post(path, successNotice, cacheSetting) {
  return function(target, key, descriptor) {
    if (cacheSetting)
      _cache(
        target,
        key,
        descriptor,
        cacheSetting.cache_key,
        cacheSetting.cache_expried
      );
    baseMethods(target, key, descriptor, 'post', path, successNotice);
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

export function cache(cache_key = '', cache_expried) {
  return function(target, key, descriptor) {
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

            return new Promise(resolve => {
              console.log(res);
              resolve(res);
            });
          }
          case 2:
            break;
          default:
            return new Promise(resolve => {
              resolve(cache_data);
            });
        }
      }

      let res = await method.call(target[symbolContext], arg);
      Cache.addData(_cache_key, res, cache_expried);
      return res;
    };
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

          return new Promise(resolve => {
            console.log(res);
            resolve(res);
          });
        }
        case 2:
          break;
        default:
          return new Promise(resolve => {
            resolve(cache_data);
          });
      }
    }

    let res = await method.call(target[symbolContext], arg);
    Cache.addData(_cache_key, res, cache_expried);
    return res;
  };
}
