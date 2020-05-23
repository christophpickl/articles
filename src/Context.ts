import {Settings, ElectronSettings} from './Settings';
import {ArticleRepo, InMemoryArticleRepo, JsonFileArticleRepo} from './ArticleRepo';
import {ElectronHandler} from './ElectronHandler';
import UiHandler from './view/UiHandler';
import {DataMigrator, JsonDataMigrator, NoOpDataMigrator} from './DataMigrator';
import {ArticleService, ArticleServiceImpl} from "./ArticleService";
import {EventBus} from "./EventBus";
import {Controller} from "./view/Controller";

let fs = require("fs");

export enum Env {
    DEV = "DEV",
    TEST = "TEST",
    PROD = "PROD"
}

function determineEnv(): Env {
    if (fs.existsSync("ENV_PROD")) {
        return Env.PROD;
    }
    let passedEnv = process.env["ARTIKLES_ENV"];
    if (passedEnv === undefined) {
        throw Error("Missing environment variable: ATRIKLES_ENV=[ DEV | TEST | PROD ]");
    }
    const foundEnv = Env[passedEnv];
    if (foundEnv === undefined) {
        throw Error("Invalid ATRIKLES_ENV value: '" + passedEnv + "'! Must be one of: [ DEV | TEST | PROD ]");
    }
    return foundEnv;
}

export class Context {

    static readonly env: Env = determineEnv();

    private static _settings: Settings;
    private static _articleRepo: ArticleRepo;
    private static _articleService: ArticleService;
    private static _dataMigrator: DataMigrator = new NoOpDataMigrator();
    private static _eventBus: EventBus;
    private static _controler: Controller;

    // noinspection JSUnusedLocalSymbols
    private static _initizalize = (() => {
        console.log("========================================================================");
        console.log("ARTIKELS ... env = " + Context.env);
        console.log("========================================================================");

        Context._settings = new ElectronSettings();
        Context._eventBus = new EventBus();
        if (Context.env == Env.TEST) {
            console.log("Using IN-MEMORY article repository.");
            Context._articleRepo = new InMemoryArticleRepo();
        } else {
            Context._articleRepo = Context.jsonArticleRepo();
        }

        Context._articleService = new ArticleServiceImpl(Context._articleRepo);
    })();

    private static jsonArticleRepo(): ArticleRepo {
        let jsonFilePath: string;
        switch (Context.env) {
            case Env.DEV:
                // Context._articleRepo = new InMemoryArticleRepo();
                jsonFilePath = process.cwd() + "/local/artikles.devdata.json";
                break;
            case Env.PROD:
                jsonFilePath = process.env["HOME"] + "/.artikles/artikles.data.json";
                break;
            default:
                throw new Error("Unhandled env: " + Context.env);
        }

        Context._dataMigrator = new JsonDataMigrator(jsonFilePath);
        return new JsonFileArticleRepo(jsonFilePath, JsonDataMigrator.APPLICATION_VERSION);
    }

    static electronHandler(app: Electron.App): ElectronHandler {
        return new ElectronHandler(app, Context._settings, Context.env);
    }

    static controller(): Controller {
        if (Context._controler === undefined) {
            let uiHandler = new UiHandler(Context._eventBus);
            Context._controler = new Controller(Context._eventBus, Context._articleService, uiHandler);
        }
        return Context._controler;
    }

    static dataMigrator(): DataMigrator {
        return Context._dataMigrator;
    }
}
