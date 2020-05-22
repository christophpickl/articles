import {Article} from '../domain';
import IndexHtml from './IndexHtml';
import {ArticleService} from "../ArticleService";
import {EventBus} from "../EventBus";
import {CreateEvent, DeleteEvent, UpdateEvent} from "./events";

export default class UiHandler {
    constructor(
        private readonly articleService: ArticleService,
        private readonly eventBus: EventBus
    ) {
    }

    public init() {
        console.log("init()");

        document.addEventListener('keydown', function (event) {
            const key = event.key; // Or const {key} = event; in ES6+
            if (event.metaKey && key == "f") {
                document.getElementById("inpSearch")!.focus();
            }
        });

        IndexHtml.btnCancelSearchVisible(false);
        IndexHtml.onClick(IndexHtml.btnCreate(), () => {
            this.eventBus.dispatch(new CreateEvent());
        });
        IndexHtml.onClick(IndexHtml.btnUpdate(), () => {
            this.eventBus.dispatch(new UpdateEvent());
        });
        IndexHtml.onClick(IndexHtml.btnCancel(), () => {
            this.onCancelClicked();
        });
        IndexHtml.onClick(IndexHtml.btnDelete(), () => {
            this.eventBus.dispatch(new DeleteEvent());
        });

        this.registerSearchListener();

        UiHandler.switchButtonsToCreateMode(true);
        this.removeAndPrependArticleNodes(this.articleService.loadArticles());
    }

    private onCancelClicked() {
        console.log("onCancelClicked()");
        this.resetArticleForm();
    }

    private onArticleTitleClicked(article: Article) {
        this.scrollToTop();
        this.updateArticleForm(article);
    }

    private onArticleTagClicked(clickedTag: string) {
        let oldSearch = IndexHtml.inpSearch().value;
        let tagHashed = "#" + clickedTag;
        // TODO UI: mit SHIFT+click auf tag: reset search to only this tag
        IndexHtml.inpSearch().value = (oldSearch.length == 0) ? tagHashed : oldSearch + " " + tagHashed;
        this.onSearchInput();
    }

    // SEARCH
    // ------------========================================================------------

    private registerSearchListener() {
        IndexHtml.onInpSearchInput(() => {
            this.onSearchInput();
        });

        IndexHtml.inpSearch().addEventListener("input", () => {
            this.onSearchInput();
        });
        IndexHtml.inpSearch().addEventListener('keydown', (event) => {
            const key = event.key; // Or const {key} = event; in ES6+
            if (key === "Escape") {
                this.resetSearch();
            }
        });
        IndexHtml.onClick(IndexHtml.btnCancelSearch(), () => {
            this.resetSearch();
        });
    }

    private onSearchInput() {
        let searchTerm: string = IndexHtml.inpSearch().value.trim()
        let terms = searchTerm.split(" ").filter((it) => {
            return it.length != 0
        });
        console.log("onSearchInput(" + searchTerm + ") => terms:", terms);
        if (terms.length == 0) {
            this.resetSearch();
            return;
        }

        let articles = this.articleService.searchArticles(terms);
        this.removeAndPrependArticleNodes(articles);
        document.getElementById("btnCancelSearch")!.hidden = false;
    }

    private resetSearch() {
        IndexHtml.inpSearch().value = "";
        this.removeAndPrependArticleNodes(this.articleService.disableSearch());
        document.getElementById("btnCancelSearch")!.hidden = true;
    }

    // UI LOGIC
    // ------------========================================================------------

    public writeArticleUpdatedInputValue(updated: string) {
        IndexHtml.inpUpdated().value = updated;
    }

    public readArticleFromUI(givenId: string | undefined = undefined): Article {
        return new Article(
            /*id*/ (givenId !== undefined) ? givenId : IndexHtml.inpId().value,
            /*title*/ IndexHtml.inpTitle().value,
            /*tags*/ IndexHtml.inpTags().value.split(" ").filter(function (it) {
                return it.length > 0;
            }),
            /*body*/ IndexHtml.inpBody().value,
            /*created*/ new Date(IndexHtml.inpCreated().value),
            /*updated*/ new Date(IndexHtml.btnUpdate().value),
            /*likes*/ parseInt(IndexHtml.inpLikes().value)
        );
    }


    private updateArticleForm(article: Article) {
        IndexHtml.inpId().value = article.id;
        IndexHtml.inpTitle().value = article.title;
        IndexHtml.inpTags().value = article.tags.join(" ");
        IndexHtml.inpBody().value = article.body;
        IndexHtml.inpCreated().value = article.created.toString();
        IndexHtml.inpUpdated().value = article.updated.toString();
        IndexHtml.inpLikes().value = article.likes.toString();
        UiHandler.switchButtonsToCreateMode(false);
    }

    public resetArticleForm() {
        IndexHtml.inpId().value = "";
        IndexHtml.inpTitle().value = "";
        IndexHtml.inpTags().value = "";
        IndexHtml.inpBody().value = "";
        IndexHtml.inpCreated().value = "";
        IndexHtml.inpUpdated().value = "";
        IndexHtml.inpLikes().value = "";
        UiHandler.switchButtonsToCreateMode(true);
    }

    private removeAndPrependArticleNodes(articles: Article[]) {
        let articleList = IndexHtml.articleList();
        UiHandler.removeAllChildren(articleList);
        articles.forEach((article) => {
            articleList.prepend(this.createArticleNode(article));
        });
        this.fillTagsSummary(articles);
    }

    public fillTagsSummary(articles: Article[]) {
        let allTagsCounted = this.countEachTag(articles);
        let sortedTags = Array.from(allTagsCounted.keys()).sort() as string[];

        let tagsSummaryNode = document.getElementById("tagsSummary")!;
        UiHandler.removeAllChildren(tagsSummaryNode);

        let listNode = document.createElement("ul");

        sortedTags.forEach(tagName => {
            let aNode = document.createElement("a");
            aNode.innerText = "#" + tagName + "(" + allTagsCounted.get(tagName) + ")";
            aNode.href = "#";
            aNode.onclick = () => {
                this.onArticleTagClicked(tagName);
            };
            let itemNode = document.createElement("li");
            itemNode.appendChild(aNode);
            listNode.appendChild(itemNode);
        });
        tagsSummaryNode.appendChild(listNode);
    }

    // TODO outsource
    private countEachTag(articles: Article[]): Map<string, number> {
        let allTagsCounted = new Map<string, number>();
        articles.forEach((article) => {
            article.tags.forEach((tag) => {
                if (!allTagsCounted.has(tag)) {
                    allTagsCounted.set(tag, 0);
                }
                let oldTagCount = allTagsCounted.get(tag)!;
                allTagsCounted.set(tag, oldTagCount + 1);
            });
        });
        return allTagsCounted;
    }

    /** general utility method / extension function */
    private static removeAllChildren(node: Element) {
        while (node.firstChild) {
            node.removeChild(node.lastChild!);
        }
    }

    // HTML FACTORY
    // ------------========================================================------------

    private static readonly ATTR_ARTIFACT_ID = "data-artifactId";
    private static readonly CLASS_TITLE = "articleTitle";
    private static readonly CLASS_TAGS = "articleTags";
    private static readonly CLASS_BODY = "articleBody";

    public addArticle(article: Article) {
        IndexHtml.articleList().prepend(this.createArticleNode(article))
    }

    public deleteArticle(id: string) {
        let child = UiHandler.findArticleChildNodeById(id);
        IndexHtml.articleList().removeChild(child);
    }

    private createArticleNode(article: Article) {
        let articleTitle = document.createElement("h1");
        articleTitle.classList.add(UiHandler.CLASS_TITLE);
        let articleTitleLink = document.createElement("a");
        articleTitleLink.innerText = article.title;
        articleTitleLink.href = "#";
        articleTitleLink.onclick = () => {
            this.onArticleTitleClicked(article);
        };
        articleTitle.appendChild(articleTitleLink);

        let articleTags = document.createElement("p");
        articleTags.classList.add(UiHandler.CLASS_TAGS);
        this.resetTags(articleTags, article.tags);

        let articleBody = document.createElement("pre");
        articleBody.classList.add(UiHandler.CLASS_BODY);
        articleBody.innerText = article.body;

        let articleNode = document.createElement("div");
        articleNode.setAttribute(UiHandler.ATTR_ARTIFACT_ID, article.id);
        articleNode.classList.add("articleNode");
        articleNode.appendChild(articleTitle);
        articleNode.appendChild(articleTags);
        articleNode.appendChild(articleBody);
        return articleNode;
    }

    private resetTags(html: Element, tags: string[]) {
        UiHandler.removeAllChildren(html);
        tags.forEach((tag) => {
            let tagNode = document.createElement("a");
            tagNode.classList.add("clickableTag");
            tagNode.innerText = "#" + tag;
            tagNode.href = "#";
            tagNode.onclick = () => {
                this.onArticleTagClicked(tag);
            };
            html.appendChild(tagNode);
        });
    }

    private static findArticleChildNodeById(articleId: string): HTMLElement {
        let list = IndexHtml.articleList();
        let children = list.children;
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            let currentId = child.getAttribute(UiHandler.ATTR_ARTIFACT_ID);
            if (currentId == articleId) {
                return child as HTMLElement;
            }
        }
        throw new Error("Article not found by ID [" + articleId + "]!");
    }

    public updateArticleNode(article: Article) {
        let child = UiHandler.findArticleChildNodeById(article.id);
        let articleTitleLink = child.getElementsByClassName(UiHandler.CLASS_TITLE)[0]!.firstChild! as HTMLAnchorElement;
        articleTitleLink.innerHTML = article.title;
        articleTitleLink.onclick = () => {
            this.onArticleTitleClicked(article);
        };
        this.resetTags(child.getElementsByClassName(UiHandler.CLASS_TAGS)[0]!, article.tags);
        child.getElementsByClassName(UiHandler.CLASS_BODY)[0]!.innerHTML = article.body;
    }

    // COMMON
    // ------------========================================================------------

    private static switchButtonsToCreateMode(isCreateMode: boolean) {
        IndexHtml.btnCreate().hidden = !isCreateMode;
        IndexHtml.btnUpdate().hidden = isCreateMode;
        IndexHtml.btnCancel().hidden = isCreateMode;
        IndexHtml.btnDelete().hidden = isCreateMode;
    }

    // TODO use IndexHtml instead
    private static getInputValue(selector: string): string {
        return (<HTMLInputElement>document.getElementById(selector)).value;
    }

    private static setInputValue(selector: string, newValue: string) {
        (<HTMLInputElement>document.getElementById(selector)).value = newValue;
    }

    // TODO make public and use from controller
    private scrollToTop() {
        document.body.scrollTop = 0; // safari
        document.documentElement.scrollTop = 0; // chrome, firefox, IE, opera
    }

}
