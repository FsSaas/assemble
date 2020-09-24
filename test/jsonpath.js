const jp = require('jsonpath');

const jsonp = (data, newData) => {
  if (Array.isArray(data)) {
    let res = [];
    for (let i=0; i<data.length; i++) {
      let r = jsonp(data[i], newData);
      res.push(r);
    }
    return res;
  } else if (typeof data == 'object') {
    for (let it of Object.entries(newData)) {
      let [key, value] = it;
      if (typeof value == 'object') {
        value = jsonp(data, value)
      } else if (typeof value == 'string') {
        [value] = jp.query(data, value);
      }
      newData[key] = value;
    }
  }
  return newData;
}

const dataInput = [{
  'name': 'zhang3',
  'config': {
    'desc': 'body 19'
  }
}, {
  'name': 'zhang4',
  'config': {
    'desc': 'body 20'
  }
}]

let data = jsonp(dataInput, {
  'name': '$[*].name',
  'desc': '$[*].config.desc',
  'other': {
    'name': '$[*].name',
    'desc': '$[*].config.desc',
  }
});

console.log(data);
