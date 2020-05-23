import {Settings, ElectronSettings} from './Settings';
import {ArticleRepo, JsonFileArticleRepo} from './ArticleRepo';
import {ElectronHandler} from './ElectronHandler';
import UiHandler from './view/UiHandler';
import {DataMigrator, JsonDataMigrator, NoOpDataMigrator} from './DataMigrator';
import {ArticleService, ArticleServiceImpl} from "./ArticleService";
import {EventBus} from "./EventBus";
import {Controller} from "./view/Controller";
import {SortService} from "./sort";

export {Context, Env}

enum Env {
    DEV,
    PROD
}

class Context {

    static env: Env;
    static isDev: Boolean;

    private static _settings: Settings;
    private static _articleRepo: ArticleRepo;
    private static _articleService: ArticleService;
    private static _sortService: SortService;
    private static _dataMigrator: DataMigrator = new NoOpDataMigrator();
    private static _eventBus: EventBus;
    private static _controler: Controller;

    // noinspection JSUnusedLocalSymbols
    private static _initizalize = (() => {
        Context.env = (process.cwd() == "/") ? Env.PROD : Env.DEV;
        Context.isDev = Context.env == Env.DEV;

        Context._settings = new ElectronSettings();
        Context._eventBus = new EventBus();
        Context._sortService = new SortService();
        Context._articleRepo = Context.jsonArticleRepo();

        Context._articleService = new ArticleServiceImpl(Context._articleRepo);
    })();

    private static jsonArticleRepo(): ArticleRepo {
        let jsonFilePath: string;
        if (Context.isDev) {
            // Context._articleRepo = new InMemoryArticleRepo();
            jsonFilePath = process.cwd() + "/artikles.devdata.json";
        } else {
            jsonFilePath = process.env["HOME"] + "/.artikles/artikles.data.json";
        }
        Context._dataMigrator = new JsonDataMigrator(jsonFilePath);
        return new JsonFileArticleRepo(jsonFilePath, JsonDataMigrator.APPLICATION_VERSION);
    }

    static electronHandler(app: Electron.App): ElectronHandler {
        return new ElectronHandler(app, Context._settings, Context.env);
    }

    static controller(): Controller {
        if (Context._controler === undefined) {
            let uiHandler = new UiHandler(Context._eventBus, Context._articleService, Context._sortService);
            Context._controler = new Controller(Context._eventBus, Context._articleService, uiHandler);
        }
        return Context._controler;
    }

    static dataMigrator(): DataMigrator {
        return Context._dataMigrator;
    }
}
