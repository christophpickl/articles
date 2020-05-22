import {Settings, ElectronSettings} from './Settings';
import {JsonFileArticleRepo} from './ArticleRepo';
import {ElectronHandler} from './ElectronHandler';
import {BrowserWindow} from 'electron';
import UiHandler from './view/UiHandler';
import {DataMigrator} from './DataMigrator';
import {ArticleService, ArticleServiceImpl} from "./ArticleService";
import {EventBus} from "./EventBus";
import {Controller} from "./view/Controller";

export {Context, Env}

enum Env {
    DEV,
    PROD
}

class Context {

    static env: Env;
    static isDev: Boolean;

    private static _settings: Settings;
    private static _articleService: ArticleService;
    private static _dataMigrator: DataMigrator;
    private static _eventBus: EventBus;
    private static _controler: Controller;

    // noinspection JSUnusedLocalSymbols
    private static _initizalize = (() => {
        Context.env = (process.cwd() == "/") ? Env.PROD : Env.DEV;
        Context.isDev = Context.env == Env.DEV;
        Context._settings = new ElectronSettings();
        Context._eventBus = new EventBus();

        let jsonFilePath: string;
        if (Context.isDev) {
            // Context._articleRepo = new InMemoryArticleRepo();
            jsonFilePath = process.cwd() + "/artikles.devdata.json";
        } else {
            jsonFilePath = process.env["HOME"] + "/.artikles/artikles.data.json";
        }
        let articleRepo = new JsonFileArticleRepo(jsonFilePath, DataMigrator.APPLICATION_VERSION);
        Context._articleService = new ArticleServiceImpl(articleRepo);
        Context._dataMigrator = new DataMigrator(jsonFilePath);
    })();

    static electronHandler(app: Electron.App): ElectronHandler {
        return new ElectronHandler(app, BrowserWindow, Context._settings, Context.env);
    }

    static controller(): Controller {
        if (Context._controler === undefined) {
            let uiHandler = new UiHandler(Context._articleService, Context._eventBus);
            Context._controler = new Controller(Context._eventBus, Context._articleService, uiHandler);
        }
        return Context._controler;
    }

    static dataMigrator(): DataMigrator {
        return Context._dataMigrator;
    }
}
