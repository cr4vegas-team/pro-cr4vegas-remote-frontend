
export const host = 'http://192.168.1.134:8881';

export const environment = {
  production: true,
  hmr: false,
  api: host + '/api/',
  ws: {
    url: 'ws://192.168.1.134:8881',
    options: {},
  },
};
