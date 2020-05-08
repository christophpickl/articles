console.log("main.ts");

import { app, BrowserWindow } from 'electron';
import ElectronHandler from './src/ElectronHandler';

ElectronHandler.main(app, BrowserWindow);
