"use strict";
exports.__esModule = true;
var common_1 = require("./common");
var fs = require("fs");
var Articles = /** @class */ (function () {
    function Articles() {
    }
    Articles.loadArticles = function () {
        if (Articles._debugOn === true) {
            Articles.loadedArticles = [
                new common_1.Article("id1", "balance", ["philo", "medi"], "my body\nmy story."),
                new common_1.Article("id2", "some thing", [""], "")
            ];
        }
        else {
            console.log("Loading articles from: " + common_1.Config.JSON_FILEPATH);
            // TODO handle file not existing => create it
            if (fs.existsSync(common_1.Config.JSON_FILEPATH)) {
                Articles.loadedArticles = JSON.parse(fs.readFileSync(common_1.Config.JSON_FILEPATH, 'utf8').toString());
            }
            else {
                Articles.persistJson();
                Articles.loadedArticles = [];
            }
        }
        console.log("Articles loaded successfully:");
        console.log(JSON.stringify(Articles.loadedArticles));
        return Articles.runSearch();
    };
    Articles.runSearch = function () {
        if (Articles.currentSearchTerms === null) {
            return Articles.loadedArticles;
        }
        console.log("running search...", Articles.currentSearchTerms);
        return Articles.loadedArticles.filter(function (article) {
            return Articles.currentSearchTerms.every(function (term) {
                if (term.startsWith("#")) {
                    var trimmedTerm_1 = term.substring(1);
                    return article.tags.some(function (tag) { return tag.indexOf(trimmedTerm_1) != -1; });
                }
                else {
                    return article.title.indexOf(term) != -1 ||
                        article.tags.some(function (tag) { return tag.indexOf(term) != -1; }) ||
                        article.body.indexOf(term) != -1;
                }
            });
        });
    };
    Articles.deleteArticle = function (articleId) {
        Articles.loadedArticles = Articles.loadedArticles.filter(function (it) {
            return it.id !== articleId;
        });
        Articles.persistJson();
    };
    Articles.updateArticle = function (article) {
        console.log("updateArticle(article.id=" + article.id + ")");
        var storedArticle = Articles.loadedArticles.find(function (it) {
            return it.id === article.id;
        });
        // console.log(JSON.stringify(article));
        // console.log(JSON.stringify(Articles.loadedArticles));
        // console.log(storedArticle);
        storedArticle.title = article.title;
        storedArticle.body = article.body;
        storedArticle.tags = article.tags;
        Articles.persistJson();
    };
    Articles.saveArticle = function (article) {
        console.log("Saving article: " + JSON.stringify(article));
        Articles.loadedArticles.push(article);
        Articles.persistJson();
    };
    Articles.searchArticles = function (terms) {
        console.log("change search to: ", terms);
        Articles.currentSearchTerms = terms;
        return Articles.runSearch();
    };
    Articles.disableSearch = function () {
        console.log("disableSearch");
        Articles.currentSearchTerms = null;
    };
    Articles.persistJson = function () {
        console.log("Persisting JSON to: " + common_1.Config.JSON_FILEPATH);
        fs.writeFileSync(common_1.Config.JSON_FILEPATH, JSON.stringify(Articles.loadedArticles));
    };
    Articles._debugOn = false;
    Articles.loadedArticles = [];
    // terms mit start with a "#" indicating a tag search
    Articles.currentSearchTerms = null;
    return Articles;
}());
exports["default"] = Articles;
