/**
 * 过滤器
 * @param {*} data 目标数据
 * @param {*} searchObj 过滤条件
 */

export const search = (data, searchObj) => {
  let output = false;
  for (let key of Object.keys(searchObj)) {
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

export const materialCal = (materialNeeds, prevSetting, currSetting) => {
  //materialNeeds = JSON.parse(JSON.stringify(materialNeeds));
  const calcFuns = {
    getCloth(prevVal, currVal) {
      if (prevVal || !currVal) return [];
      return materialNeeds.find(val => val[0] === '31')[1];
    },
    lvs(prevVal, currVal) {
      return currVal.reduce((pArr, cVal, idx) => {
        let pVal = prevVal[idx];
        if (cVal - pVal <= 0) return pArr;
        cVal += 20;
        pVal += 20;
        let _arr = materialNeeds
          .filter(([val]) => val - pVal >= 0 && cVal - val > 0)
          .reduce((prev, [, currArr]) => [...prev, ...currArr], []);
        return [...pArr, ..._arr];
      }, []);
    },
    state(prevVal, currVal) {
      if (prevVal - currVal >= 0) return [];
      prevVal += 10;
      currVal += 10;
      return materialNeeds
        .filter(([val]) => val - prevVal > 0 && currVal - val >= 0)
        .reduce((prev, [, currArr]) => [...prev, ...currArr], []);
    }
  };
  return Object.entries(currSetting)
    .reduce((prevArr, [key, currSet]) => {
      calcFuns[key](prevSetting[key], currSet).map(_val => {
        _val = JSON.parse(JSON.stringify(_val));
        let _idx = prevArr.findIndex(val => val.materialId === _val.materialId);
        _val.state = [[_val.state, _val.count, 1]];
        if (_idx > -1) {
          prevArr[_idx].count += _val.count;
          let _s_idx = prevArr[_idx].state.findIndex(
            ([state]) => state === _val.state[0][0]
          );
          if (_s_idx < 0)
            prevArr[_idx].state = [...prevArr[_idx].state, ..._val.state];
          else prevArr[_idx].state[_s_idx][2] += 1;
        } else prevArr.push(_val);
      });
      return prevArr;
    }, [])
    .sort((a, b) => a.materialId - b.materialId);
};
