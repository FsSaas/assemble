const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { readdirSync, lstatSync } = fs;

const readExamples = dir => {
  const epath = path.join(dir, 'examples');
  if (!fs.existsSync(epath)) return [];
  return readdirSync(epath)
    .filter(it => {
      let fpath = path.join(epath, it);
      return lstatSync(fpath).isDirectory();
    })
    .map(name => ({ name }))
    .filter(file => !file.name.match(/^\./));
}

const readFileContent = (cp) => {
  return fs.existsSync(cp) ? fs.readFileSync(cp, 'utf8') : '';
}

module.exports = () => {
  const { name, version, description } = require('./package.json');
  const cmpName = name.replace(/@/, '').replace(/\//, '-');
  const examples = readExamples(__dirname);

  let body = {
    'name': cmpName,
    'npm': name,
    'version': version,
    'description': description,
    'repository': gitssh,
    'document': readFileContent(path.join(__dirname, 'README.md')),
    'examples': '[]',
    'assets': JSON.stringify({ 'js': replaceKeyword(assets, keywordOpts) || '' }),
  }

  let dataExamples = [];
  if (examples.length) {
    dataExamples = examples.map(({ name }) => {
      return {
        name,
        'js': readFileContent(path.join(__dirname, 'examples', name, 'index.js')),
        'css': readFileContent(path.join(__dirname, 'examples', name, 'index.css')),
        'screenshot': replaceKeyword(screenshotPath, Object.assign({}, keywordOpts, { 'exampleName': name })),
        'view': replaceKeyword(examplePath, Object.assign({}, keywordOpts, { 'exampleName': name }))
      }
    });
  }
  body.examples = JSON.stringify(dataExamples);

  return fetch('http://182.92.157.77:7003/api/v1/components', {
    'body': JSON.stringify(body),
    'headers': {
      'Content-Type': 'application/json'
    },
  }).then(res => res.json())
    .then(res => {
      if (res.code == 1) {
        throw new Error(res.error);
      }
      console.log(res);
    }).catch(err => {
      throw err;
    })
}


