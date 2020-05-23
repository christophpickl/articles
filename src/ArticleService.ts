import {Article, Articles} from "./domain";
import {Nullable} from "./common";
import {ArticleCrudOperations, ArticleRepo} from "./ArticleRepo";

export {
    ArticleService,
    ArticleServiceImpl
}

interface SearchService {
    searchArticles(terms: string[]): Articles

    disableSearch(): Articles;
}

interface ArticleService extends ArticleCrudOperations, SearchService {
}

function isNotDeleted(article: Article): boolean {
    return !article.isDeleted;
}

class ArticleServiceImpl implements ArticleService {

    private articles = new Articles([]);

    // terms mit start with a "#" indicating a tag search
    private currentSearchTerms: Nullable<string[]> = null

    constructor(
        private readonly repo: ArticleRepo
    ) {
    }

    // CRUD
    // ------------========================================================------------
    create(article: Article): Articles {
        this.articles = this.repo.create(article).filter(isNotDeleted);
        return this.runSearch();
    }

    readAll(): Articles {
        this.articles = this.repo.readAll().filter(isNotDeleted);
        return this.runSearch();
    }

    update(article: Article): Articles {
        this.articles = this.repo.update(article).filter(isNotDeleted);
        return this.runSearch();
    }

    delete(articleId: string): Articles {
        let articleToDelete = this.articles.findByIdOrThrow(articleId);
        articleToDelete.isDeleted = true
        this.articles = this.repo.update(articleToDelete).filter(isNotDeleted);
        return this.runSearch();
    }

    // SEARCH
    // ------------========================================================------------

    searchArticles(terms: string[]): Articles {
        console.log("change search to: ", terms)
        this.currentSearchTerms = terms;
        return this.runSearch();
    }

    disableSearch(): Articles {
        console.log("disableSearch")
        this.currentSearchTerms = null
        return this.runSearch();
    }

    private runSearch(): Articles {
        if (this.currentSearchTerms === null) {
            return this.articles
        }

        console.log("running search...", this.currentSearchTerms);
        return this.articles.filter((article) => {
            return this.currentSearchTerms!.every((term) => {
                if (term.startsWith("#")) {
                    let trimmedTerm = term.substring(1)
                    return article.tags.some((tag) => {
                        return tag.indexOf(trimmedTerm) != -1
                    })
                } else {
                    return article.title.indexOf(term) != -1 ||
                        article.tags.some((tag) => {
                            return tag.indexOf(term) != -1
                        }) ||
                        article.body.indexOf(term) != -1;
                }
            });
        });
    }
}
