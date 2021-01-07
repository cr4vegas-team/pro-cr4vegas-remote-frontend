// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const host = 'http://172.31.228.154:8881';
// export const host = 'http://server.rubenfgr.com:8881';

export const environment = {
  production: false,
  hmr: false,
  api: host + '/api/',
  ws: {
    url: 'ws://172.31.228.154:8882',
    // url: 'ws://server.rubenfgr.com:8882',
    options: {},
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
