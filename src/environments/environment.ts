// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  storage: "iturist",
  api: "http://192.168.2.175:8080/api/v1",
  // api: "http://vivat.sprava.net:7777/api/v1",
  socket_url: "192.168.2.175",
  socket_port: 9999,
  googleClientId: "187369116197-v6ek0vdicnaqnd97t3gnmkq9sgk73eu8.apps.googleusercontent.com"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
