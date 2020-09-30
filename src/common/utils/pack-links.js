import Link from '../class/link';
import history from '../../history';

export default links => {
  let linkInstances = {};

  // 拼装yml配置的相关页面
  for (let i = 0; i < links.length; i++) {
    let it = links[i], itObj = {};
    if (typeof it == 'string') {
      itObj['name'] = it;
      itObj['value'] = it;
      linkInstances[it] = new Link(itObj);
    } else if (typeof it == 'object') {
      let [key] = Object.keys(it);
      itObj['name'] = key;
      itObj['value'] = it[key];
      linkInstances[key] = new Link(itObj);
    }
  }

  // 添加通用api
  linkInstances['go'] = path => {
    history.push(path);
  }

  // 添加通用api
  linkInstances['goBack'] = () => {
    history.goBack();
  }

  return linkInstances;
}
