import { Settings, ElectronSettings } from './Settings';
import { ArticleRepo, JsonFileArticleRepo, InMemoryArticleRepo } from './ArticleRepo';
import { ElectronHandler } from './ElectronHandler';
import { BrowserWindow } from 'electron';
import UiHandler from './view/UiHandler';
import { DataMigrator } from './DataMigrator';

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
    private static _dataMigrator: DataMigrator;
    
    private static _initizalize = (() => {
        Context.env = (process.cwd() == "/") ? Env.PROD : Env.DEV;
        Context.isDev = Context.env == Env.DEV;
        Context._settings = new ElectronSettings();

        var jsonFilePath = "";
        if(Context.isDev) {
            // Context._articleRepo = new InMemoryArticleRepo();
            jsonFilePath = process.cwd() + "/artikles.devdata.json";
        } else {
            jsonFilePath = process.env["HOME"] + "/.artikles/artikles.data.json";
        }
        Context._articleRepo = new JsonFileArticleRepo(jsonFilePath, DataMigrator.APPLICATION_VERSION);
        Context._dataMigrator = new DataMigrator(jsonFilePath);
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

    static dataMigrator(): DataMigrator {
        return Context._dataMigrator;
    }
}
