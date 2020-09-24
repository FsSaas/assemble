import jp from 'jsonpath';

/**
 * 通过数据和配置转换Json数据的结构
 * 返回新结构的JSON数据
 * @param {*} data 
 * @param {*} newData 
 */
export const parse = (data, newData) => {
  let _res = {};
  for (let it of Object.entries(newData)) {
    let [key, value] = it;
    if (typeof value == 'object') {
      value = parse(data, value)
    } else if (typeof value == 'string') {
      [value] = jp.query(data, value);
    }
    _res[key] = value;
  }
  return _res;
}

/**
 * 转换数组
 * @param {*} list 
 * @param {*} newData 
 */
export const parseArray = (list, newData) => {
  let res = [];
  for (let i=0; i<list.length; i++) {
    let d = parse(list[i], newData);
    res.push(d);
  }
  return res;
}

/**
 * 只支持一级数据，不支持递归数组解析
 */
export default (data, config) => {
  if (Array.isArray(data)) {
    return parseArray(data, config)
  } else {
    return parse(data, config);
  }
};
