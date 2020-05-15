var fs = require("fs");

export { DataMigrator }

class DataMigrator {
    constructor(
        private jsonFilePath: string
    ) {}
    migrate() {
        let articles = JSON.parse(fs.readFileSync(this.jsonFilePath, 'utf8').toString());
        console.log("migrate ", articles);
    }
}
