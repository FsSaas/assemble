
export default (deps = [], object) => {
  if (!deps.length) return {};
  let res = {};
  for (let i = 0; i < deps.length; i++) {
    let kv = deps[i];
    if (typeof kv == 'string') kv = { [kv]: key };
    let [key] = Object.keys(kv);
    res[key] = object[key];
  }
  return res;
}
