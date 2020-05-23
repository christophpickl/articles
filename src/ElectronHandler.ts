import {BrowserWindow} from 'electron';
import {join} from 'path';
import {Settings} from './Settings';
import {Env} from './Context';
import App = Electron.App;

export class ElectronHandler {

    private mainWindow: BrowserWindow | null = null;

    private static readonly HTML_FILE_URL: string = 'file://' + __dirname + '/../view/index.html';
    private static readonly PRELOAD_JS_PATH: string = join(__dirname, 'preload.js');

    constructor(
        private readonly application: App,
        private readonly settings: Settings,
        private readonly env: Env,
        private readonly windowTitle: string = "Artikles 📗" + (env == Env.DEV ? " - DEVELOPMENT 🛠🛠🛠" : (env == Env.TEST ? "TEST ✅❌" : ""))
    ) {
    }

    public registerHandlers() {
        this.application.on('ready', () => {
            this.onReady();
        });
        this.application.on('window-all-closed', () => {
            this.onWindowAllClosed();
        });
    }

    private onReady() {
        console.log("ElectronHandler.onReady()");
        console.log("userData path: ", this.application.getPath("userData"));

        this.mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                preload: ElectronHandler.PRELOAD_JS_PATH
            }
        });
        this.applyWindowSettings();
        this.mainWindow!.setTitle(this.windowTitle);
        this.mainWindow!.setMinimumSize(600, 600);

        this.mainWindow!.loadURL(ElectronHandler.HTML_FILE_URL).then(() => {
            console.log("HTML file loaded successfully.");
        }, rejected => {
            console.log("Error loading: " + ElectronHandler.HTML_FILE_URL, rejected);
        }); // or: loadFile("index.html");
        this.mainWindow!.on('close', () => {
            this.onClose();
        });
        this.mainWindow!.on('closed', () => {
            this.onClosed();
        });
        this.mainWindow.webContents.once('dom-ready', () => {
            console.log("ElectronHandler: on dom-ready");
            // console.log("in handler:", document.getElementById("inpSearch"));
        });

        if (this.env == Env.DEV) {
            this.mainWindow.webContents.openDevTools();
        }
    }

    private onWindowAllClosed() {
        console.log("ElectronHandler.onWindowAllClosed()");
        this.application.quit();
    }

    /** also invoked when hitting CMD+Q :) */
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
