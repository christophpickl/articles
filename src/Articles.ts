
import { Config, Article, Nullable } from './common';
var fs = require("fs");

export default class Articles {

    private static _debugOn: boolean = false;
    private static loadedArticles: Article[] = [];

    // terms mit start with a "#" indicating a tag search
    private static currentSearchTerms: Nullable<string[]> = null

    static loadArticles() {
        if (Articles._debugOn === true) {
            Articles.loadedArticles = [
                new Article("id1", "balance", [ "philo", "medi" ], "my body\nmy story."),
                new Article("id2", "some thing", [ "" ], "")
            ];
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
        return Articles.runSearch();
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


    static searchArticles(terms: string[]): Article[] {
        console.log("change search to: ", terms)
        Articles.currentSearchTerms = terms;
        return Articles.runSearch();
    }

    static disableSearch() {
        console.log("disableSearch")
        Articles.currentSearchTerms = null
    }
    
    private static  persistJson() {
        console.log("Persisting JSON to: " + Config.JSON_FILEPATH);
        fs.writeFileSync(Config.JSON_FILEPATH, JSON.stringify(Articles.loadedArticles));
    }

    private static runSearch(): Article[] {
        if (Articles.currentSearchTerms === null) {
            return Articles.loadedArticles
        }

        console.log("running search...", Articles.currentSearchTerms);
        return Articles.loadedArticles.filter(function(article) {
            return Articles.currentSearchTerms!.every((term) => {
                if(term.startsWith("#")) {
                    let trimmedTerm = term.substring(1)
                    return article.tags.some((tag) => { return tag.indexOf(trimmedTerm) != -1 })
                } else {
                    return article.title.indexOf(term) != -1 ||
                        article.tags.some((tag) => { return tag.indexOf(term) != -1 }) ||
                        article.body.indexOf(term) != -1;
                }
            });
        });
    }
    
}
