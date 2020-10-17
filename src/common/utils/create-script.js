
const replaceHost = uri => {
  if (window.loadStaticFromPathRoot) {
    return uri.replace(/(http[s]*:){0,1}\/\/[\s\S]+?\//, './');
  } else {
    return uri;
  }
}

export default (uri, callback) => {
  let head = document.getElementsByTagName('head')[0];
  const script = document.createElement('script');
  script.src = replaceHost(uri);
  script.async = false;
  // script.crossOrigin = "anonymous";
  script.onload = () => { callback() };
  head.appendChild(script);
}
