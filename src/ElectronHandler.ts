import { BrowserWindow } from 'electron';
import { join } from 'path';
import { Config } from './common';
import { Settings } from './Settings';

export class ElectronHandler {

    private mainWindow: Electron.BrowserWindow | null = null;
    private readonly application: Electron.App;
    private readonly BrowserWindow;

    constructor(
        application: Electron.App, 
        browserWindow: typeof BrowserWindow,
        private settings: Settings
        ) {
        this.BrowserWindow = browserWindow;
        this.application = application;
    }

    public registerHandlers() {
        this.application.on('window-all-closed', () => { this.onWindowAllClosed(); });
        this.application.on('ready', () => { this.onReady(); });
    }

    private onReady() {
        console.log("ElectronHandler.onReady()");
        console.log("userData path: ", this.application.getPath("userData"));

        this.mainWindow = new this.BrowserWindow({
            width: 800, height: 600,
            webPreferences: {
                preload: join(__dirname, 'preload.js')
            }
        });
        this.applyWindowSettings();
        this.mainWindow!.setTitle("Artikles" + (Config.IS_DEBUG ? " - DEV" : ""));
        this.mainWindow!.setMinimumSize(600, 600);
        this.mainWindow!.loadURL('file://' + __dirname + '/../view/index.html'); // loadFile("index.html");
        this.mainWindow!.on('close', () => { this.onClose(); });
        this.mainWindow!.on('closed', () => { this.onClosed(); });
        // this.mainWindow.webContents.openDevTools()
    }

    private onWindowAllClosed() {
        console.log("ElectronHandler.onWindowAllClosed()");
        this.application.quit();
    }

    // also invoked when hitting CMD+Q :)
    private onClose() {
        console.log("ElectronHandler.onClose()");
        this.saveWindowSettings();
    }

    private onClosed() {
        console.log("ElectronHandler.onClosed()");
        this.mainWindow = null;
    }
    
    private saveWindowSettings() {
        let bounds = this.mainWindow!.getBounds();
        console.log("save window settings for:", bounds);
        this.settings.saveWindow(bounds);
    }

    private applyWindowSettings() {
        let lastWin = this.settings.loadWindow();
        if (lastWin !== null) {
            this.mainWindow!.setBounds(lastWin);
        }
    }
}
