"use strict";
// interface Articles ...
exports.__esModule = true;
var common_1 = require("./common");
var fs = require("fs");
var Articles = /** @class */ (function () {
    function Articles() {
    }
    Articles.foo = function (params) {
        console.log("foo: " + params);
    };
    Articles.loadArticles = function () {
        if (Articles._debugOn === true) {
            Articles.loadedArticles = [{ id: "aaaa", title: "my title", body: "my bodyyyy", "tags": ["philo", "medi"] }, { id: "bb", title: "my title 2", body: "my bodyyyy", "tags": [] }];
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
        return Articles.loadedArticles;
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
    Articles.persistJson = function () {
        console.log("Persisting JSON to: " + common_1.Config.JSON_FILEPATH);
        fs.writeFileSync(common_1.Config.JSON_FILEPATH, JSON.stringify(Articles.loadedArticles));
    };
    Articles._debugOn = false;
    Articles.loadedArticles = [];
    return Articles;
}());
exports["default"] = Articles;
