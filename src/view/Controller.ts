import {EventBus} from "../EventBus";
import {
    CancelEditArticleEvent,
    CancelSearchEvent,
    CreateEvent,
    DeleteEvent,
    EditArticleEvent, SaveEvent, SearchEvent,
    UpdateEvent
} from "./events";
import UiHandler from "./UiHandler";
import {randomUuid} from "../common";
import {ArticleService} from "../ArticleService";
import {Article, Tags} from "../domain";

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
        eventBus.register(SaveEvent.ID, () => {
            this.onSave();
        });
        eventBus.register(DeleteEvent.ID, () => {
            this.onDelete();
        });
        eventBus.register(EditArticleEvent.ID, (event: EditArticleEvent) => {
            this.onEdit(event.article);
        });
        eventBus.register(CancelEditArticleEvent.ID, () => {
            this.onCancelEditArticle();
        });
        eventBus.register(SearchEvent.ID, (event: SearchEvent) => {
            this.onSearch(event.term);
        });
        eventBus.register(CancelSearchEvent.ID, () => {
            this.onCancelSearch();
        });
    }

    public initView() {
        let articles = this.articleService.readAll();
        this.uiHandler.init();
        this.uiHandler.resetArticleList(articles, Tags.buildFrom(articles));
    }

    // CRUD
    // ------------========================================================------------

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

        let articles = this.articleService.create(article);

        this.uiHandler.addArticleToList(article);
        this.uiHandler.resetArticleForm();
        this.uiHandler.fillTagsSummary(Tags.buildFrom(articles));
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

        let articles = this.articleService.update(article);
        this.uiHandler.updateArticleInList(article);
        this.uiHandler.resetArticleForm();
        this.uiHandler.inpTitleFocus();
        this.uiHandler.fillTagsSummary(Tags.buildFrom(articles));
    }

    private onCancelEditArticle() {
        this.uiHandler.resetArticleForm();
        this.uiHandler.inpTitleFocus();
    }

    private onSave() {
        console.log("onSave");
        if (this.uiHandler.isCreateMode()) {
            this.onCreate();
        } else {
            this.onUpdate();
        }
    }

    private onDelete() {
        console.log("onDelete");
        let articleToDelete = this.uiHandler.readArticleFromUI();
        if (!confirm("Really delete '"+articleToDelete.title+"'?")) {
            return;
        }
        let articles = this.articleService.delete(articleToDelete.id);
        this.uiHandler.deleteArticleFromList(articleToDelete.id);
        this.uiHandler.resetArticleForm();
        this.uiHandler.inpTitleFocus();
        this.uiHandler.fillTagsSummary(Tags.buildFrom(articles));
    }

    private onEdit(article: Article) {
        this.uiHandler.updateArticleForm(article);
        this.uiHandler.inpTitleFocus();
    }

    private static validateArticle(article: Article):
        boolean {
        if (article.title.trim().length == 0) {
            alert("Article title must not be empty!");
            return false;
        }
        return true;
    }

    // SEARCH
    // ------------========================================================------------

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
        this.uiHandler.resetArticleList(articles, Tags.buildFrom(articles));
        this.uiHandler.showBtnCancelSearch();
    }

    private onCancelSearch() {
        let articles = this.articleService.disableSearch();
        this.uiHandler.resetSearch();
        this.uiHandler.resetArticleList(articles, Tags.buildFrom(articles));
    }
}

