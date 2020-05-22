import {EventBus} from "../EventBus";
import {CreateEvent, DeleteEvent, UpdateEvent} from "./events";
import UiHandler from "./UiHandler";
import {randomUuid} from "../common";
import {ArticleService} from "../ArticleService";
import {Article} from "../domain";

export class Controller {
    constructor(
        eventBus: EventBus,
        private readonly articleService: ArticleService,
        private readonly uiHandler: UiHandler
    ) {
        eventBus.register(CreateEvent.ID, (event: CreateEvent) => {
            this.onCreate();
        });
        eventBus.register(UpdateEvent.ID, (event: UpdateEvent) => {
            this.onUpdate();
        });
        eventBus.register(DeleteEvent.ID, (event: DeleteEvent) => {
            this.onDelete();
        });
    }

    private onCreate() {
        console.log("onCreate");
        let article = this.uiHandler.readArticleFromUI(randomUuid());
        if (!Controller.validateArticle(article)) {
            return;
        }
        let now = new Date();
        article.created = now;
        article.updated = now;
        article.likes = 0;

        let articles = this.articleService.saveArticle(article);

        this.uiHandler.addArticle(article);
        this.uiHandler.resetArticleForm();
        this.uiHandler.fillTagsSummary(articles);
    }

    private onUpdate() {
        console.log("onUpdate");
        let article = this.uiHandler.readArticleFromUI();
        if (!Controller.validateArticle(article)) {
            return;
        }
        article.updated = new Date();
        let updatedString = JSON.stringify(article.updated).split("\"").join(""); // pseudo replaceAll :-/
        this.uiHandler.writeArticleUpdatedInputValue(updatedString);

        let articles = this.articleService.updateArticle(article);
        this.uiHandler.updateArticleNode(article);
        this.uiHandler.resetArticleForm();
        this.uiHandler.fillTagsSummary(articles);
    }

    private onDelete() {
        console.log("onDelete");
        let currentId = this.uiHandler.readArticleFromUI().id;
        let articles = this.articleService.deleteArticle(currentId);
        this.uiHandler.deleteArticle(currentId);
        this.uiHandler.resetArticleForm();
        this.uiHandler.fillTagsSummary(articles);
    }

    private static validateArticle(article: Article):
        boolean {
        if (article.title.trim().length == 0) {
            alert("Article title must not be empty!");
            return false;
        }
        return true;
    }
}

