import { Validator } from 'jsonschema';

let configSchema = {
  'type': 'object',
  'properties': {
    'resources': {
      'type': 'array',
      'items': {
        'properties': {
          'name': { 'type': 'string' },
          'type': { 'type': 'string' },
          'uri': { 'type': 'string' },
          'value': { 'types': ['object', 'string'] }
        },
        'required': ['name', 'type']
      }
    },
    'authorization': {
      'type': 'object',
      'properties': {
        'type': { 'type': 'string' },
        'access-token': { 'type': 'string' },
        'auth-pages': { 'types': ['string', 'object'] },
        'un-auth': {
          'type': 'object',
          'properties': {
            'redirect': { 'type': 'string' }
          },
          'required': ['redirect']
        },
        'required': ['type', 'un-auth']
      }
    },
    'externals': {
      'type': 'array',
      'items': {
        'properties': {
          'type': { 'type': 'string' },
          'uri': { 'type': 'string' }
        },
        'required': ['type', 'uri']
      }
    },
    'components': {
      'type': 'array',
      'items': {
        'properties': {
          'name': { 'type': 'string' },
          'type': { 'type': 'string' },
          'uri': { 'type': 'string' },
          'path': { 'type': 'string' }
        },
        'required': ['name', 'type', 'uri', 'path']
      }
    },
    'pages': {
      'type': 'array',
      'items': {
        'properties': {
          'name': { 'type': 'string' },
          'path': { 'type': 'string' },
          'layout': {
            'type': 'object',
            'properties': {
              'name': { 'type': 'string' },
              'resource-deps': { 'types': ['object', 'string'] },
              'statics': { 'type': 'object' },
              'resources': { 'type': 'array' },
            },
            'required': ['name']
          },
          'components': {
            'type': 'array',
            'items': {
              'name': { 'type': 'string' },
              'slot': { 'type': 'string' },
              'resource-deps': { 'types': ['object', 'string'] },
              'statics': { 'type': 'object' },
              'links': { 'types': ['object', 'string'] },
            },
            'required': ['name', 'slot']
          }
        },
        'required': ['name', 'path', 'components']
      }
    },
  },
  'required': ['components', 'pages']
};

export default config => {
  let v = new Validator();
  v.validate(config, configSchema, { 'throwError': true });
}