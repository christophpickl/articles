import { BrowserWindow } from 'electron';
const settings = require("electron-settings"); // have to do it old school way
import { join } from 'path';
import { Config } from './common';


export default class ElectronHandler {
    static mainWindow: Electron.BrowserWindow;
    static application: Electron.App;
    static BrowserWindow;

    static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
        ElectronHandler.BrowserWindow = browserWindow;
        ElectronHandler.application = app;
        ElectronHandler.application.on('window-all-closed', ElectronHandler.onWindowAllClosed);
        ElectronHandler.application.on('ready', ElectronHandler.onReady);
    }

    private static onReady() {
        console.log("ElectronHandler.onReady()");
        console.log(ElectronHandler.application.getPath("userData"));

        ElectronHandler.mainWindow = new ElectronHandler.BrowserWindow({
            width: 800, height: 600,
            webPreferences: {
                preload: join(__dirname, 'preload.js')
            }
        });
        ElectronHandler.applyWindowSettings();
        ElectronHandler.mainWindow.setTitle("Artikles" + (Config.IS_DEBUG ? " - DEV" : ""));
        ElectronHandler.mainWindow.setMinimumSize(600, 600);
        ElectronHandler.mainWindow.loadURL('file://' + __dirname + '/../view/index.html'); // loadFile("index.html");
        ElectronHandler.mainWindow.on('close', ElectronHandler.onClose);
        ElectronHandler.mainWindow.on('closed', ElectronHandler.onClosed);
        // ElectronHandler.mainWindow.webContents.openDevTools()
    }

    private static onWindowAllClosed() {
        console.log("ElectronHandler.onWindowAllClosed()");
        ElectronHandler.application.quit();
    }

    // also invoked when hitting CMD+Q :)
    private static onClose() {
        console.log("ElectronHandler.onClose()");
        ElectronHandler.saveWindowSettings();
    }

    private static onClosed() {
        console.log("ElectronHandler.onClosed()");
        ElectronHandler.mainWindow = null;
    }
    
    private static saveWindowSettings() {
        let bounds = ElectronHandler.mainWindow.getBounds();
        console.log("save window settings for:", bounds);
        settings.set("window", {
            width: bounds.width,
            height: bounds.height,
            x: bounds.x,
            y: bounds.y,
        });
    }

    private static applyWindowSettings() {
        let lastWin = settings.get("window");
        if(lastWin !== undefined) {
            ElectronHandler.mainWindow.setBounds(lastWin);
        }
    }
}
