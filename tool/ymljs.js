let workflow;
(function () {
  const yaml = require('js-yaml');
  const fs = require('fs');
  workflow = yaml.safeLoad(fs.readFileSync(`${__dirname}/meta.yml`, 'utf8'));
})();
console.log('window.app = ' + JSON.stringify(workflow));
