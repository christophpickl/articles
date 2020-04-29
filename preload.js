"use strict";
exports.__esModule = true;
console.log("preload.ts");
var common_1 = require("./common");
var Articles_1 = require("./Articles");
// ON READY
// ------------========================================================------------
window.addEventListener('DOMContentLoaded', function () {
    console.log("on DOMContentLoaded");
    resetArticleList();
    document.getElementById("btnCreate").addEventListener("click", onCreateClicked);
    document.getElementById("btnUpdate").addEventListener("click", onUpdateClicked);
    document.getElementById("btnCancel").addEventListener("click", onCancelClicked);
    document.getElementById("btnDelete").addEventListener("click", onDeleteClicked);
    document.getElementById("inpSearch").addEventListener("input", onSearchInput);
    document.getElementById("inpSearch").addEventListener('keydown', function (event) {
        var key = event.key; // Or const {key} = event; in ES6+
        if (key === "Escape") {
            resetSearch();
        }
    });
    switchButtonsToCreateMode(true);
});
// UI HANDLER
// ------------========================================================------------
function onCreateClicked() {
    console.log("onCreateClicked()");
    var article = readArticleFromUI(randomUuid());
    if (!validateArticle(article)) {
        return;
    }
    Articles_1["default"].saveArticle(article);
    resetArticleList();
    // resetInputs();
}
function onUpdateClicked() {
    console.log("onUpdateClicked()");
    var article = readArticleFromUI();
    if (!validateArticle(article)) {
        return;
    }
    Articles_1["default"].updateArticle(article);
    resetArticleList();
}
function onCancelClicked() {
    console.log("onCancelClicked()");
    resetInputs();
    switchButtonsToCreateMode(true);
}
function onDeleteClicked() {
    console.log("onDeleteClicked()");
    Articles_1["default"].deleteArticle(getInputValue("inpId"));
    resetArticleList();
    resetInputs();
    switchButtonsToCreateMode(true);
}
function onArticleTitleClicked(article) {
    scrollToTop();
    setInputValue("inpId", article.id);
    setInputValue("inpTitle", article.title);
    setInputValue("inpTags", article.tags.join(" "));
    setInputValue("inpBody", article.body);
    switchButtonsToCreateMode(false);
}
function onSearchInput(event) {
    var searchTerm = event.target.value.trim();
    var terms = searchTerm.split(" ").filter(function (it) { return it.length != 0; });
    console.log("onSearchInput(" + searchTerm + ") => terms:", terms);
    // TODO register escape to cancel search as well
    if (terms.length == 0) {
        resetSearch();
        return;
    }
    var articles = Articles_1["default"].searchArticles(terms);
    removeAndPrependArticleNodes(articles);
}
// UI LOGIC
// ------------========================================================------------
function resetSearch() {
    setInputValue("inpSearch", "");
    Articles_1["default"].disableSearch();
    resetArticleList();
}
function readArticleFromUI(givenId) {
    if (givenId === void 0) { givenId = undefined; }
    return new common_1.Article((givenId !== undefined) ? givenId : getInputValue("inpId"), getInputValue("inpTitle"), getInputValue("inpTags").split(" ").filter(function (it) { return it.length > 0; }), getInputValue("inpBody"));
}
function resetInputs() {
    setInputValue("inpId", "");
    setInputValue("inpTitle", "");
    setInputValue("inpTags", "");
    setInputValue("inpBody", "");
}
function resetArticleList() {
    var articles = Articles_1["default"].loadArticles();
    removeAndPrependArticleNodes(articles);
}
function removeAndPrependArticleNodes(articles) {
    var articleList = document.getElementById("articleList");
    while (articleList.firstChild) {
        articleList.removeChild(articleList.lastChild);
    }
    ;
    articles.forEach(function (article) {
        articleList.prepend(createArticleNode(article));
    });
}
// MISC
// ------------========================================================------------
// TODO move inside article
function validateArticle(article) {
    if (article.title.trim().length == 0) {
        alert("Title must not be empty!");
        return false;
    }
    return true;
}
function createArticleNode(article) {
    var articleTitle = document.createElement("h1");
    articleTitle.classList.add("articleTitle");
    var articleTitleLink = document.createElement("a");
    articleTitleLink.innerText = article.title;
    articleTitleLink.href = "#";
    articleTitleLink.onclick = function () { onArticleTitleClicked(article); };
    articleTitle.appendChild(articleTitleLink);
    var articleTags = document.createElement("p");
    articleTags.classList.add("articleTags");
    articleTags.innerText = article.tags.map(function (tag) {
        return "#" + tag;
    }).join(" ");
    var articleBody = document.createElement("p");
    articleBody.classList.add("articleBody");
    articleBody.innerText = article.body;
    var articleNode = document.createElement("div");
    articleNode.classList.add("articleNode");
    articleNode.appendChild(articleTitle);
    articleNode.appendChild(articleTags);
    articleNode.appendChild(articleBody);
    return articleNode;
}
function switchButtonsToCreateMode(isCreateMode) {
    document.getElementById("btnCreate").hidden = isCreateMode ? false : true;
    document.getElementById("btnUpdate").hidden = isCreateMode ? true : false;
    document.getElementById("btnCancel").hidden = isCreateMode ? true : false;
    document.getElementById("btnDelete").hidden = isCreateMode ? true : false;
}
// COMMON
// ------------========================================================------------
function getInputValue(selector) {
    return document.getElementById(selector).value;
}
function setInputValue(selector, newValue) {
    document.getElementById(selector).value = newValue;
}
function scrollToTop() {
    document.body.scrollTop = 0; // safari
    document.documentElement.scrollTop = 0; // chrome, firefox, IE, opera
}
function randomUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
