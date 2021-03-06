import { getConfig } from '../../store';

export default name => {
  let { pages } = getConfig();
  let [page] = pages.filter(it => it.name == name);
  if (!page) {
    throw new Error('未找到页面: ' + page);
  }
  let { components, layout, ...rest } = page;
  return rest;
}
