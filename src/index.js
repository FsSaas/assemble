import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import createLink from './common/utils/create-link';
import createScript from './common/utils/create-script';

// 加载 App 所需JS和CSS文件
async function loadExternals() {
  for (let it of window.app.externals) {
    let { type, uri } = it;
    if (type == 'script') {
      await createScript(uri);
    } else if (type == 'style') {
      await createLink(uri);
    }
  }
}

Promise.resolve(loadExternals()).then(() => {
  ReactDOM.render(
    React.createElement(App, { 'config': window.app }),
    document.getElementById('root')
  );
})
