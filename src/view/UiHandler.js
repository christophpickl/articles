"use strict";
exports.__esModule = true;
var domain_1 = require("../domain");
var IndexHtml_1 = require("./IndexHtml");
var events_1 = require("./events");
var UiHandler = /** @class */ (function () {
    function UiHandler(articleService, eventBus) {
        this.articleService = articleService;
        this.eventBus = eventBus;
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
        IndexHtml_1["default"].btnCancelSearchVisible(false);
        IndexHtml_1["default"].onClick(IndexHtml_1["default"].btnCreate(), function () {
            _this.eventBus.dispatch(new events_1.CreateEvent());
        });
        IndexHtml_1["default"].onClick(IndexHtml_1["default"].btnUpdate(), function () {
            _this.eventBus.dispatch(new events_1.UpdateEvent());
        });
        IndexHtml_1["default"].onClick(IndexHtml_1["default"].btnCancel(), function () {
            _this.onCancelClicked();
        });
        IndexHtml_1["default"].onClick(IndexHtml_1["default"].btnDelete(), function () {
            _this.eventBus.dispatch(new events_1.DeleteEvent());
        });
        this.registerSearchListener();
        UiHandler.switchButtonsToCreateMode(true);
        this.removeAndPrependArticleNodes(this.articleService.loadArticles());
    };
    UiHandler.prototype.onCancelClicked = function () {
        console.log("onCancelClicked()");
        this.resetArticleForm();
    };
    UiHandler.prototype.onArticleTitleClicked = function (article) {
        this.scrollToTop();
        this.updateArticleForm(article);
    };
    UiHandler.prototype.onArticleTagClicked = function (clickedTag) {
        var oldSearch = IndexHtml_1["default"].inpSearch().value;
        var tagHashed = "#" + clickedTag;
        // TODO UI: mit SHIFT+click auf tag: reset search to only this tag
        IndexHtml_1["default"].inpSearch().value = (oldSearch.length == 0) ? tagHashed : oldSearch + " " + tagHashed;
        this.onSearchInput();
    };
    // SEARCH
    // ------------========================================================------------
    UiHandler.prototype.registerSearchListener = function () {
        var _this = this;
        IndexHtml_1["default"].onInpSearchInput(function () {
            _this.onSearchInput();
        });
        IndexHtml_1["default"].inpSearch().addEventListener("input", function () {
            _this.onSearchInput();
        });
        IndexHtml_1["default"].inpSearch().addEventListener('keydown', function (event) {
            var key = event.key; // Or const {key} = event; in ES6+
            if (key === "Escape") {
                _this.resetSearch();
            }
        });
        IndexHtml_1["default"].onClick(IndexHtml_1["default"].btnCancelSearch(), function () {
            _this.resetSearch();
        });
    };
    UiHandler.prototype.onSearchInput = function () {
        var searchTerm = IndexHtml_1["default"].inpSearch().value.trim();
        var terms = searchTerm.split(" ").filter(function (it) {
            return it.length != 0;
        });
        console.log("onSearchInput(" + searchTerm + ") => terms:", terms);
        if (terms.length == 0) {
            this.resetSearch();
            return;
        }
        var articles = this.articleService.searchArticles(terms);
        this.removeAndPrependArticleNodes(articles);
        document.getElementById("btnCancelSearch").hidden = false;
    };
    UiHandler.prototype.resetSearch = function () {
        IndexHtml_1["default"].inpSearch().value = "";
        this.removeAndPrependArticleNodes(this.articleService.disableSearch());
        document.getElementById("btnCancelSearch").hidden = true;
    };
    // UI LOGIC
    // ------------========================================================------------
    UiHandler.prototype.writeArticleUpdatedInputValue = function (updated) {
        IndexHtml_1["default"].inpUpdated().value = updated;
    };
    UiHandler.prototype.readArticleFromUI = function (givenId) {
        if (givenId === void 0) { givenId = undefined; }
        return new domain_1.Article(
        /*id*/ (givenId !== undefined) ? givenId : IndexHtml_1["default"].inpId().value, 
        /*title*/ IndexHtml_1["default"].inpTitle().value, 
        /*tags*/ IndexHtml_1["default"].inpTags().value.split(" ").filter(function (it) {
            return it.length > 0;
        }), 
        /*body*/ IndexHtml_1["default"].inpBody().value, 
        /*created*/ new Date(IndexHtml_1["default"].inpCreated().value), 
        /*updated*/ new Date(IndexHtml_1["default"].btnUpdate().value), 
        /*likes*/ parseInt(IndexHtml_1["default"].inpLikes().value));
    };
    UiHandler.prototype.updateArticleForm = function (article) {
        IndexHtml_1["default"].inpId().value = article.id;
        IndexHtml_1["default"].inpTitle().value = article.title;
        IndexHtml_1["default"].inpTags().value = article.tags.join(" ");
        IndexHtml_1["default"].inpBody().value = article.body;
        IndexHtml_1["default"].inpCreated().value = article.created.toString();
        IndexHtml_1["default"].inpUpdated().value = article.updated.toString();
        IndexHtml_1["default"].inpLikes().value = article.likes.toString();
        UiHandler.switchButtonsToCreateMode(false);
    };
    UiHandler.prototype.resetArticleForm = function () {
        IndexHtml_1["default"].inpId().value = "";
        IndexHtml_1["default"].inpTitle().value = "";
        IndexHtml_1["default"].inpTags().value = "";
        IndexHtml_1["default"].inpBody().value = "";
        IndexHtml_1["default"].inpCreated().value = "";
        IndexHtml_1["default"].inpUpdated().value = "";
        IndexHtml_1["default"].inpLikes().value = "";
        UiHandler.switchButtonsToCreateMode(true);
    };
    UiHandler.prototype.removeAndPrependArticleNodes = function (articles) {
        var _this = this;
        var articleList = IndexHtml_1["default"].articleList();
        UiHandler.removeAllChildren(articleList);
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
        UiHandler.removeAllChildren(tagsSummaryNode);
        var listNode = document.createElement("ul");
        sortedTags.forEach(function (tagName) {
            var aNode = document.createElement("a");
            aNode.innerText = "#" + tagName + "(" + allTagsCounted.get(tagName) + ")";
            aNode.href = "#";
            aNode.onclick = function () {
                _this.onArticleTagClicked(tagName);
            };
            var itemNode = document.createElement("li");
            itemNode.appendChild(aNode);
            listNode.appendChild(itemNode);
        });
        tagsSummaryNode.appendChild(listNode);
    };
    // TODO outsource
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
    UiHandler.removeAllChildren = function (node) {
        while (node.firstChild) {
            node.removeChild(node.lastChild);
        }
    };
    UiHandler.prototype.addArticle = function (article) {
        IndexHtml_1["default"].articleList().prepend(this.createArticleNode(article));
    };
    UiHandler.prototype.deleteArticle = function (id) {
        var child = UiHandler.findArticleChildNodeById(id);
        IndexHtml_1["default"].articleList().removeChild(child);
    };
    UiHandler.prototype.createArticleNode = function (article) {
        var _this = this;
        var articleTitle = document.createElement("h1");
        articleTitle.classList.add(UiHandler.CLASS_TITLE);
        var articleTitleLink = document.createElement("a");
        articleTitleLink.innerText = article.title;
        articleTitleLink.href = "#";
        articleTitleLink.onclick = function () {
            _this.onArticleTitleClicked(article);
        };
        articleTitle.appendChild(articleTitleLink);
        var articleTags = document.createElement("p");
        articleTags.classList.add(UiHandler.CLASS_TAGS);
        this.resetTags(articleTags, article.tags);
        var articleBody = document.createElement("pre");
        articleBody.classList.add(UiHandler.CLASS_BODY);
        articleBody.innerText = article.body;
        var articleNode = document.createElement("div");
        articleNode.setAttribute(UiHandler.ATTR_ARTIFACT_ID, article.id);
        articleNode.classList.add("articleNode");
        articleNode.appendChild(articleTitle);
        articleNode.appendChild(articleTags);
        articleNode.appendChild(articleBody);
        return articleNode;
    };
    UiHandler.prototype.resetTags = function (html, tags) {
        var _this = this;
        UiHandler.removeAllChildren(html);
        tags.forEach(function (tag) {
            var tagNode = document.createElement("a");
            tagNode.classList.add("clickableTag");
            tagNode.innerText = "#" + tag;
            tagNode.href = "#";
            tagNode.onclick = function () {
                _this.onArticleTagClicked(tag);
            };
            html.appendChild(tagNode);
        });
    };
    UiHandler.findArticleChildNodeById = function (articleId) {
        var list = IndexHtml_1["default"].articleList();
        var children = list.children;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var currentId = child.getAttribute(UiHandler.ATTR_ARTIFACT_ID);
            if (currentId == articleId) {
                return child;
            }
        }
        throw new Error("Article not found by ID [" + articleId + "]!");
    };
    UiHandler.prototype.updateArticleNode = function (article) {
        var _this = this;
        var child = UiHandler.findArticleChildNodeById(article.id);
        var articleTitleLink = child.getElementsByClassName(UiHandler.CLASS_TITLE)[0].firstChild;
        articleTitleLink.innerHTML = article.title;
        articleTitleLink.onclick = function () {
            _this.onArticleTitleClicked(article);
        };
        this.resetTags(child.getElementsByClassName(UiHandler.CLASS_TAGS)[0], article.tags);
        child.getElementsByClassName(UiHandler.CLASS_BODY)[0].innerHTML = article.body;
    };
    // COMMON
    // ------------========================================================------------
    UiHandler.switchButtonsToCreateMode = function (isCreateMode) {
        IndexHtml_1["default"].btnCreate().hidden = !isCreateMode;
        IndexHtml_1["default"].btnUpdate().hidden = isCreateMode;
        IndexHtml_1["default"].btnCancel().hidden = isCreateMode;
        IndexHtml_1["default"].btnDelete().hidden = isCreateMode;
    };
    // TODO use IndexHtml instead
    UiHandler.getInputValue = function (selector) {
        return document.getElementById(selector).value;
    };
    UiHandler.setInputValue = function (selector, newValue) {
        document.getElementById(selector).value = newValue;
    };
    // TODO make public and use from controller
    UiHandler.prototype.scrollToTop = function () {
        document.body.scrollTop = 0; // safari
        document.documentElement.scrollTop = 0; // chrome, firefox, IE, opera
    };
    // HTML FACTORY
    // ------------========================================================------------
    UiHandler.ATTR_ARTIFACT_ID = "data-artifactId";
    UiHandler.CLASS_TITLE = "articleTitle";
    UiHandler.CLASS_TAGS = "articleTags";
    UiHandler.CLASS_BODY = "articleBody";
    return UiHandler;
}());
exports["default"] = UiHandler;
