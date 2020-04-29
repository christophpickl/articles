
console.log("preload.ts");

import Articles from './Articles';
import { Article } from './common';


// ON READY
// ------------========================================================------------

window.addEventListener('DOMContentLoaded', () => {
    console.log("on DOMContentLoaded");

    addArticleNodes(Articles.loadArticles())

    document.getElementById("btnCreate")!.addEventListener("click", onCreateClicked); 
    document.getElementById("btnUpdate")!.addEventListener("click", onUpdateClicked); 
    document.getElementById("btnCancel")!.addEventListener("click", onCancelClicked); 
    document.getElementById("btnDelete")!.addEventListener("click", onDeleteClicked); 
    switchButtonsToCreateMode(true);
});

// CLICK HANDLER
// ------------========================================================------------


function onCreateClicked() {
    console.log("onCreateClicked()");
    
    var article = readArticleFromUI(randomUuid());
    if(!validateArticle(article)) {
        return;
    }
    Articles.saveArticle(article);
    addArticleNodes([article]);
    resetInputs();
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
    setInputValue("inpId", article.id);
    setInputValue("inpTitle", article.title);
    setInputValue("inpBody", article.body);
    setInputValue("inpTags", article.tags.join(" "));
    switchButtonsToCreateMode(false);
}

// UI LOGIC
// ------------========================================================------------

function addArticleNodes(articles: Array<Article>) {
    let articleList = document.getElementById("articleList")!;
    articles.forEach
    articles.forEach(function(article) {
        articleList.prepend(createArticleNode(article));
    });
}

function readArticleFromUI(givenId: string | undefined = undefined): Article {
    return { 
        id: (givenId !== undefined) ? givenId : getInputValue("inpId"),
        title: getInputValue("inpTitle"),
        body: getInputValue("inpBody"),
        tags: getInputValue("inpTags").split(" ").filter(function(it) { return it.length > 0; })
    };
}

function resetInputs() {
    setInputValue("inpId", "");
    setInputValue("inpTitle", "");
    setInputValue("inpBody", "");
    setInputValue("inpTags", "");
}

function resetArticleList() {
    let articleList = document.getElementById("articleList")!;
    while (articleList.firstChild) {
        articleList.removeChild(articleList.lastChild!);
    };
    addArticleNodes(Articles.loadArticles());
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
    articleTitle.appendChild(articleTitleLink);

    let articleBody = document.createElement("p");
    articleBody.classList.add("articleBody");
    articleBody.innerText = article.body;
    
    let articleTags = document.createElement("p");
    articleTags.classList.add("articleTags");
    articleTags.innerText = article.tags.map(function(tag) {
        return "#" + tag;
    }).join(" ");

    articleTitleLink.onclick = () => {
        onArticleTitleClicked(article);
    };

    let articleNode = document.createElement("div");
        articleNode.classList.add("articleNode");
        articleNode.appendChild(articleTitle);
        articleNode.appendChild(articleBody);
        articleNode.appendChild(articleTags);
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
