import {Article, Articles, Tags} from '../domain';
import IndexHtml from './IndexHtml';
import {ArticleService} from "../ArticleService";
import {EventBus, Event} from "../EventBus";
import {
    EditArticleEvent,
    CreateEvent,
    DeleteEvent,
    UpdateEvent,
    CancelEditArticleEvent,
    CancelSearchEvent, SearchEvent, SaveEvent, SearchTagEvent
} from "./events";
import {TagFontSizer} from "./TagFontSizer";

export default class UiHandler {
    constructor(
        private readonly articleService: ArticleService,
        private readonly eventBus: EventBus
    ) {
    }

    private static readonly ATTR_ARTIFACT_ID = "data-artifactId";
    private static readonly CLASS_TITLE = "articleTitle";
    private static readonly CLASS_TAGS = "articleTags";
    private static readonly CLASS_BODY = "articleBody";
    private static readonly CLASS_TAGS_LINK = "tagsLink";

    public init() {
        console.log("init UiHandler");
        IndexHtml.inpTitle().focus();
        IndexHtml.btnCancelSearchVisible(false);
        IndexHtml.switchButtonsToCreateMode(true);

        this.initSearchListener();
        this.initFormListener();
        document.addEventListener('keydown', function (event) {
            const key = event.key;
            if (event.metaKey) {
                if (key == "f") {
                    document.getElementById("inpSearch")!.focus();
                }
            }
        });
    }

    public inpTitleFocus() {
        IndexHtml.inpTitle().focus();
    }

    // CRUD FORM
    // ------------========================================================------------

    public writeArticleUpdatedInputValue(updated: string) {
        IndexHtml.inpUpdated().value = updated;
    }

    public readArticleFromUI(givenId: string | undefined = undefined): Article {
        return new Article({
            id: (givenId !== undefined) ? givenId : IndexHtml.inpId().value,
            title: IndexHtml.inpTitle().value,
            tags: IndexHtml.inpTags().value.split(" ").filter(function (it) {
                return it.length > 0;
            }).sort(),
            body: IndexHtml.inpBody().value,
            created: new Date(IndexHtml.inpCreated().value),
            updated: new Date(IndexHtml.btnUpdate().value),
            likes: parseInt(IndexHtml.inpLikes().value),
            isDeleted: false
        });
    }

    public updateArticleForm(article: Article) {
        IndexHtml.fillArticleForm(article);
    }

    public resetArticleForm() {
        IndexHtml.fillArticleForm(null);
    }

    public isCreateMode(): boolean {
        return IndexHtml.isInCreateMode;
    }

    // SEARCH
    // ------------========================================================------------

    private initSearchListener() {
        IndexHtml.onInpSearchInput(() => {
            this.eventBus.dispatch(new SearchEvent(IndexHtml.inpSearch().value));
        });
        this.registerOnEscapeDispatch(IndexHtml.inpSearch(), () => {
            return new CancelSearchEvent();
        });

        IndexHtml.onClick(IndexHtml.btnCancelSearch(), () => {
            this.eventBus.dispatch(new CancelSearchEvent());
        });
    }

    public showBtnCancelSearch() {
        IndexHtml.btnCancelSearch().hidden = false;
    }

    public resetSearch() {
        IndexHtml.inpSearch().value = "";
        IndexHtml.btnCancelSearch().hidden = true;
    }

    private onArticleTagClicked(clickedTag: string) {
        this.eventBus.dispatch(new SearchTagEvent(clickedTag));
    }

    // TAGS
    // ------------========================================================------------

    public fillTagsSummary(tags: Tags) {
        let fontSizer = new TagFontSizer(tags);
        let listNode = $("<ul>");
        tags.forEach((tagName, count) => {
            listNode.append(this.buildTagHtmlElement(tagName, count, fontSizer.sizeFor(count)));
        });

        let tagsSummaryNode: JQuery = $("#tagsSummary");
        tagsSummaryNode.empty();
        tagsSummaryNode.append(listNode);
    }

    private buildTagHtmlElement(tagName: string, count: number, fontSize: string): JQuery {
        let aNode = $("<a href='#' class='" + UiHandler.CLASS_TAGS_LINK + "'>#" + tagName + "(" + count + ")</a>");
        aNode.css("font-size", fontSize)
        aNode.on("click", () => {
            this.onArticleTagClicked(tagName);
        });
        return $("<li>").append(aNode);
    }

    // ARTICLES LIST
    // ------------========================================================------------

    public resetArticleList(articles: Articles, tags: Tags) {
        let articleList = $("#articleList");
        articleList.empty();
        articles.forEach((article) => {
            articleList.prepend(this.createArticleNode(article));
        });
        this.fillTagsSummary(tags);
        IndexHtml.setCounter(articles.length);
    }

    public addArticleToList(article: Article) {
        $("#articleList").prepend(this.createArticleNode(article));
        IndexHtml.incrementCounter();
    }

    public deleteArticleFromList(id: string) {
        let child = UiHandler.findArticleChildNodeById(id);
        if (child === null) {
            return;
        }
        IndexHtml.articleList().removeChild(child);
        IndexHtml.decrementCounter();
    }

    public updateArticleInList(article: Article) {
        let child = UiHandler.findArticleChildNodeById(article.id);
        if (child === null) {
            return;
        }
        let articleTitleLink = child.getElementsByClassName(UiHandler.CLASS_TITLE)[0]!.firstChild! as HTMLAnchorElement;
        articleTitleLink.innerHTML = article.title;
        articleTitleLink.onclick = () => {
            this.eventBus.dispatch(new EditArticleEvent(article));
        };
        this.resetArticleTags($("." + UiHandler.CLASS_TAGS, child), article.tags);
        $("." + UiHandler.CLASS_BODY, child).text(article.body);
    }

    // PRIVATE
    // ------------========================================================------------

    private initFormListener() {
        let reactiveForm = [
            IndexHtml.inpTitle(), IndexHtml.inpTags(), IndexHtml.inpBody(),
            IndexHtml.btnCreate(), IndexHtml.btnUpdate(), IndexHtml.btnCancel(), IndexHtml.btnDelete()
        ];
        reactiveForm.forEach((input) => {
            IndexHtml.onKeyDown(input, (event: KeyboardEvent) => {
                if (event.key == "Escape") {
                    this.eventBus.dispatch(new CancelEditArticleEvent());
                } else if (event.metaKey && event.key == "s") {
                    this.eventBus.dispatch(new SaveEvent());
                }
            });
        });

        $("#btnCreate").on("click", () => {
            this.eventBus.dispatch(new CreateEvent());
        });
        IndexHtml.onClick(IndexHtml.btnUpdate(), () => {
            this.eventBus.dispatch(new UpdateEvent());
        });
        IndexHtml.onClick(IndexHtml.btnCancel(), () => {
            this.eventBus.dispatch(new CancelEditArticleEvent());
        });
        IndexHtml.onClick(IndexHtml.btnDelete(), () => {
            this.eventBus.dispatch(new DeleteEvent());
        });
    }

    private createArticleNode(article: Article): JQuery {
        let articleTitle = $("<h1 class='" + UiHandler.CLASS_TITLE + "'></h1>")
            .append($("<a href='#'>" + article.title + "</a>")
                .on("click", () => {
                    this.eventBus.dispatch(new EditArticleEvent(article));
                }));

        let articleTags = $("<p class='" + UiHandler.CLASS_TAGS + "'></p>");//document.createElement("p");

        this.resetArticleTags(articleTags, article.tags);

        let articleBody = document.createElement("div");
        articleBody.classList.add(UiHandler.CLASS_BODY);
        articleBody.innerText = article.body;

        return $("<div class='articleNode' " + UiHandler.ATTR_ARTIFACT_ID + "='" + article.id + "'></div>")
            .append(articleTitle)
            .append(articleTags)
            .append(articleBody);
    }

    private resetArticleTags(html: JQuery, tags: string[]) {
        html.empty();
        tags.forEach((tag) => {
            let tagNode = $("<a href='#' class='clickableTag'>#" + tag + "</a>");//document.createElement("a");
            tagNode.on("click", () => {
                this.onArticleTagClicked(tag);
            });
            html.append(tagNode);
        });
    }

    private registerOnEscapeDispatch(html: HTMLInputElement, eventProducer: () => Event) {
        IndexHtml.onKeyDown(html, (event: KeyboardEvent) => {
            if (event.key == "Escape") {
                this.eventBus.dispatch(eventProducer());
            }
        });
    }

    private static findArticleChildNodeById(articleId: string): HTMLElement | null {
        return IndexHtml.findArticleChildNodeById(UiHandler.ATTR_ARTIFACT_ID, articleId);
    }

    public getSearchTerm(): string {
        return IndexHtml.inpSearch().value;
    }

    public setSearchTerm(value: string) {
        IndexHtml.inpSearch().value = value;
    }
}
