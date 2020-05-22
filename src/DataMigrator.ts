let fs = require("fs");

export { DataMigrator }

class DataMigrator {
    
    static readonly APPLICATION_VERSION = 3;

    constructor(
        private readonly jsonFilePath: string
    ) {}

    migrate() {
        if(!fs.existsSync(this.jsonFilePath)) {
            return
        }
        
        let json = JSON.parse(fs.readFileSync(this.jsonFilePath, 'utf8').toString());
        let currentVersion = <number>json.version;
        if (currentVersion == DataMigrator.APPLICATION_VERSION) {
            return;
        }

        let nextVersion = currentVersion + 1;
        console.log("migrating data version from "+currentVersion+" -> " + nextVersion + " for file: " + this.jsonFilePath);

        if (nextVersion == 2) {
            let date = new Date("2020-01-01T00:00:00+0000");
            json.articles.forEach(article => {
                article.created = date;
                article.updated = date;
                article.likes = 0;
                date = new Date(date.getTime() + 1_000);
            });
            nextVersion++;
        }
        if (nextVersion == 3) {
            json.articles.forEach(article => {
                article.isDeleted = false;
                article.tags = article.tags.sort()
            });
        }
        json.version = DataMigrator.APPLICATION_VERSION;
        fs.writeFileSync(this.jsonFilePath, JSON.stringify(json));
    }
}
