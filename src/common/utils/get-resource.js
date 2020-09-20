import fetch from 'node-fetch';

export default async meta => {
  let { name, type, uri, value } = meta;

  return new Promise((resolve, reject) => {
  
    if (type == 'restful') {
  
      return fetch(uri, {
        'method': 'GET',
        'headers': {
          'content-type': 'application/json'
        }
      }).then(res => res.json())
      .then(value => {
        resolve({ name, value })
      });

    } else if (type == 'static') {
  
      return resolve({ name, value })
    }
  })
}