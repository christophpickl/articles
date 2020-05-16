
import { Nullable } from './common';
import { Article, overrideUpdateableFields } from './domain';
var fs = require("fs");

export { ArticleRepo, JsonFileArticleRepo, InMemoryArticleRepo }

function updateArticleInList(articles: Article[], update: Article) {
    let storedArticle = articles.find(function (it) {
        return it.id === update.id;
    })!;
    // console.log(JSON.stringify(article));
    // console.log(storedArticle);
    overrideUpdateableFields(storedArticle, update);
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
        body: "let lose, let go, practice non-attachment, as everything is impermanent anyhow. stay low with compliments, stay high with criticism.",
        created: new Date("2005-01-01T08:44:29+0100"),
        updated: new Date(),
        likes: 7
    }, {
        id: "id2",
        title: "be kind",
        tags: [ "kindness" ],
        body: "to yourself and others.",
        created: new Date(),
        updated: new Date(),
        likes: 2
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

class PersistedData {
    constructor(
        public version: number,
        public articles: Article[]
    ) {}
}

class JsonFileArticleRepo implements ArticleRepo {

    private data: PersistedData;

    // terms mit start with a "#" indicating a tag search
    private currentSearchTerms: Nullable<string[]> = null

    constructor(
        private jsonFilePath: string,
        private dataVersion: number
        ) {
            this.data = new PersistedData(dataVersion, []);
    }

    // CRUD
    loadArticles() : Article[] {
        console.log("Loading articles from: " + this.jsonFilePath);
        
        if(fs.existsSync(this.jsonFilePath)) {
            this.data = this.loadJson();
            console.log("Loaded data:");
            console.log(JSON.stringify(this.data));
        } else {
            console.log("Init data with empty file");
            this.persistJson();
        }

        return this.runSearch();
    }

    deleteArticle(articleId: string) {
        this.data.articles = this.data.articles.filter(function(it) {
            return it.id !== articleId;
        });
        this.persistJson();
    }

    updateArticle(article: Article) {
        updateArticleInList(this.data.articles, article);
        this.persistJson();
    }
    
    saveArticle(article: Article) {
        console.log("Saving article: " + JSON.stringify(article));
        
        this.data.articles.push(article);
        this.persistJson();
    }

    // SEARCH
    searchArticles(terms: string[]): Article[] {
        console.log("change search to: ", terms)
        this.currentSearchTerms = terms;
        return this.runSearch();
    }

    disableSearch() {
        console.log("disableSearch")
        this.currentSearchTerms = null
    }

    // INTERNAL
    private loadJson(): PersistedData {
        return JSON.parse(fs.readFileSync(this.jsonFilePath, 'utf8').toString());
    }
    
    private persistJson() {
        console.log("Persisting JSON to: " + this.jsonFilePath);
        
        fs.writeFileSync(this.jsonFilePath, JSON.stringify(this.data));
    }

    private runSearch(): Article[] {
        if (this.currentSearchTerms === null) {
            return this.data.articles
        }

        console.log("running search...", this.currentSearchTerms);
        return this.data.articles.filter((article) => {
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
