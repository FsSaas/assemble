
const store = {
  'config': {},
  'components': [],
  'metadatas': {}
};

export default store;

export const getConfig = () => {
  return store.config;
}

export const getMetadata = name => {
  return store.metadatas[name];
}
