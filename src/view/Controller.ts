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
import {Article, Tags} from "../domain";
import {Context} from "../Context";

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
            this.uiHandler.resetArticleForm();
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
        // MINOR if this update made it run positive through search, then it would be in articles, but not in ui-list...
        this.uiHandler.updateArticleInList(article);
        this.uiHandler.resetArticleForm();
        this.uiHandler.fillTagsSummary(Tags.buildFrom(articles));
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
        this.uiHandler.fillTagsSummary(Tags.buildFrom(articles));
    }

    private onEdit(article: Article) {
        this.uiHandler.updateArticleForm(article);
        scrollToTop();
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

