"use strict";
exports.__esModule = true;
console.log("preload.ts");
var common_1 = require("./common");
var Articles_1 = require("./Articles");
// ON READY
// ------------========================================================------------
window.addEventListener('DOMContentLoaded', function () {
    console.log("on DOMContentLoaded");
    document.addEventListener('keydown', function (event) {
        var key = event.key; // Or const {key} = event; in ES6+
        if (event.metaKey && key == "f") {
            document.getElementById("inpSearch").focus();
        }
    });
    resetArticleList();
    document.getElementById("btnCancelSearch").hidden = true;
    document.getElementById("btnCreate").addEventListener("click", onCreateClicked);
    document.getElementById("btnUpdate").addEventListener("click", onUpdateClicked);
    document.getElementById("btnCancel").addEventListener("click", onCancelClicked);
    document.getElementById("btnDelete").addEventListener("click", onDeleteClicked);
    registerSearchListener();
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
    resetInputs();
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
}
function onDeleteClicked() {
    console.log("onDeleteClicked()");
    Articles_1["default"].deleteArticle(getInputValue("inpId"));
    resetArticleList();
    resetInputs();
}
function onArticleTitleClicked(article) {
    scrollToTop();
    updateArticleForm(article);
}
function onArticleTagClicked(tag) {
    var oldSearch = getInputValue("inpSearch");
    var tagHashed = "#" + tag;
    var newSearch = (oldSearch.length == 0) ? tagHashed : oldSearch + " " + tagHashed;
    setInputValue("inpSearch", newSearch);
    onSearchInput();
}
// SEARCH
// ------------========================================================------------
function registerSearchListener() {
    document.getElementById("inpSearch").addEventListener("input", onSearchInput);
    document.getElementById("inpSearch").addEventListener('keydown', function (event) {
        var key = event.key; // Or const {key} = event; in ES6+
        if (key === "Escape") {
            resetSearch();
        }
    });
    document.getElementById("btnCancelSearch").addEventListener("click", resetSearch);
}
function onSearchInput() {
    var searchTerm = getInputValue("inpSearch").trim();
    var terms = searchTerm.split(" ").filter(function (it) { return it.length != 0; });
    console.log("onSearchInput(" + searchTerm + ") => terms:", terms);
    if (terms.length == 0) {
        resetSearch();
        return;
    }
    document.getElementById("btnCancelSearch").hidden = false;
    var articles = Articles_1["default"].searchArticles(terms);
    removeAndPrependArticleNodes(articles);
}
function resetSearch() {
    setInputValue("inpSearch", "");
    document.getElementById("btnCancelSearch").hidden = true;
    Articles_1["default"].disableSearch();
    resetArticleList();
}
// UI LOGIC
// ------------========================================================------------
function readArticleFromUI(givenId) {
    if (givenId === void 0) { givenId = undefined; }
    return new common_1.Article((givenId !== undefined) ? givenId : getInputValue("inpId"), getInputValue("inpTitle"), getInputValue("inpTags").split(" ").filter(function (it) { return it.length > 0; }), getInputValue("inpBody"));
}
function updateArticleForm(article) {
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
    switchButtonsToCreateMode(true);
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
    fillTagsSummary(articles);
}
function fillTagsSummary(articles) {
    var uniqueTags = new Set();
    articles.forEach(function (article) {
        article.tags.forEach(function (tag) {
            uniqueTags.add(tag);
        });
    });
    var tagsText = Array.from(uniqueTags).sort().map(function (it) { return "#" + it; }).join(" ");
    document.getElementById("tagsSummary").innerText = tagsText;
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
    article.tags.forEach(function (tag) {
        var tagNode = document.createElement("a");
        tagNode.classList.add("clickableTag");
        tagNode.innerText = "#" + tag;
        tagNode.href = "#";
        tagNode.onclick = function () { onArticleTagClicked(tag); };
        articleTags.appendChild(tagNode);
    });
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
