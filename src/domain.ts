export { Article , overrideUpdateableFields }

class Article {
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

function overrideUpdateableFields(original: Article, update: Article) {
    console.log("updating article with:", update);
    original.title = update.title;
    original.tags = update.tags;
    original.body = update.body;
    original.created = update.created;
    original.updated = update.updated;
    original.likes = update.likes;
}
