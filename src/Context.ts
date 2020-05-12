import { Settings, ElectronSettings } from './Settings';

export class Context {

    settings: Settings;

    constructor() {
        this.settings = new ElectronSettings();
    }

}
