"use strict";
exports.__esModule = true;
console.log("preload.ts");
var Articles_1 = require("./Articles");
// ON READY
// ------------========================================================------------
window.addEventListener('DOMContentLoaded', function () {
    console.log("on DOMContentLoaded");
    addArticleNodes(Articles_1["default"].loadArticles());
    document.getElementById("btnCreate").addEventListener("click", onCreateClicked);
    document.getElementById("btnUpdate").addEventListener("click", onUpdateClicked);
    document.getElementById("btnCancel").addEventListener("click", onCancelClicked);
    document.getElementById("btnDelete").addEventListener("click", onDeleteClicked);
    switchButtonsToCreateMode(true);
});
// CLICK HANDLER
// ------------========================================================------------
function onCreateClicked() {
    console.log("onCreateClicked()");
    var article = readArticleFromUI(randomUuid());
    if (!validateArticle(article)) {
        return;
    }
    Articles_1["default"].saveArticle(article);
    addArticleNodes([article]);
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
    setInputValue("inpBody", article.body);
    setInputValue("inpTags", article.tags.join(" "));
    switchButtonsToCreateMode(false);
}
// UI LOGIC
// ------------========================================================------------
function addArticleNodes(articles) {
    var articleList = document.getElementById("articleList");
    articles.forEach;
    articles.forEach(function (article) {
        articleList.prepend(createArticleNode(article));
    });
}
function readArticleFromUI(givenId) {
    if (givenId === void 0) { givenId = undefined; }
    return {
        id: (givenId !== undefined) ? givenId : getInputValue("inpId"),
        title: getInputValue("inpTitle"),
        body: getInputValue("inpBody"),
        tags: getInputValue("inpTags").split(" ").filter(function (it) { return it.length > 0; })
    };
}
function resetInputs() {
    setInputValue("inpId", "");
    setInputValue("inpTitle", "");
    setInputValue("inpBody", "");
    setInputValue("inpTags", "");
}
function resetArticleList() {
    var articleList = document.getElementById("articleList");
    while (articleList.firstChild) {
        articleList.removeChild(articleList.lastChild);
    }
    ;
    addArticleNodes(Articles_1["default"].loadArticles());
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
    articleTitle.appendChild(articleTitleLink);
    var articleBody = document.createElement("p");
    articleBody.classList.add("articleBody");
    articleBody.innerText = article.body;
    var articleTags = document.createElement("p");
    articleTags.classList.add("articleTags");
    articleTags.innerText = article.tags.map(function (tag) {
        return "#" + tag;
    }).join(" ");
    articleTitleLink.onclick = function () {
        onArticleTitleClicked(article);
    };
    var articleNode = document.createElement("div");
    articleNode.classList.add("articleNode");
    articleNode.appendChild(articleTitle);
    articleNode.appendChild(articleBody);
    articleNode.appendChild(articleTags);
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
