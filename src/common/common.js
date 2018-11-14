/**
 * 过滤器
 * @param {*} data 目标数据
 * @param {*} searchObj 过滤条件
 */
export const search = (data, searchObj) => {
  let output = false;
  for (let key of Object.keys(searchObj)) {
    let isBreak = false;
    let _obj = searchObj[key];
    let _match_keys = _obj.match_keys || [key],
      _match_mode = _obj.match_mode,
      querys = _obj.querys;
    for (let _key of _match_keys) {
      let isArray = false;
      let _data = data[_key];
      if (Array.isArray(_data)) {
        _data = JSON.stringify(_data);
        isArray = true;
      }
      for (let _query of querys) {
        if (typeof _query === 'string') {
          _query = _query.trim();
          if (!_query) continue;
          if (isArray) {
            _query = _query
              .split('|')
              .map(val => (_match_mode === 'equal' ? `"${val}"` : `${val}`))
              .join('|');
            _query = new RegExp(_query, 'i');
          } else if (_match_mode === 'equal') {
            _query = new RegExp('^' + _query + '$', 'i');
          } else _query = new RegExp(_query, 'i');
        }
        if (_query.test(_data)) {
          output = true;
        } else {
          output = false;
          isBreak = true;
          break;
        }
      }
      if (output) break;
    }
    if (!output) break;
  }
  return output;
};

export const percentage = num => {
  return num * 100 + '%';
};
