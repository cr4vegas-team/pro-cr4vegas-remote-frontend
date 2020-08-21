export const environment = {
	production: true,
  hmr: false,
  api: 'http://localhost:8881/api/',
	mqtt: {
		server: '127.0.0.1',
		protocol: "ws",
		port: 8083,
		path: '/mqtt',
	}
};
