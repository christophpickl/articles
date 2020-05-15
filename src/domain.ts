export { Article }

class Article {
    constructor(
        public id: string,
        public title: string,
        public tags: Array<string>,
        public body: string
        ) {

    }
}
