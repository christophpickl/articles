
let isDebug = (process.cwd() == "/") ? false : true;
// env = process.env.NODE_ENV || 'development' ... https://stackoverflow.com/questions/41762570/how-to-export-object-in-typescript

let jsonFilepath = isDebug ?
    process.cwd() + "/articles.devdata.json" :
    process.env["HOME"] + "/.articles/articles.data.json";

let Config = Object.freeze({
    IS_DEBUG: isDebug,
    JSON_FILEPATH: jsonFilepath
});

class Article {
    constructor(
        public id: string,
        public title: string,
        public body: string,
        public tags: Array<string>
        ) {

    }
}

export { Config, Article }
