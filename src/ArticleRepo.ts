
import { Nullable } from './common';
import { Article } from './domain';
var fs = require("fs");

export { ArticleRepo, JsonFileArticleRepo, InMemoryArticleRepo }

function updateArticleInList(articles: Article[], update: Article) {
    let storedArticle = articles.find(function (it) {
        return it.id === update.id;
    })!;
    // console.log(JSON.stringify(article));
    // console.log(storedArticle);
    storedArticle.title = update.title;
    storedArticle.body = update.body;
    storedArticle.tags = update.tags;
}

interface ArticleRepo {
    saveArticle(article: Article);
    loadArticles(): Article[];
    updateArticle(article: Article);
    deleteArticle(articleId: string);

    // TODO outsource into own class
    searchArticles(terms: string[]): Article[]
    disableSearch();
}

let demoArticles: Article[] = [
    {
        id: "id1",
        title: "let lose",
        tags: [ "dao", "zen", "stoi" ],
        body: "let lose, let go, practice non-attachment, as everything is impermanent anyhow. stay low with compliments, stay high with criticism."
    },{
        id: "id2",
        title: "be kind",
        tags: [ "kindness" ],
        body: "to yourself and others."
    }
];

class InMemoryArticleRepo implements ArticleRepo {

    private articles: Article[] = demoArticles;

    saveArticle(article: Article) {
        this.articles.push(article);
    }
    loadArticles(): Article[] {
        return this.articles;
    }
    updateArticle(article: Article) {
        updateArticleInList(this.articles, article);
    }
    deleteArticle(articleId: string) {
        this.articles = this.articles.filter(function(value, index, arr) { return value.id != articleId; });
    }
    searchArticles(terms: string[]): Article[] {
        // TODO
        return this.articles;
    }
    disableSearch() {
        // TODO
    }
}

class JsonFileArticleRepo implements ArticleRepo {

    private loadedArticles: Article[] = [];

    constructor(
        private jsonFilePath: string
        ) {
    }

    // terms mit start with a "#" indicating a tag search
    private currentSearchTerms: Nullable<string[]> = null

    loadArticles() : Article[] {
        console.log("Loading articles from: " + this.jsonFilePath);
        // TODO handle file not existing => create it
        
        if(fs.existsSync(this.jsonFilePath)) {
            this.loadedArticles = JSON.parse(fs.readFileSync(this.jsonFilePath, 'utf8').toString());
        } else {
            this.persistJson();
            this.loadedArticles = [];
        }
        console.log("Articles loaded successfully:");
        console.log(JSON.stringify(this.loadedArticles));
        return this.runSearch();
    }


    deleteArticle(articleId: string) {
        this.loadedArticles = this.loadedArticles.filter(function(it) {
            return it.id !== articleId;
        });
        this.persistJson();
    }

    updateArticle(article: Article) {
        console.log("updateArticle(article.id="+article.id+")");
        updateArticleInList(this.loadedArticles, article);
        this.persistJson();
    }
    
    saveArticle(article: Article) {
        console.log("Saving article: " + JSON.stringify(article));
        
        this.loadedArticles.push(article);
        this.persistJson();
    }


    searchArticles(terms: string[]): Article[] {
        console.log("change search to: ", terms)
        this.currentSearchTerms = terms;
        return this.runSearch();
    }

    disableSearch() {
        console.log("disableSearch")
        this.currentSearchTerms = null
    }
    
    private persistJson() {
        console.log("Persisting JSON to: " + this.jsonFilePath);
        fs.writeFileSync(this.jsonFilePath, JSON.stringify(this.loadedArticles));
    }

    private runSearch(): Article[] {
        if (this.currentSearchTerms === null) {
            return this.loadedArticles
        }

        console.log("running search...", this.currentSearchTerms);
        return this.loadedArticles.filter((article) => {
            return this.currentSearchTerms!.every((term) => {
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
