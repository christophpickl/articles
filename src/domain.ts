import {sortMapByKey} from "./common";

export class Article {
    constructor(
        public readonly id: string,
        public title: string,
        public tags: Array<string>,
        public body: string,
        public created: Date,
        public updated: Date,
        public likes: number
    ) {
    }
}

export function overrideUpdateableFields(original: Article, update: Article) {
    console.log("updating article with:", update);
    original.title = update.title;
    original.tags = update.tags;
    original.body = update.body;
    original.created = update.created;
    original.updated = update.updated;
    original.likes = update.likes;
}

export class Tags {
    constructor(
        private readonly map: Map<string, number/*=count*/>,
        /** sorted */
        public readonly counts: number[]
    ) {
    }

    public static buildFrom(articles: Article[]): Tags {
        let allTagsCounted = new Map<string, number>();
        articles.forEach((article) => {
            article.tags.forEach((tag) => {
                if (!allTagsCounted.has(tag)) {
                    allTagsCounted.set(tag, 0);
                }
                allTagsCounted.set(tag, allTagsCounted.get(tag)! + 1);
            });
        });

        let counts = Array.from(allTagsCounted.values()).sort();
        return new Tags(sortMapByKey(allTagsCounted), counts);
    }

    public forEach(fn: (string, number) => void) {
        this.map.forEach((value, key) => {
            fn(key, value);
        });
    }
}
