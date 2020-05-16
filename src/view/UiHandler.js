"use strict";
exports.__esModule = true;
var common_1 = require("../common");
var IndexHtml_1 = require("./IndexHtml");
var UiHandler = /** @class */ (function () {
    function UiHandler(articleRepo) {
        this.articleRepo = articleRepo;
    }
    UiHandler.prototype.init = function () {
        var _this = this;
        console.log("init()");
        document.addEventListener('keydown', function (event) {
            var key = event.key; // Or const {key} = event; in ES6+
            if (event.metaKey && key == "f") {
                document.getElementById("inpSearch").focus();
            }
        });
        this.resetArticleList();
        IndexHtml_1["default"].btnCancelSearchVisible(false);
        IndexHtml_1["default"].onClick(IndexHtml_1["default"].btnCreate(), function () { _this.onCreateClicked(); });
        IndexHtml_1["default"].onClick(IndexHtml_1["default"].btnUpdate(), function () { _this.onUpdateClicked(); });
        IndexHtml_1["default"].onClick(IndexHtml_1["default"].btnCancel(), function () { _this.onCancelClicked(); });
        IndexHtml_1["default"].onClick(IndexHtml_1["default"].btnDelete(), function () { _this.onDeleteClicked(); });
        this.registerSearchListener();
        this.switchButtonsToCreateMode(true);
    };
    UiHandler.prototype.onCreateClicked = function () {
        console.log("onCreateClicked()");
        var article = this.readArticleFromUI(common_1.randomUuid());
        var now = new Date();
        article.created = now;
        article.updated = now;
        article.likes = 0;
        if (!this.validateArticle(article)) {
            return;
        }
        this.articleRepo.saveArticle(article);
        this.resetArticleList();
        this.resetInputs();
    };
    UiHandler.prototype.onUpdateClicked = function () {
        console.log("onUpdateClicked()");
        var article = this.readArticleFromUI();
        if (!this.validateArticle(article)) {
            return;
        }
        article.updated = new Date();
        this.setInputValue("inpUpdated", JSON.stringify(article.updated).split("\"").join("")); // pseudo replaceAll :-/
        this.articleRepo.updateArticle(article);
        this.resetArticleList();
    };
    UiHandler.prototype.onCancelClicked = function () {
        console.log("onCancelClicked()");
        this.resetInputs();
    };
    UiHandler.prototype.onDeleteClicked = function () {
        console.log("onDeleteClicked()");
        this.articleRepo.deleteArticle(this.getInputValue("inpId"));
        this.resetArticleList();
        this.resetInputs();
    };
    UiHandler.prototype.onArticleTitleClicked = function (article) {
        this.scrollToTop();
        this.updateArticleForm(article);
    };
    UiHandler.prototype.onArticleTagClicked = function (tag) {
        var oldSearch = this.getInputValue("inpSearch");
        var tagHashed = "#" + tag;
        var newSearch = (oldSearch.length == 0) ? tagHashed : oldSearch + " " + tagHashed;
        this.setInputValue("inpSearch", newSearch);
        this.onSearchInput();
    };
    // SEARCH
    // ------------========================================================------------
    UiHandler.prototype.registerSearchListener = function () {
        var _this = this;
        IndexHtml_1["default"].onInpSearchInput(function () { _this.onSearchInput(); });
        document.getElementById("inpSearch").addEventListener("input", this.onSearchInput);
        document.getElementById("inpSearch").addEventListener('keydown', function (event) {
            var key = event.key; // Or const {key} = event; in ES6+
            if (key === "Escape") {
                _this.resetSearch();
            }
        });
        IndexHtml_1["default"].onClick(IndexHtml_1["default"].btnCancelSearch(), function () { _this.resetSearch(); });
    };
    UiHandler.prototype.onSearchInput = function () {
        var searchTerm = this.getInputValue("inpSearch").trim();
        var terms = searchTerm.split(" ").filter(function (it) { return it.length != 0; });
        console.log("onSearchInput(" + searchTerm + ") => terms:", terms);
        if (terms.length == 0) {
            this.resetSearch();
            return;
        }
        var articles = this.articleRepo.searchArticles(terms);
        this.removeAndPrependArticleNodes(articles);
        document.getElementById("btnCancelSearch").hidden = false;
    };
    UiHandler.prototype.resetSearch = function () {
        this.setInputValue("inpSearch", "");
        this.articleRepo.disableSearch();
        this.resetArticleList();
        document.getElementById("btnCancelSearch").hidden = true;
    };
    // UI LOGIC
    // ------------========================================================------------
    UiHandler.prototype.readArticleFromUI = function (givenId) {
        if (givenId === void 0) { givenId = undefined; }
        var now = new Date();
        return {
            id: (givenId !== undefined) ? givenId : this.getInputValue("inpId"),
            title: this.getInputValue("inpTitle"),
            tags: this.getInputValue("inpTags").split(" ").filter(function (it) { return it.length > 0; }),
            body: this.getInputValue("inpBody"),
            created: new Date(this.getInputValue("inpCreated")),
            updated: new Date(this.getInputValue("inpUpdated")),
            likes: parseInt(this.getInputValue("inpLikes"))
        };
    };
    UiHandler.prototype.updateArticleForm = function (article) {
        this.setInputValue("inpId", article.id);
        this.setInputValue("inpTitle", article.title);
        this.setInputValue("inpTags", article.tags.join(" "));
        this.setInputValue("inpBody", article.body);
        this.setInputValue("inpCreated", article.created.toString());
        this.setInputValue("inpUpdated", article.updated.toString());
        this.setInputValue("inpLikes", article.likes.toString());
        this.switchButtonsToCreateMode(false);
    };
    UiHandler.prototype.resetInputs = function () {
        this.setInputValue("inpId", "");
        this.setInputValue("inpTitle", "");
        this.setInputValue("inpTags", "");
        this.setInputValue("inpBody", "");
        this.setInputValue("inpCreated", "");
        this.setInputValue("inpUpdated", "");
        this.setInputValue("inpLikes", "");
        this.switchButtonsToCreateMode(true);
    };
    UiHandler.prototype.resetArticleList = function () {
        var articles = this.articleRepo.loadArticles();
        this.removeAndPrependArticleNodes(articles);
    };
    UiHandler.prototype.removeAndPrependArticleNodes = function (articles) {
        var _this = this;
        var articleList = document.getElementById("articleList");
        this.removeAll(articleList);
        articles.forEach(function (article) {
            articleList.prepend(_this.createArticleNode(article));
        });
        this.fillTagsSummary(articles);
    };
    UiHandler.prototype.fillTagsSummary = function (articles) {
        var _this = this;
        var allTagsCounted = this.countEachTag(articles);
        var sortedTags = Array.from(allTagsCounted.keys()).sort();
        var tagsSummaryNode = document.getElementById("tagsSummary");
        this.removeAll(tagsSummaryNode);
        var listNode = document.createElement("ul");
        sortedTags.forEach(function (tagName) {
            var aNode = document.createElement("a");
            aNode.innerText = "#" + tagName + "(" + allTagsCounted.get(tagName) + ")";
            aNode.href = "#";
            aNode.classList.add("tagSummaryLink");
            aNode.onclick = function () { _this.onArticleTagClicked(tagName); };
            var itemNode = document.createElement("li");
            itemNode.appendChild(aNode);
            listNode.appendChild(itemNode);
        });
        tagsSummaryNode.appendChild(listNode);
    };
    UiHandler.prototype.countEachTag = function (articles) {
        var allTagsCounted = new Map();
        articles.forEach(function (article) {
            article.tags.forEach(function (tag) {
                if (!allTagsCounted.has(tag)) {
                    allTagsCounted.set(tag, 0);
                }
                var oldTagCount = allTagsCounted.get(tag);
                allTagsCounted.set(tag, oldTagCount + 1);
            });
        });
        return allTagsCounted;
    };
    /** general utility method / extension function */
    UiHandler.prototype.removeAll = function (node) {
        while (node.firstChild) {
            node.removeChild(node.lastChild);
        }
        ;
    };
    // MISC
    // ------------========================================================------------
    // TODO move inside article
    UiHandler.prototype.validateArticle = function (article) {
        if (article.title.trim().length == 0) {
            alert("title must not be empty!");
            return false;
        }
        return true;
    };
    UiHandler.prototype.createArticleNode = function (article) {
        var _this = this;
        var articleTitle = document.createElement("h1");
        articleTitle.classList.add("articleTitle");
        var articleTitleLink = document.createElement("a");
        articleTitleLink.innerText = article.title;
        articleTitleLink.href = "#";
        articleTitleLink.onclick = function () { _this.onArticleTitleClicked(article); };
        articleTitle.appendChild(articleTitleLink);
        var articleTags = document.createElement("p");
        articleTags.classList.add("articleTags");
        article.tags.forEach(function (tag) {
            var tagNode = document.createElement("a");
            tagNode.classList.add("clickableTag");
            tagNode.innerText = "#" + tag;
            tagNode.href = "#";
            tagNode.onclick = function () { _this.onArticleTagClicked(tag); };
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
    };
    UiHandler.prototype.switchButtonsToCreateMode = function (isCreateMode) {
        IndexHtml_1["default"].btnCreate().hidden = isCreateMode ? false : true;
        document.getElementById("btnUpdate").hidden = isCreateMode ? true : false;
        document.getElementById("btnCancel").hidden = isCreateMode ? true : false;
        document.getElementById("btnDelete").hidden = isCreateMode ? true : false;
    };
    // COMMON
    // ------------========================================================------------
    UiHandler.prototype.getInputValue = function (selector) {
        return document.getElementById(selector).value;
    };
    UiHandler.prototype.setInputValue = function (selector, newValue) {
        document.getElementById(selector).value = newValue;
    };
    UiHandler.prototype.scrollToTop = function () {
        document.body.scrollTop = 0; // safari
        document.documentElement.scrollTop = 0; // chrome, firefox, IE, opera
    };
    return UiHandler;
}());
exports["default"] = UiHandler;
