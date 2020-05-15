import { Context } from './Context';

export default class AppStarter {

    static main(app: Electron.App) {
        console.log("AppStarter.main(..)");

        let context = new Context();
        let handler = context.electronHandler(app);
        handler.registerHandlers();
    }
}
