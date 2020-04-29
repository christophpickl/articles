var fs = require("fs");
var common = require("./common");

var _debugOn = false;

var loadedArticles = [];

exports.deleteArticle = function(articleId) {
    loadedArticles = loadedArticles.filter(function(it) {
        return it.id !== articleId;
    });
    persistJson();
}

exports.updateArticle = function(article) {
    var storedArticle = loadedArticles.find(function (it) {
        return it.id === article.id;
    });
    console.log("UPDATE");
    console.log(JSON.stringify(article));
    console.log(JSON.stringify(loadedArticles));
    console.log(storedArticle);
    storedArticle.title = article.title;
    storedArticle.body = article.body;
    storedArticle.tags = article.tags;
    persistJson();
}

exports.loadArticles = function() {
    if (_debugOn === true) {
        loadedArticles = [ { id: "aaaa", title: "my title", body: "my bodyyyy", "tags": [ "philo", "medi" ] }, { id: "bb", title: "my title 2", body: "my bodyyyy", "tags": [] } ];    
    } else {
        console.log("Loading articles from: " + common.JSON_FILEPATH);
        // TODO handle file not existing => create it
        
        if(fs.existsSync(common.JSON_FILEPATH)) {
            loadedArticles = JSON.parse(fs.readFileSync(common.JSON_FILEPATH, 'utf8').toString());
        } else {
            persistJson();
            loadedArticles = [];
        }
    }

    console.log("Articles loaded successfully:");
    console.log(JSON.stringify(loadedArticles));
    return loadedArticles;
}

exports.saveArticle = function (article) {
    console.log("Saving article: " + JSON.stringify(article));
    
    loadedArticles.push(article);
    persistJson();
}

function persistJson() {
    console.log("Persisting JSON to: " + common.JSON_FILEPATH);
    fs.writeFileSync(common.JSON_FILEPATH, JSON.stringify(loadedArticles));
}
