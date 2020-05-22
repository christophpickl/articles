import { Context } from './Context';

export default class AppStarter {

    static main(app: Electron.App) {
        console.log("AppStarter.main(..)");

        Context.dataMigrator().migrate();
        Context.electronHandler(app).registerHandlers();
    }
}
