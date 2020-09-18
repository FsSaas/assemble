import store from '../../store';

export default name => {
  let { components } = store;
  let [cmp] = components.filter(it => it.name == name);
  if (!cmp) {
    throw new Error('未找到组件: ' + name);
  }
  // UMD 加载的组件，组件在 default 属性内
  let CmpClass = cmp.class;
  if (typeof CmpClass !== 'function' && !!CmpClass.default) {
    CmpClass = CmpClass.default
  }
  return CmpClass;
}
