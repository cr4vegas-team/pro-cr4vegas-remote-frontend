
export const environment = {
	production: true,
	hmr: false,
	api: 'https://cr4v-api.rubenfgr.com/api/',
	mqtt: {
		hostname: 'cr4v-emqx-ws.rubenfgr.com',
		protocol: "wss",
		port: 8083,
		path: '/mqtt',
	}
};
