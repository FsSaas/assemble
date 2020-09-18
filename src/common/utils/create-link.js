
export default uri => {
  let head = document.getElementsByTagName('head')[0];
  let link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = uri;
  link.media = 'all';
  // link.crossOrigin = "anonymous";
  head.appendChild(link);
}
