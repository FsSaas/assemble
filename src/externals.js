export default uris => {
  const uriPromies = uris.map(it => {
    return new Promise((resolve, reject) => {
      let { type, uri } = it;
      let head = document.getElementsByTagName('head')[0];
      let tag;
      if (type == 'script') {
        tag = document.createElement('script');
        tag.src = uri;
        tag.async = false;
      } else if (type == 'style') {
        tag = document.createElement('link');
        tag.rel = 'stylesheet';
        tag.type = 'text/css';
        tag.href = uri;
        tag.media = 'all';
      }
      head.appendChild(tag);
      tag.onload = () => {
        resolve(it);
      }
    })
  });
  return Promise.all(uriPromies);
}