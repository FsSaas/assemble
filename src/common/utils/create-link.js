
const replaceHost = uri => {
  if (window.loadStaticFromPathRoot) {
    return uri.replace(/(http[s]*:){0,1}\/\/[\s\S]+?\//, './');
  } else {
    return uri;
  }
}

export default uri => {
  let head = document.getElementsByTagName('head')[0];
  let link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = replaceHost(uri);
  link.media = 'all';
  // link.crossOrigin = "anonymous";
  head.appendChild(link);
}
