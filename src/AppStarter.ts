import { Context } from './Context';

export default class AppStarter {

    static main(app: Electron.App) {
        console.log("AppStarter.main(..)");

        let handler = Context.electronHandler(app);
        handler.registerHandlers();
    }
}
