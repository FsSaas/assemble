
export default (uri, callback) => {
  let head = document.getElementsByTagName('head')[0];
  const script = document.createElement('script');
  script.src = uri;
  script.async = false;
  // script.crossOrigin = "anonymous";
  script.onload = () => { callback() };
  head.appendChild(script);
}
