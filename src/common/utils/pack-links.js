import Link from '../class/link';

export default links => {
  let linkInstances = [];
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
  return linkInstances;
}
