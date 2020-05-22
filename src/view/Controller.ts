import {EventBus} from "../EventBus";
import {
    CancelEditArticleEvent,
    CancelSearchEvent,
    CreateEvent,
    DeleteEvent,
    EditArticleEvent, SearchEvent,
    UpdateEvent
} from "./events";
import UiHandler from "./UiHandler";
import {randomUuid, scrollToTop} from "../common";
import {ArticleService} from "../ArticleService";
import {Article} from "../domain";

export class Controller {
    constructor(
        private readonly eventBus: EventBus,
        private readonly articleService: ArticleService,
        private readonly uiHandler: UiHandler
    ) {
        eventBus.register(CreateEvent.ID, () => {
            this.onCreate();
        });
        eventBus.register(UpdateEvent.ID, () => {
            this.onUpdate();
        });
        eventBus.register(DeleteEvent.ID, () => {
            this.onDelete();
        });
        eventBus.register(EditArticleEvent.ID, (event: EditArticleEvent) => {
            this.onEdit(event.article);
        });
        eventBus.register(CancelEditArticleEvent.ID, () => {
            this.onCancel();
        });
        eventBus.register(SearchEvent.ID, (event: SearchEvent) => {
            this.onSearch(event.term);
        });
        eventBus.register(CancelSearchEvent.ID, () => {
            this.onCancelSearch();
        });
    }

    private onSearch(searchTerm: string) {
        let terms = searchTerm.split(" ").filter((it) => {
            return it.length != 0
        });
        if (terms.length == 0) {
            this.onCancelSearch();
            return;
        }

        console.log("onSearch(" + searchTerm + ") => terms:", terms);
        let articles = this.articleService.searchArticles(terms);
        this.uiHandler.resetArticleList(articles);
        this.uiHandler.showBtnCancelSearch();
    }

    private onCancelSearch() {
        let articles = this.articleService.disableSearch();
        this.uiHandler.resetSearch();
        this.uiHandler.resetArticleList(articles);
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

    private onEdit(article: Article) {
        this.uiHandler.updateArticleForm(article);
        scrollToTop();
    }

    private onCancel() {
        this.uiHandler.resetArticleForm();
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

