
import { Article, randomUuid } from './common';
import Articles from './Articles';

export default class UiHandler {

    static init() {
        console.log("init()");
        document.addEventListener('keydown', function(event) {
            const key = event.key; // Or const {key} = event; in ES6+
            if (event.metaKey && key == "f") {
                document.getElementById("inpSearch")!.focus();
            }
        });

        UiHandler.resetArticleList()
        document.getElementById("btnCancelSearch")!.hidden = true;

        document.getElementById("btnCreate")!.addEventListener("click", UiHandler.onCreateClicked); 
        document.getElementById("btnUpdate")!.addEventListener("click", UiHandler.onUpdateClicked); 
        document.getElementById("btnCancel")!.addEventListener("click", UiHandler.onCancelClicked); 
        document.getElementById("btnDelete")!.addEventListener("click", UiHandler.onDeleteClicked); 
        UiHandler.registerSearchListener();
        
        UiHandler.switchButtonsToCreateMode(true);
    }
    // UI HANDLER
    // ------------========================================================------------
    
    static onCreateClicked() {
        console.log("onCreateClicked()");
    
        var article = UiHandler.readArticleFromUI(randomUuid());
        if(!UiHandler.validateArticle(article)) {
            return;
        }
        Articles.saveArticle(article);
        UiHandler.resetArticleList();
        UiHandler.resetInputs();
    }

    static onUpdateClicked() {
        console.log("onUpdateClicked()");
        let article = UiHandler.readArticleFromUI();
        if(!UiHandler.validateArticle(article)) {
            return;
        }
        Articles.updateArticle(article);
        UiHandler.resetArticleList();
    }

    static onCancelClicked() {
        console.log("onCancelClicked()");
        UiHandler.resetInputs();
    }

    static onDeleteClicked() {
        console.log("onDeleteClicked()");
        Articles.deleteArticle(UiHandler.getInputValue("inpId"));
        UiHandler.resetArticleList();
        UiHandler.resetInputs();
    }

    static onArticleTitleClicked(article: Article) {
        UiHandler.scrollToTop();
        UiHandler.updateArticleForm(article);
    }

    static onArticleTagClicked(tag: string) {
        let oldSearch = UiHandler.getInputValue("inpSearch");
        let tagHashed = "#" + tag;
        let newSearch = (oldSearch.length == 0) ? tagHashed  : oldSearch + " " + tagHashed;
        UiHandler.setInputValue("inpSearch", newSearch);
        UiHandler.onSearchInput();
    }

    // SEARCH
    // ------------========================================================------------

    static registerSearchListener() {
        document.getElementById("inpSearch")!.addEventListener("input", UiHandler.onSearchInput); 
        document.getElementById("inpSearch")!.addEventListener('keydown', function(event) {
            const key = event.key; // Or const {key} = event; in ES6+
            if (key === "Escape") {
                UiHandler.resetSearch();
            }
        });
        document.getElementById("btnCancelSearch")!.addEventListener("click", UiHandler.resetSearch); 
    }

    static onSearchInput() {
        let searchTerm: string = UiHandler.getInputValue("inpSearch").trim()
        let terms = searchTerm.split(" ").filter((it) => { return it.length != 0});
        console.log("onSearchInput("+searchTerm+") => terms:", terms);
        if (terms.length == 0) {
            UiHandler.resetSearch();
            return;
        }
        document.getElementById("btnCancelSearch")!.hidden = false;
        let articles = Articles.searchArticles(terms);
        UiHandler.removeAndPrependArticleNodes(articles);
    }

    static resetSearch() {
        UiHandler.setInputValue("inpSearch", "");
        document.getElementById("btnCancelSearch")!.hidden = true;
        Articles.disableSearch();
        UiHandler.resetArticleList();
    }

    // UI LOGIC
    // ------------========================================================------------

    static readArticleFromUI(givenId: string | undefined = undefined): Article {
        return new Article(
            (givenId !== undefined) ? givenId : UiHandler.getInputValue("inpId"),
            UiHandler.getInputValue("inpTitle"),
            UiHandler.getInputValue("inpTags").split(" ").filter(function(it) { return it.length > 0; }),
            UiHandler.getInputValue("inpBody")
        );
    }

    static updateArticleForm(article: Article) {
        UiHandler.setInputValue("inpId", article.id);
        UiHandler.setInputValue("inpTitle", article.title);
        UiHandler.setInputValue("inpTags", article.tags.join(" "));
        UiHandler.setInputValue("inpBody", article.body);
        UiHandler.switchButtonsToCreateMode(false);
    }

    static resetInputs() {
        UiHandler.setInputValue("inpId", "");
        UiHandler.setInputValue("inpTitle", "");
        UiHandler.setInputValue("inpTags", "");
        UiHandler.setInputValue("inpBody", "");
        UiHandler.switchButtonsToCreateMode(true);
    }

    static resetArticleList() {
        let articles = Articles.loadArticles();
        UiHandler.removeAndPrependArticleNodes(articles);
    }


    static removeAndPrependArticleNodes(articles: Article[]) {
        let articleList = document.getElementById("articleList")!;
        UiHandler.removeAll(articleList);
        articles.forEach(function(article) {
            articleList.prepend(UiHandler.createArticleNode(article));
        });
        UiHandler.fillTagsSummary(articles);
    }

    static fillTagsSummary(articles: Article[]) {
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
        let sortedTags = Array.from(allTagsCounted.keys()).sort() as string[];

        let tagsNode = document.getElementById("tagsSummary")!;
        UiHandler.removeAll(tagsNode);
        
        sortedTags.forEach(tagName => {
            let tagNode = document.createElement("a");
            tagNode.innerText = "#" + tagName + "(" + allTagsCounted.get(tagName) + ") ";
            tagNode.href = "#";
            tagNode.classList.add("tagSummaryLink");
            tagNode.onclick = () => { UiHandler.onArticleTagClicked(tagName); };
            tagsNode.appendChild(tagNode);
        });
    }

    private static removeAll(node: HTMLElement) {
        while (node.firstChild) {
            node.removeChild(node.lastChild!);
        };
    }

    // MISC
    // ------------========================================================------------

    // TODO move inside article
    static validateArticle(article: Article): boolean {
        if (article.title.trim().length == 0) {
            alert("Title must not be empty!");
            return false;
        }
        return true;
    }

    static createArticleNode(article: Article) {
        let articleTitle = document.createElement("h1");
        articleTitle.classList.add("articleTitle");
        let articleTitleLink = document.createElement("a");
        articleTitleLink.innerText = article.title;
        articleTitleLink.href = "#";
        articleTitleLink.onclick = () => { UiHandler.onArticleTitleClicked(article); };
        articleTitle.appendChild(articleTitleLink);

        let articleTags = document.createElement("p");
        articleTags.classList.add("articleTags");

        article.tags.forEach((tag) => {
            let tagNode = document.createElement("a");
            tagNode.classList.add("clickableTag");
            tagNode.innerText = "#" + tag;
            tagNode.href = "#";
            tagNode.onclick = () => { UiHandler.onArticleTagClicked(tag); };
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

    static switchButtonsToCreateMode(isCreateMode: boolean) {
        document.getElementById("btnCreate")!.hidden = isCreateMode ? false : true;
        document.getElementById("btnUpdate")!.hidden = isCreateMode ? true : false;
        document.getElementById("btnCancel")!.hidden = isCreateMode ? true : false;
        document.getElementById("btnDelete")!.hidden = isCreateMode ? true : false;
    }

    // COMMON
    // ------------========================================================------------

    static getInputValue(selector: string): string {
        return (<HTMLInputElement>document.getElementById(selector)).value;
    }

    static setInputValue(selector: string, newValue: string) {
        (<HTMLInputElement>document.getElementById(selector)).value = newValue;
    }

    static scrollToTop() {
        document.body.scrollTop = 0; // safari
        document.documentElement.scrollTop = 0; // chrome, firefox, IE, opera
    }

}
