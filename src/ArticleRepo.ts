import {Nullable} from './common';
import {Article, overrideUpdateableFields} from './domain';

let fs = require("fs");

export {
    ArticleRepo,
    JsonFileArticleRepo,
    InMemoryArticleRepo,
    ArticleCrud
}

function updateArticleInList(articles: Article[], update: Article) {
    let storedArticle = articles.find(function (it) {
        return it.id === update.id;
    })!;
    // console.log(JSON.stringify(article));
    // console.log(storedArticle);
    overrideUpdateableFields(storedArticle, update);
}

interface ArticleCrud {
    saveArticle(article: Article): Article[];

    loadArticles(): Article[];

    updateArticle(article: Article): Article[];

    deleteArticle(articleId: string): Article[];
}

interface ArticleRepo extends ArticleCrud {
}

let demoArticles: Article[] = [
    {
        id: "id1",
        title: "let lose",
        tags: ["dao", "zen", "stoi"],
        body: "let lose, let go, practice non-attachment, as everything is impermanent anyhow. stay low with compliments, stay high with criticism.",
        created: new Date("2005-01-01T08:44:29+0100"),
        updated: new Date(),
        likes: 7
    }, {
        id: "id2",
        title: "be kind",
        tags: ["kindness"],
        body: "to yourself and others.",
        created: new Date(),
        updated: new Date(),
        likes: 2
    }
];

// noinspection JSUnusedGlobalSymbols
class InMemoryArticleRepo implements ArticleRepo {

    private articles: Article[] = demoArticles;

    saveArticle(article: Article): Article[] {
        this.articles.push(article);
        return this.articles;
    }

    loadArticles(): Article[] {
        return this.articles;
    }

    updateArticle(article: Article): Article[] {
        updateArticleInList(this.articles, article);
        return this.articles;
    }

    deleteArticle(articleId: string): Article[] {
        this.articles = this.articles.filter(function (value) {
            return value.id != articleId;
        });
        return this.articles;
    }
}

class PersistedData {
    constructor(
        public version: number,
        public articles: Article[]
    ) {
    }
}

class JsonFileArticleRepo implements ArticleRepo {

    constructor(
        private jsonFilePath: string,
        private dataVersion: number
    ) {
    }

    loadArticles(): Article[] {
        console.log("load from: " + this.jsonFilePath);
        if (fs.existsSync(this.jsonFilePath)) {
            return this.loadJson().articles;
        }
        this.persistData({
            version: this.dataVersion,
            articles: []
        });
        return [];
    }

    deleteArticle(articleId: string): Article[] {
        console.log("delete:", articleId);
        let data = this.loadJson()
        data.articles = data.articles.filter(function (it) {
            return it.id !== articleId;
        });
        this.persistData(data);
        return data.articles;
    }

    updateArticle(article: Article): Article[] {
        console.log("update:", article);
        let data = this.loadJson()
        updateArticleInList(data.articles, article);
        this.persistData(data);
        return data.articles;
    }

    saveArticle(article: Article): Article[] {
        console.log("save:", article);
        let data = this.loadJson()
        data.articles.push(article);
        this.persistData(data);
        return data.articles;
    }

    private loadJson(): PersistedData {
        return JSON.parse(fs.readFileSync(this.jsonFilePath, 'utf8').toString());
    }

    private persistData(data: PersistedData) {
        console.log("Persisting JSON to: " + this.jsonFilePath);
        fs.writeFileSync(this.jsonFilePath, JSON.stringify(data));
    }
}
