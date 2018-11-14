let citys = {
  浙江: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
  福建: ['福州', '厦门', '莆田', '三明', '泉州']
};

function fmtColums(data, selectedIndexs = [], columns = []) {
  let _idx = selectedIndexs.shift() || 0;
  if (Array.isArray(data)) {
    columns.push({
      values: data,
      defaultIndex: _idx
    });
    return columns;
  } else {
    let keys = Object.keys(data);
    columns.push({ values: keys, defaultIndex: _idx });
    return fmtColums(data[keys[_idx]], selectedIndexs, columns);
  }
}

console.log(fmtColums(citys, [1]));
