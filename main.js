let electron = require("electron");
let AppStarter = require("./src/AppStarter");

console.log("main.js: starting up electron application.");
AppStarter["default"].main(electron.app);
