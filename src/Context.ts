import { Settings, ElectronSettings } from './Settings';
import { ArticleRepo, JsonFileArticleRepo } from './Articles';
import { ElectronHandler } from './ElectronHandler';
import { BrowserWindow } from 'electron';

export { Context, Env }

enum Env {
    DEV,
    PROD
}

class Context {

    readonly settings: Settings;
    readonly articleRepo: ArticleRepo;
    readonly env: Env;
    readonly isDev: Boolean;

    constructor() {
        this.env = (process.cwd() == "/") ? Env.PROD : Env.DEV;
        this.isDev = this.env == Env.DEV;

        this.settings = new ElectronSettings();

        if(this.isDev) {
            // TODO support in-memory impl
            this.articleRepo = new JsonFileArticleRepo(process.cwd() + "/artikles.devdata.json");
        } else {
            this.articleRepo = new JsonFileArticleRepo(process.env["HOME"] + "/.artikles/artikles.data.json");
        }
    }

    electronHandler(app: Electron.App): ElectronHandler {
        return new ElectronHandler(app, BrowserWindow, this.settings, this.env);
    }

}
