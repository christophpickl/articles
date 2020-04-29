"use strict";
exports.__esModule = true;
var isDebug = (process.cwd() == "/") ? false : true;
// env = process.env.NODE_ENV || 'development' ... https://stackoverflow.com/questions/41762570/how-to-export-object-in-typescript
var jsonFilepath = isDebug ?
    process.cwd() + "/articles.devdata.json" :
    process.env["HOME"] + "/.articles/articles.data.json";
var Config = Object.freeze({
    IS_DEBUG: isDebug,
    JSON_FILEPATH: jsonFilepath
});
exports.Config = Config;
var Article = /** @class */ (function () {
    function Article(id, title, tags, body) {
        this.id = id;
        this.title = title;
        this.tags = tags;
        this.body = body;
    }
    return Article;
}());
exports.Article = Article;
