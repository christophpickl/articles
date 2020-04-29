
import { Config } from './common';
import { Article } from './common';
var fs = require("fs");

export default class Articles {

    private static _debugOn: boolean = false;
    private static loadedArticles: Article[] = [];

    static foo(params: string) {
        console.log("foo: " + params)
    }

    static loadArticles() {
        if (Articles._debugOn === true) {
            Articles.loadedArticles = [ { id: "aaaa", title: "my title", body: "my bodyyyy", "tags": [ "philo", "medi" ] }, { id: "bb", title: "my title 2", body: "my bodyyyy", "tags": [] } ];    
        } else {
            console.log("Loading articles from: " + Config.JSON_FILEPATH);
            // TODO handle file not existing => create it
            
            if(fs.existsSync(Config.JSON_FILEPATH)) {
                Articles.loadedArticles = JSON.parse(fs.readFileSync(Config.JSON_FILEPATH, 'utf8').toString());
            } else {
                Articles.persistJson();
                Articles.loadedArticles = [];
            }
        }
        console.log("Articles loaded successfully:");
        console.log(JSON.stringify(Articles.loadedArticles));
        return Articles.loadedArticles;
    }


    static deleteArticle(articleId: string) {
        Articles.loadedArticles = Articles.loadedArticles.filter(function(it) {
            return it.id !== articleId;
        });
        Articles.persistJson();
    }
    
    static updateArticle(article: Article) {
        console.log("updateArticle(article.id="+article.id+")");
        let storedArticle = Articles.loadedArticles.find(function (it) {
            return it.id === article.id;
        })!;
        // console.log(JSON.stringify(article));
        // console.log(JSON.stringify(Articles.loadedArticles));
        // console.log(storedArticle);
        storedArticle.title = article.title;
        storedArticle.body = article.body;
        storedArticle.tags = article.tags;
        Articles.persistJson();
    }
    
    static saveArticle(article: Article) {
        console.log("Saving article: " + JSON.stringify(article));
        
        Articles.loadedArticles.push(article);
        Articles.persistJson();
    }
    
    private static  persistJson() {
        console.log("Persisting JSON to: " + Config.JSON_FILEPATH);
        fs.writeFileSync(Config.JSON_FILEPATH, JSON.stringify(Articles.loadedArticles));
    }
    
}
