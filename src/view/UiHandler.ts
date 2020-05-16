
import { randomUuid } from '../common';
import { Article } from '../domain';
import { ArticleRepo } from '../ArticleRepo';
import IndexHtml from './IndexHtml';

export default class UiHandler {
    constructor(
        private readonly articleRepo: ArticleRepo
    ) {}

    init() {
        console.log("init()");

        document.addEventListener('keydown', function(event) {
            const key = event.key; // Or const {key} = event; in ES6+
            if (event.metaKey && key == "f") {
                document.getElementById("inpSearch")!.focus();
            }
        });

        this.resetArticleList()

        IndexHtml.btnCancelSearchVisible(false);
        IndexHtml.onClick(IndexHtml.btnCreate(), () => { this.onCreateClicked(); });
        IndexHtml.onClick(IndexHtml.btnUpdate(), () => { this.onUpdateClicked(); });
        IndexHtml.onClick(IndexHtml.btnCancel(), () => { this.onCancelClicked(); });
        IndexHtml.onClick(IndexHtml.btnDelete(), () => { this.onDeleteClicked(); });

        this.registerSearchListener();
        
        this.switchButtonsToCreateMode(true);
    }
    
    onCreateClicked() {
        console.log("onCreateClicked()");

        let article = this.readArticleFromUI(randomUuid());
        let now = new Date();
        article.created = now;
        article.updated = now;
        article.likes = 0;
        if(!this.validateArticle(article)) {
            return;
        }
        this.articleRepo.saveArticle(article);
        this.resetArticleList();
        this.resetInputs();
    }

    onUpdateClicked() {
        console.log("onUpdateClicked()");
        let article = this.readArticleFromUI();
        if(!this.validateArticle(article)) {
            return;
        }
        article.updated = new Date();
        this.setInputValue("inpUpdated", JSON.stringify(article.updated).split("\"").join("")); // pseudo replaceAll :-/
        this.articleRepo.updateArticle(article);
        this.resetArticleList();
    }

    onCancelClicked() {
        console.log("onCancelClicked()");
        this.resetInputs();
    }

    onDeleteClicked() {
        console.log("onDeleteClicked()");
        this.articleRepo.deleteArticle(this.getInputValue("inpId"));
        this.resetArticleList();
        this.resetInputs();
    }

    onArticleTitleClicked(article: Article) {
        this.scrollToTop();
        this.updateArticleForm(article);
    }

    onArticleTagClicked(tag: string) {
        let oldSearch = this.getInputValue("inpSearch");
        let tagHashed = "#" + tag;
        let newSearch = (oldSearch.length == 0) ? tagHashed  : oldSearch + " " + tagHashed;
        this.setInputValue("inpSearch", newSearch);
        this.onSearchInput();
    }

    // SEARCH
    // ------------========================================================------------

    registerSearchListener() {
        IndexHtml.onInpSearchInput(() => { this.onSearchInput(); });
        document.getElementById("inpSearch")!.addEventListener("input", this.onSearchInput); 
        document.getElementById("inpSearch")!.addEventListener('keydown', (event) => {
            const key = event.key; // Or const {key} = event; in ES6+
            if (key === "Escape") {
                this.resetSearch();
            }
        });
        IndexHtml.onClick(IndexHtml.btnCancelSearch(), () => { this.resetSearch(); });
    }

    onSearchInput() {
        let searchTerm: string = this.getInputValue("inpSearch").trim()
        let terms = searchTerm.split(" ").filter((it) => { return it.length != 0});
        console.log("onSearchInput("+searchTerm+") => terms:", terms);
        if (terms.length == 0) {
            this.resetSearch();
            return;
        }

        let articles = this.articleRepo.searchArticles(terms);
        this.removeAndPrependArticleNodes(articles);
        document.getElementById("btnCancelSearch")!.hidden = false;
    }

    resetSearch() {
        this.setInputValue("inpSearch", "");
        this.articleRepo.disableSearch();
        this.resetArticleList();
        document.getElementById("btnCancelSearch")!.hidden = true;
    }

    // UI LOGIC
    // ------------========================================================------------

    readArticleFromUI(givenId: string | undefined = undefined): Article {
        return {
            id: (givenId !== undefined) ? givenId : this.getInputValue("inpId"),
            title: this.getInputValue("inpTitle"),
            tags: this.getInputValue("inpTags").split(" ").filter(function(it) { return it.length > 0; }),
            body: this.getInputValue("inpBody"),
            created: new Date(this.getInputValue("inpCreated")),
            updated: new Date(this.getInputValue("inpUpdated")),
            likes: parseInt(this.getInputValue("inpLikes"))
        }
    }

    updateArticleForm(article: Article) {
        this.setInputValue("inpId", article.id);
        this.setInputValue("inpTitle", article.title);
        this.setInputValue("inpTags", article.tags.join(" "));
        this.setInputValue("inpBody", article.body);
        this.setInputValue("inpCreated", article.created.toString());
        this.setInputValue("inpUpdated", article.updated.toString());
        this.setInputValue("inpLikes", article.likes.toString());
        this.switchButtonsToCreateMode(false);
    }

    resetInputs() {
        this.setInputValue("inpId", "");
        this.setInputValue("inpTitle", "");
        this.setInputValue("inpTags", "");
        this.setInputValue("inpBody", "");
        this.setInputValue("inpCreated", "");
        this.setInputValue("inpUpdated", "");
        this.setInputValue("inpLikes", "");
        this.switchButtonsToCreateMode(true);
    }

    resetArticleList() {
        let articles = this.articleRepo.loadArticles();
        this.removeAndPrependArticleNodes(articles);
    }

    removeAndPrependArticleNodes(articles: Article[]) {
        let articleList = document.getElementById("articleList")!;
        UiHandler.removeAll(articleList);
        articles.forEach((article) => {
            articleList.prepend(this.createArticleNode(article));
        });
        this.fillTagsSummary(articles);
    }

    fillTagsSummary(articles: Article[]) {
        let allTagsCounted = this.countEachTag(articles);
        let sortedTags = Array.from(allTagsCounted.keys()).sort() as string[];

        let tagsSummaryNode = document.getElementById("tagsSummary")!;
        UiHandler.removeAll(tagsSummaryNode);

        let listNode = document.createElement("ul");

        sortedTags.forEach(tagName => {
            let aNode = document.createElement("a");
            aNode.innerText = "#" + tagName + "(" + allTagsCounted.get(tagName) + ")";
            aNode.href = "#";
            aNode.onclick = () => { this.onArticleTagClicked(tagName); };
            let itemNode = document.createElement("li");
            itemNode.appendChild(aNode);
            listNode.appendChild(itemNode);
        });
        tagsSummaryNode.appendChild(listNode);
    }

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
    private static removeAll(node: HTMLElement) {
        while (node.firstChild) {
            node.removeChild(node.lastChild!);
        }
    }

    // MISC
    // ------------========================================================------------

    // TODO move inside article
    validateArticle(article: Article): boolean {
        if (article.title.trim().length == 0) {
            alert("title must not be empty!");
            return false;
        }
        return true;
    }

    createArticleNode(article: Article) {
        let articleTitle = document.createElement("h1");
        articleTitle.classList.add("articleTitle");
        let articleTitleLink = document.createElement("a");
        articleTitleLink.innerText = article.title;
        articleTitleLink.href = "#";
        articleTitleLink.onclick = () => { this.onArticleTitleClicked(article); };
        articleTitle.appendChild(articleTitleLink);

        let articleTags = document.createElement("p");
        articleTags.classList.add("articleTags");

        article.tags.forEach((tag) => {
            let tagNode = document.createElement("a");
            tagNode.classList.add("clickableTag");
            tagNode.innerText = "#" + tag;
            tagNode.href = "#";
            tagNode.onclick = () => { this.onArticleTagClicked(tag); };
            articleTags.appendChild(tagNode);
        });

        let articleBody = document.createElement("p");
        articleBody.classList.add("articleBody");
        articleBody.innerText = article.body;

        let articleNode = document.createElement("div");
            articleNode.classList.add("articleNode");
            articleNode.appendChild(articleTitle);
            articleNode.appendChild(articleTags);
            articleNode.appendChild(articleBody);
        return articleNode;
    }

    switchButtonsToCreateMode(isCreateMode: boolean) {
        IndexHtml.btnCreate().hidden = !isCreateMode;
        document.getElementById("btnUpdate")!.hidden = isCreateMode;
        document.getElementById("btnCancel")!.hidden = isCreateMode;
        document.getElementById("btnDelete")!.hidden = isCreateMode;
    }

    // COMMON
    // ------------========================================================------------

    getInputValue(selector: string): string {
        return (<HTMLInputElement>document.getElementById(selector)).value;
    }

    setInputValue(selector: string, newValue: string) {
        (<HTMLInputElement>document.getElementById(selector)).value = newValue;
    }

    scrollToTop() {
        document.body.scrollTop = 0; // safari
        document.documentElement.scrollTop = 0; // chrome, firefox, IE, opera
    }

}
