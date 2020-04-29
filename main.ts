console.log("main.ts");

import { app, BrowserWindow } from 'electron';
import ElectronHandler from './ElectronHandler';

ElectronHandler.main(app, BrowserWindow);
