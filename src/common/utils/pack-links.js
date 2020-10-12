import Link from '../class/link';
import history from '../../history';

export default links => {
  let linkInstances = {};

  // 拼装yml配置的相关页面
  for (let i = 0; i < links.length; i++) {
    let it = links[i];
    linkInstances[it.name] = new Link(it);
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
