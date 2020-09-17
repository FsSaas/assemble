
let components = [];
let loadPromises

export default components => {
  const loadPromises = components.map(it => {
    let { name, 'source': { type, uri, path } } = it;
    if (type == 'uri') {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = uri;
        script.async = false;
        document.body.appendChild(script);
        script.onload = () => {
          resolve({
            name, 'class': window[path]
          });
        }
      })
    } else if (type == 'local') {
      return Promise.resolve({
        name, 'class': window[path]
      });
    }
  });
  loadPromises = Promise.all(loadPromises)
    .then(cmps => components = cmps);
  return loadPromises;
}

export const getComponent = name => {
  loadPromises.then(cmps => {
    debugger
  })
}