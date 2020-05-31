import {sortMapByKey, Tuple} from "./common";
import {SortOption} from "./sort";

export class Articles {
    constructor(
        private list: Article[]
    ) {
    }

    get length(): number {
        return this.list.length;
    }

    public forEach(callback: (Article) => void) {
        this.list.forEach(callback);
    }

    public filter(predicate: (Article) => boolean): Articles {
        return new Articles(this.list.filter(predicate));
    }

    public add(article: Article) {
        this.list.push(article);
    }

    public remove(articleId: string) {
        this.list = this.list.filter(function (it) {
            return it.id !== articleId;
        });
    }

    public updateFieldsFor(update: Article) {
        this.findByIdOrThrow(update.id).setFieldsFrom(update);
    }

    public findByIdOrThrow(findId: string): Article {
        let found: Article | undefined = this.list.find(function (it) {
            return it.id === findId;
        });
        if (found === undefined) {
            throw Error("Article with ID '" + findId + "' not existing!");
        }
        return found;
    }

    sorted(sortOption: SortOption): Articles {
        let list2 = Object.assign([], this.list) as Article[];
        list2.sort(sortOption.sortCallback);
        return new Articles(list2);
    }
}

interface ArticleCtor {
    readonly id: string
    title: string
    tags: Array<string>
    body: string
    created: Date
    updated: Date
    likes: number
    isDeleted: boolean
}

export class ArticleId {

}

export class Article implements ArticleCtor {
    public readonly id: string;
    public title: string;
    public tags: Array<string>;
    public body: string;
    public created: Date;
    public updated: Date;
    public likes: number;
    public isDeleted: boolean;

    // noinspection DuplicatedCode
    constructor(ctor: ArticleCtor) {
        this.id = ctor.id;
        this.title = ctor.title;
        this.tags = ctor.tags;
        this.body = ctor.body;
        this.created = ctor.created;
        this.updated = ctor.updated;
        this.likes = ctor.likes;
        this.isDeleted = ctor.isDeleted;
    }

    // noinspection DuplicatedCode
    setFieldsFrom(update: Article) {
        console.log("updating article with:", update);
        this.title = update.title;
        this.tags = update.tags;
        this.body = update.body;
        this.created = update.created;
        this.updated = update.updated;
        this.likes = update.likes;
        this.isDeleted = update.isDeleted;
    }

    like() {
        this.likes++;
        console.log("Article '" + this.title + "' liked: " + this.likes);
    }
}

export class Tags {
    constructor(
        private readonly map: Map<string, number/*=count*/>
    ) {
    }

    public static buildFrom(articles: Articles): Tags {
        let allTagsCounted = new Map<string, number>();
        articles.forEach((article) => {
            article.tags.forEach((tag) => {
                if (!allTagsCounted.has(tag)) {
                    allTagsCounted.set(tag, 0);
                }
                allTagsCounted.set(tag, allTagsCounted.get(tag)! + 1);
            });
        });

        return new Tags(sortMapByKey(allTagsCounted));
    }

    public forEach(fn: (string, number) => void) {
        this.map.forEach((value, key) => {
            fn(key, value);
        });
    }

    public getMinMax(): Tuple<number, number> {
        let counts = Array.from(this.map.values()).sort((o1, o2) => o1 - o2);
        return new Tuple(counts[0], counts[counts.length - 1]);
    }
}
