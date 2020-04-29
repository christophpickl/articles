"use strict";
exports.__esModule = true;
// import { settings } from 'electron-settings';
var settings = require("electron-settings");
var path_1 = require("path");
var common_1 = require("./common");
var ElectronHandler = /** @class */ (function () {
    function ElectronHandler() {
    }
    ElectronHandler.main = function (app, browserWindow) {
        ElectronHandler.BrowserWindow = browserWindow;
        ElectronHandler.application = app;
        ElectronHandler.application.on('window-all-closed', ElectronHandler.onWindowAllClosed);
        ElectronHandler.application.on('ready', ElectronHandler.onReady);
    };
    ElectronHandler.onReady = function () {
        console.log("ElectronHandler.onReady()");
        console.log(ElectronHandler.application.getPath("userData"));
        ElectronHandler.mainWindow = new ElectronHandler.BrowserWindow({
            width: 800, height: 600,
            webPreferences: {
                preload: path_1.join(__dirname, 'preload.js')
            }
        });
        ElectronHandler.applyWindowSettings();
        ElectronHandler.mainWindow.setTitle("Articles" + (common_1.Config.IS_DEBUG ? " - DEV" : ""));
        ElectronHandler.mainWindow.setMinimumSize(600, 600);
        ElectronHandler.mainWindow.loadURL('file://' + __dirname + '/index.html'); // loadFile("index.html");
        ElectronHandler.mainWindow.on('close', ElectronHandler.onClose);
        ElectronHandler.mainWindow.on('closed', ElectronHandler.onClosed);
        // ElectronHandler.mainWindow.webContents.openDevTools()
    };
    ElectronHandler.onWindowAllClosed = function () {
        console.log("ElectronHandler.onWindowAllClosed()");
        ElectronHandler.application.quit();
    };
    // also invoked when hitting CMD+Q :)
    ElectronHandler.onClose = function () {
        console.log("ElectronHandler.onClose()");
        ElectronHandler.saveWindowSettings();
    };
    ElectronHandler.onClosed = function () {
        console.log("ElectronHandler.onClosed()");
        ElectronHandler.mainWindow = null;
    };
    ElectronHandler.saveWindowSettings = function () {
        var bounds = ElectronHandler.mainWindow.getBounds();
        console.log("save window settings for:", bounds);
        settings.set("window", {
            width: bounds.width,
            height: bounds.height,
            x: bounds.x,
            y: bounds.y
        });
    };
    ElectronHandler.applyWindowSettings = function () {
        var lastWin = settings.get("window");
        if (lastWin !== undefined) {
            ElectronHandler.mainWindow.setBounds(lastWin);
        }
    };
    return ElectronHandler;
}());
exports["default"] = ElectronHandler;
