var fs = require('fs');

var _debugOn = false;

var loadedArticles = [];

var isDebug = true;
if (process.cwd() == "/") {
    isDebug = false;
}

var JSON_FILEPATH = process.env["HOME"] + "/.articles/articles.data.json";
if (isDebug) {
    JSON_FILEPATH = process.cwd() + "/articles.devdata.json";
}

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
        console.log("Loading articles from: " + JSON_FILEPATH);
        // TODO handle file not existing => create it
        
        if(fs.existsSync(JSON_FILEPATH)) {
            loadedArticles = JSON.parse(fs.readFileSync(JSON_FILEPATH, 'utf8').toString());
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
    console.log("Persisting JSON to: " + JSON_FILEPATH);
    fs.writeFileSync(JSON_FILEPATH, JSON.stringify(loadedArticles));
}
