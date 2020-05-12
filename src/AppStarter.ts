import { ElectronHandler } from './ElectronHandler';
import { BrowserWindow } from 'electron';
import { Context } from './Context';

export default class AppStarter {

    static main(app: Electron.App) {
        console.log("AppStarter.main(..)");

        let context = new Context();

        let handler = new ElectronHandler(app, BrowserWindow, context.settings);
        handler.registerHandlers();
    }
}
