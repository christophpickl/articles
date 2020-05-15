import { Settings, ElectronSettings } from './Settings';
import { ArticleRepo, JsonFileArticleRepo, InMemoryArticleRepo } from './ArticleRepo';
import { ElectronHandler } from './ElectronHandler';
import { BrowserWindow } from 'electron';
import UiHandler from './view/UiHandler';

export { Context, Env }

enum Env {
    DEV,
    PROD
}

class Context {

    static env: Env;
    static isDev: Boolean;

    private static _settings: Settings;
    private static _articleRepo: ArticleRepo;
    private static _uiHandler: UiHandler;
    
    private static _initizalize = (() => {
        Context.env = (process.cwd() == "/") ? Env.PROD : Env.DEV;
        Context.isDev = Context.env == Env.DEV;

        Context._settings = new ElectronSettings();

        if(Context.isDev) {
            // Context._articleRepo = new InMemoryArticleRepo();
            Context._articleRepo = new JsonFileArticleRepo(process.cwd() + "/artikles.devdata.json");
        } else {
            Context._articleRepo = new JsonFileArticleRepo(process.env["HOME"] + "/.artikles/artikles.data.json");
        }
    })();

    static settings(): Settings {
        return Context._settings;
    }

    static articleRepo(): ArticleRepo {
        return Context._articleRepo;
    }

    static electronHandler(app: Electron.App): ElectronHandler {
        return new ElectronHandler(app, BrowserWindow, Context.settings(), Context.env);
    }

    static uiHandler(): UiHandler {
        if (Context._uiHandler === undefined) {
            Context._uiHandler = new UiHandler(Context.articleRepo());
        }
        return Context._uiHandler;
    }
}
