
var isDebug = true;
if (process.cwd() == "/") {
    isDebug = false;
}

var jsonFilepath = process.env["HOME"] + "/.articles/articles.data.json";
if (isDebug) {
    jsonFilepath = process.cwd() + "/articles.devdata.json";
}

module.exports = Object.freeze({
    IS_DEBUG: isDebug,
    JSON_FILEPATH: jsonFilepath
});
