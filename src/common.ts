
export { Config, Article, Nullable, randomUuid }


let isDebug = (process.cwd() == "/") ? false : true;
// env = process.env.NODE_ENV || 'development' ... https://stackoverflow.com/questions/41762570/how-to-export-object-in-typescript

let jsonFilepath = isDebug ?
    process.cwd() + "/artikles.devdata.json" :
    process.env["HOME"] + "/.artikles/artikles.data.json";

let Config = Object.freeze({
    IS_DEBUG: isDebug,
    JSON_FILEPATH: jsonFilepath
});

class Article {
    constructor(
        public id: string,
        public title: string,
        public tags: Array<string>,
        public body: string
        ) {

    }
}

type Nullable<T> = T | null;


function randomUuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}
