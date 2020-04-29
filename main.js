"use strict";
exports.__esModule = true;
console.log("main.ts");
var electron_1 = require("electron");
var ElectronHandler_1 = require("./ElectronHandler");
ElectronHandler_1["default"].main(electron_1.app, electron_1.BrowserWindow);
