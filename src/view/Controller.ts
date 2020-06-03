import {EventBus} from "../EventBus";
import {
    CancelEditArticleEvent,
    CancelSearchEvent,
    CreateEvent,
    DeleteEvent,
    EditArticleEvent, LikeEvent, SaveEvent, SearchEvent, SearchTagEvent,
    UpdateEvent
} from "./events";
import UiHandler from "./UiHandler";
import {randomUuid} from "../common";
import {ArticleService} from "../ArticleService";
import {Article, Tags} from "../domain";
import {SortEvent, SortOption} from "../sort";

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
        eventBus.register(LikeEvent.ID, (event: LikeEvent) => {
            this.onLike(event.article);
        });

        eventBus.register(CancelEditArticleEvent.ID, () => {
            this.onCancelEditArticle();
        });
        eventBus.register(SearchEvent.ID, (event: SearchEvent) => {
            this.onSearch(event.term);
        });
        eventBus.register(SearchTagEvent.ID, (event: SearchTagEvent) => {
            this.onSearchTag(event.tag);
        });
        eventBus.register(CancelSearchEvent.ID, () => {
            this.onCancelSearch();
        });
        eventBus.register(SortEvent.ID, (event: SortEvent) => {
            this.onSort(event.option);
        });
    }

    public initView() {
        let articles = this.articleService.readAll();
        let tags = Tags.buildFrom(articles);
        this.uiHandler.init(tags);
        this.uiHandler.resetArticleList(articles, tags);
    }

    // CRUD
    // ------------========================================================------------

    private onSave() {
        console.log("onSave");
        if (this.uiHandler.isCreateMode()) {
            this.onCreate();
        } else {
            this.onUpdate();
        }
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

        this.uiHandler.resetArticleForm();
        this.uiHandler.addArticleToList(article);
        let articles = this.articleService.create(article);
        this.uiHandler.fillTagsSummary(Tags.buildFrom(articles));
        this.uiHandler.inpTitleFocus();
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

        this.uiHandler.resetArticleForm();
        this.uiHandler.updateArticleInList(article);
        let articles = this.articleService.update(article);
        this.uiHandler.fillTagsSummary(Tags.buildFrom(articles));
        this.uiHandler.inpTitleFocus();
    }

    private onCancelEditArticle() {
        this.uiHandler.resetArticleForm();
        this.uiHandler.inpTitleFocus();
    }

    private onDelete() {
        console.log("onDelete");
        let articleToDelete = this.uiHandler.readArticleFromUI();
        if (!confirm("Really delete '" + articleToDelete.title + "'?")) {
            return;
        }

        this.uiHandler.deleteArticleFromList(articleToDelete.id);
        this.uiHandler.resetArticleForm();
        let articles = this.articleService.delete(articleToDelete.id);
        this.uiHandler.fillTagsSummary(Tags.buildFrom(articles));
        this.uiHandler.inpTitleFocus();
    }

    private onEdit(article: Article) {
        this.uiHandler.updateArticleForm(article);
        this.uiHandler.inpTitleFocus();
    }

    private onLike(article: Article) {
        article.like();
        this.articleService.update(article);
        this.uiHandler.updateArticleInList(article);
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

    private onSearchTag(searchTag: string) {
        let oldSearch = this.uiHandler.getSearchTerm();
        let searchTagHashed = "#" + searchTag;
        let newSearch = (oldSearch.length == 0) ? searchTagHashed : oldSearch + " " + searchTagHashed;
        this.uiHandler.setSearchTerm(newSearch);
        this.onSearch(newSearch);
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
        this.uiHandler.resetArticleList(articles, Tags.buildFrom(articles));
        this.uiHandler.showBtnCancelSearch();
    }

    private onCancelSearch() {
        let articles = this.articleService.disableSearch();
        this.uiHandler.resetSearch();
        this.uiHandler.resetArticleList(articles, Tags.buildFrom(articles));
    }

    // SORT
    // ------------========================================================------------

    private onSort(option: SortOption) {
        let articles = this.articleService.changeSort(option);
        this.uiHandler.resetArticleList(articles, Tags.buildFrom(articles));
    }
}

