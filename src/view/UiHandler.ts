// extend the JQuery object by tokenize2
/// <reference path="../jquery.d.ts"/>

import {Article, Articles, Tags} from '../domain';
import IndexHtml from './IndexHtml';
import {EventBus, Event} from "../EventBus";
import {
    EditArticleEvent,
    CreateEvent,
    DeleteEvent,
    UpdateEvent,
    CancelEditArticleEvent,
    CancelSearchEvent, SearchEvent, SaveEvent, SearchTagEvent, LikeEvent
} from "./events";
import {TagFontSizer} from "./TagFontSizer";
import {SortEvent, SortOptions} from "../sort";
import KeyDownEvent = JQuery.KeyDownEvent;

export default class UiHandler {
    constructor(
        private readonly eventBus: EventBus
    ) {
    }

    private static readonly ATTR_ARTIFACT_ID = "data-artifactId";
    private static readonly CLASS_TITLE = "articleTitle";
    private static readonly CLASS_TAGS = "articleTags";
    private static readonly CLASS_BODY = "articleBody";
    private static readonly CLASS_CMDBAR = "articleCmdbar";
    private static readonly CLASS_CMD_BUTTON = "articleCmdButton";
    private static readonly CLASS_CMD_LIKE = "articleCmdLike";
    private static readonly CLASS_TAGS_LINK = "tagsLink";

    public init(tags: Tags) {
        console.log("init UiHandler");
        IndexHtml.inpTitle().focus();
        UiHandler.initTagsAutoSuggest();
        this.resetAutoSuggestTags(tags);
        IndexHtml.btnCancelSearchVisible(false);
        IndexHtml.switchButtonsToCreateMode(true);

        SortOptions.forEach((option) => {
            $("#sortSelect").append($("<option value='" + option.id + "'>" + option.label + "</option>"));
        });
        this.initSearchListener();
        this.initSortListener();
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

    private resetAutoSuggestTags(tags: Tags) {
        // TODO have to keep up2date when tags changes
        const tagsInput = $("#inpTags");
        tagsInput.empty();
        tags.forEach(function (tag) {
            tagsInput.append('<option value="' + tag + '">' + tag + '</option>');
        });
    }

    private static initTagsAutoSuggest() {
        $("#inpTags").tokenize2({
            dataSource: "select",
            tokensAllowCustom: true,
            dropdownMaxItems: 9,
            delimiter: " ",
            searchMinLength: 1,
            placeholder: "tags",
            sortable: true
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
            tags: IndexHtml.inpTags().val() as string[],
            // tags: IndexHtml.inpTags().value.split(" ").filter(function (it) {
            //     return it.length > 0;
            // }).sort(),
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

    // SORT
    // ------------========================================================------------

    private initSortListener() {
        $("#sortSelect").on("change", () => {
            let selectedOptionId = $("#sortSelect").children("option:selected").val() as string;
            console.log("sort changed to:", selectedOptionId);
            let option = SortOptions.findByIdOrNull(selectedOptionId)!;
            this.eventBus.dispatch(new SortEvent(option));
        });
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
            articleList.prepend(this.createArticleHtml(article));
        });
        this.fillTagsSummary(tags);
        IndexHtml.setCounter(articles.length);
    }

    public addArticleToList(article: Article) {
        $("#articleList").prepend(this.createArticleHtml(article));
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
            console.log("article child in list not found for: " + article.title + " (" + article.id + ")");
            return;
        }
        let articleTitleLink = child.getElementsByClassName(UiHandler.CLASS_TITLE)[0]!.firstChild! as HTMLAnchorElement;
        articleTitleLink.innerHTML = article.title;
        articleTitleLink.onclick = () => {
            this.eventBus.dispatch(new EditArticleEvent(article));
        };
        this.resetArticleTags($("." + UiHandler.CLASS_TAGS, child), article.tags);
        $("." + UiHandler.CLASS_BODY, child).text(article.body);
        $("." + UiHandler.CLASS_CMD_LIKE, child).text(IndexHtml.LikeSymbol + " " + article.likes);
    }

    // PRIVATE
    // ------------========================================================------------

    private processKeyboardInteraction(eventKey: string, isCmdKeyPressed: boolean) {
        if (eventKey == "Escape") {
            this.eventBus.dispatch(new CancelEditArticleEvent());
        } else if (isCmdKeyPressed && eventKey == "s") {
            this.eventBus.dispatch(new SaveEvent());
        }
    }

    private initFormListener() {
        $("#formCreate input, #formCreate textarea").on("keydown", (event: KeyDownEvent) => {
            this.processKeyboardInteraction(event.key, event.metaKey);
        });
        $("#btnCreate").on("click", () => {
            this.eventBus.dispatch(new CreateEvent());
        });
        $("#btnUpdate").on("click", () => {
            this.eventBus.dispatch(new UpdateEvent());
        });
        $("#btnCancel").on("click", () => {
            this.eventBus.dispatch(new CancelEditArticleEvent());
        });
        $("#btnDelete").on("click", () => {
            this.eventBus.dispatch(new DeleteEvent());
        });
    }

    private createArticleHtml(article: Article): JQuery {
        let articleTitle = $("<h1 class='" + UiHandler.CLASS_TITLE + "'></h1>")
            .append($("<a href='#'>" + article.title + "</a>")
                .on("click", () => {
                    this.eventBus.dispatch(new EditArticleEvent(article));
                }));

        let articleTags = $("<p class='" + UiHandler.CLASS_TAGS + "'></p>");
        this.resetArticleTags(articleTags, article.tags);

        let articleBody = $("<div class='" + UiHandler.CLASS_BODY + "'>" + article.body + "</div>");

        let articleCmdbar = $("<div class='" + UiHandler.CLASS_CMDBAR + "'></div>");
        let cmdLike = $("<a class='" + UiHandler.CLASS_CMD_BUTTON + " " + UiHandler.CLASS_CMD_LIKE + "' href='#'>❤️ " + article.likes + "</a>");
        cmdLike.on("click", () => {
            this.eventBus.dispatch(new LikeEvent(article));
        });
        articleCmdbar.append(cmdLike);

        return $("<div class='articleNode' " + UiHandler.ATTR_ARTIFACT_ID + "='" + article.id + "'></div>")
            .append(articleTitle)
            .append(articleTags)
            .append(articleBody)
            .append(articleCmdbar);
    }

    private resetArticleTags(html: JQuery, tags: string[]) {
        html.empty();
        tags.forEach((tag) => {
            let tagNode = $("<a href='#' class='clickableTag'>#" + tag + "</a>");
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
