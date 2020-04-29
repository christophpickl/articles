
console.log("preload.ts");

import { Article } from './common';
import Articles from './Articles';

// ON READY
// ------------========================================================------------

window.addEventListener('DOMContentLoaded', () => {
    console.log("on DOMContentLoaded");
    document.addEventListener('keydown', function(event) {
        const key = event.key; // Or const {key} = event; in ES6+
        if (event.metaKey && key == "f") {
            document.getElementById("inpSearch")!.focus();
        }
    });

    resetArticleList()
    document.getElementById("btnCancelSearch")!.hidden = true;

    document.getElementById("btnCreate")!.addEventListener("click", onCreateClicked); 
    document.getElementById("btnUpdate")!.addEventListener("click", onUpdateClicked); 
    document.getElementById("btnCancel")!.addEventListener("click", onCancelClicked); 
    document.getElementById("btnDelete")!.addEventListener("click", onDeleteClicked); 
    registerSearchListener();
    
    switchButtonsToCreateMode(true);
});

// UI HANDLER
// ------------========================================================------------


function onCreateClicked() {
    console.log("onCreateClicked()");
    
    var article = readArticleFromUI(randomUuid());
    if(!validateArticle(article)) {
        return;
    }
    Articles.saveArticle(article);
    resetArticleList();
    updateArticleForm(article);
}

function onUpdateClicked() {
    console.log("onUpdateClicked()");
    let article = readArticleFromUI();
    if(!validateArticle(article)) {
        return;
    }
    Articles.updateArticle(article);
    resetArticleList();
}

function onCancelClicked() {
    console.log("onCancelClicked()");
    resetInputs();
    switchButtonsToCreateMode(true);
}

function onDeleteClicked() {
    console.log("onDeleteClicked()");
    Articles.deleteArticle(getInputValue("inpId"));
    resetArticleList();
    resetInputs();
    switchButtonsToCreateMode(true);
}

function onArticleTitleClicked(article: Article) {
    scrollToTop();
    updateArticleForm(article);
}

function onArticleTagClicked(tag: string) {
    let oldSearch = getInputValue("inpSearch");
    let tagHashed = "#" + tag;
    let newSearch = (oldSearch.length == 0) ? tagHashed  : oldSearch + " " + tagHashed;
    setInputValue("inpSearch", newSearch);
    onSearchInput();
}

// SEARCH
// ------------========================================================------------

function registerSearchListener() {
    document.getElementById("inpSearch")!.addEventListener("input", onSearchInput); 
    document.getElementById("inpSearch")!.addEventListener('keydown', function(event) {
        const key = event.key; // Or const {key} = event; in ES6+
        if (key === "Escape") {
            resetSearch();
        }
    });
    document.getElementById("btnCancelSearch")!.addEventListener("click", resetSearch); 
}

function onSearchInput() {
    let searchTerm: string = getInputValue("inpSearch").trim()
    let terms = searchTerm.split(" ").filter((it) => { return it.length != 0});
    console.log("onSearchInput("+searchTerm+") => terms:", terms);
    if (terms.length == 0) {
        resetSearch();
        return;
    }
    document.getElementById("btnCancelSearch")!.hidden = false;
    let articles = Articles.searchArticles(terms);
    removeAndPrependArticleNodes(articles);
}

function resetSearch() {
    setInputValue("inpSearch", "");
    document.getElementById("btnCancelSearch")!.hidden = true;
    Articles.disableSearch();
    resetArticleList();
}

// UI LOGIC
// ------------========================================================------------

function readArticleFromUI(givenId: string | undefined = undefined): Article {
    return new Article(
        (givenId !== undefined) ? givenId : getInputValue("inpId"),
        getInputValue("inpTitle"),
        getInputValue("inpTags").split(" ").filter(function(it) { return it.length > 0; }),
        getInputValue("inpBody")
    );
}

function updateArticleForm(article: Article) {
    setInputValue("inpId", article.id);
    setInputValue("inpTitle", article.title);
    setInputValue("inpTags", article.tags.join(" "));
    setInputValue("inpBody", article.body);
    switchButtonsToCreateMode(false);
}

function resetInputs() {
    setInputValue("inpId", "");
    setInputValue("inpTitle", "");
    setInputValue("inpTags", "");
    setInputValue("inpBody", "");
}

function resetArticleList() {
    let articles = Articles.loadArticles();
    removeAndPrependArticleNodes(articles);
}


function removeAndPrependArticleNodes(articles: Article[]) {
    let articleList = document.getElementById("articleList")!;
    while (articleList.firstChild) {
        articleList.removeChild(articleList.lastChild!);
    };
    articles.forEach(function(article) {
        articleList.prepend(createArticleNode(article));
    });
    fillTagsSummary(articles);
}

function fillTagsSummary(articles: Article[]) {
    let uniqueTags = new Set();
    articles.forEach((article) => {
        article.tags.forEach((tag) => {
            uniqueTags.add(tag)
        });
    });
    let tagsText = Array.from(uniqueTags).sort().map((it)=>{ return "#" + it; }).join(" ");
    document.getElementById("tagsSummary")!.innerText = tagsText;
}

// MISC
// ------------========================================================------------

// TODO move inside article
function validateArticle(article: Article): boolean {
    if (article.title.trim().length == 0) {
        alert("Title must not be empty!");
        return false;
    }
    return true;
}


function createArticleNode(article: Article) {
    let articleTitle = document.createElement("h1");
    articleTitle.classList.add("articleTitle");
    let articleTitleLink = document.createElement("a");
    articleTitleLink.innerText = article.title;
    articleTitleLink.href = "#";
    articleTitleLink.onclick = () => { onArticleTitleClicked(article); };
    articleTitle.appendChild(articleTitleLink);

    let articleTags = document.createElement("p");
    articleTags.classList.add("articleTags");

    article.tags.forEach((tag) => {
        let tagNode = document.createElement("a");
        tagNode.classList.add("clickableTag");
        tagNode.innerText = "#" + tag;
        tagNode.href = "#";
        tagNode.onclick = () => { onArticleTagClicked(tag); };
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

function switchButtonsToCreateMode(isCreateMode: boolean) {
    document.getElementById("btnCreate")!.hidden = isCreateMode ? false : true;
    document.getElementById("btnUpdate")!.hidden = isCreateMode ? true : false;
    document.getElementById("btnCancel")!.hidden = isCreateMode ? true : false;
    document.getElementById("btnDelete")!.hidden = isCreateMode ? true : false;
}


// COMMON
// ------------========================================================------------

function getInputValue(selector: string): string {
    return (<HTMLInputElement>document.getElementById(selector)).value;
}

function setInputValue(selector: string, newValue: string) {
    (<HTMLInputElement>document.getElementById(selector)).value = newValue;
}

function scrollToTop() {
    document.body.scrollTop = 0; // safari
    document.documentElement.scrollTop = 0; // chrome, firefox, IE, opera
}

function randomUuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}
