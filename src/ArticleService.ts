import {Article} from "./domain";
import {Nullable} from "./common";
import {ArticleCrudOperations, ArticleRepo} from "./ArticleRepo";

export {
    ArticleService,
    ArticleServiceImpl
}

interface SearchService {
    searchArticles(terms: string[]): Article[]

    disableSearch(): Article[];
}

interface ArticleService extends ArticleCrudOperations, SearchService {
}

class ArticleServiceImpl implements ArticleService {

    private articles: Article[] = [];

    // terms mit start with a "#" indicating a tag search
    private currentSearchTerms: Nullable<string[]> = null

    constructor(
        private readonly repo: ArticleRepo
    ) {
    }

    // CRUD
    // ------------========================================================------------
    create(article: Article): Article[] {
        this.articles = this.repo.create(article);
        return this.runSearch();
    }

    readAll(): Article[] {
        this.articles = this.repo.readAll();
        return this.runSearch();
    }

    update(article: Article): Article[] {
        this.articles = this.repo.update(article);
        return this.runSearch();
    }

    delete(articleId: string): Article[] {
        this.articles = this.repo.delete(articleId);
        return this.runSearch();
    }

    // SEARCH
    // ------------========================================================------------

    searchArticles(terms: string[]): Article[] {
        console.log("change search to: ", terms)
        this.currentSearchTerms = terms;
        return this.runSearch();
    }

    disableSearch(): Article[] {
        console.log("disableSearch")
        this.currentSearchTerms = null
        return this.runSearch();
    }

    private runSearch(): Article[] {
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
