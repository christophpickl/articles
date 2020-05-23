import {Article, Articles} from './domain';

let fs = require("fs");

export interface ArticleCrudOperations {
    create(article: Article): Articles;

    readAll(): Articles;

    update(article: Article): Articles;

    delete(id: string): Articles;
}

export interface ArticleRepo extends ArticleCrudOperations {
}

// noinspection JSUnusedGlobalSymbols
export class InMemoryArticleRepo implements ArticleRepo {

    private articles = new Articles([]);

    create(article: Article): Articles {
        this.articles.add(article);
        return this.articles;
    }

    readAll(): Articles {
        return this.articles;
    }

    update(article: Article): Articles {
        this.articles.updateFieldsFor(article);
        return this.articles;
    }

    delete(articleId: string): Articles {
        this.articles.remove(articleId);
        return this.articles;
    }
}

class PersistedData {
    constructor(
        public version: number,
        public articles: Articles
    ) {
    }
}

export class JsonFileArticleRepo implements ArticleRepo {

    constructor(
        private jsonFilePath: string,
        private dataVersion: number
    ) {
    }

    create(article: Article): Articles {
        console.log("save:", article);
        let data = this.loadJson()
        data.articles.add(article);
        this.persistJson(data);
        return data.articles;
    }

    readAll(): Articles {
        console.log("read articles from: " + this.jsonFilePath);
        if (fs.existsSync(this.jsonFilePath)) {
            return this.loadJson().articles;
        }
        const newData = new PersistedData(
            this.dataVersion,
            new Articles([])
        );
        this.persistJson(newData);
        return newData.articles;
    }

    update(article: Article): Articles {
        console.log("update:", article);
        let data = this.loadJson()

        data.articles.updateFieldsFor(article);

        this.persistJson(data);
        return data.articles;
    }

    delete(articleId: string): Articles {
        console.log("delete:", articleId);
        let data = this.loadJson()
        data.articles.remove(articleId);
        this.persistJson(data);
        return data.articles;
    }

    private loadJson(): PersistedData {
        let json = JSON.parse(fs.readFileSync(this.jsonFilePath, 'utf8').toString());
        let articles = new Array<Article>();
        json.articles.list.forEach((it) => {
            it.created = new Date(it.created);
            it.updated = new Date(it.updated);
            articles.push(new Article(it))
        });
        return new PersistedData(
            json.version, new Articles(articles)
        );
    }

    private persistJson(data: PersistedData) {
        console.log("Persisting JSON to: " + this.jsonFilePath);
        fs.writeFileSync(this.jsonFilePath, JSON.stringify(data));
    }
}
