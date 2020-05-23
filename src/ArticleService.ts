import {Article, Articles} from "./domain";
import {Nullable} from "./common";
import {ArticleCrudOperations, ArticleRepo} from "./ArticleRepo";
import {SortOption, SortOptions} from "./sort";

export {
    ArticleService,
    ArticleServiceImpl
}

interface SearchService {
    searchArticles(terms: string[]): Articles

    disableSearch(): Articles;
}

interface ArticleService extends ArticleCrudOperations, SearchService {
    changeSort(option: SortOption): Articles;
}

function isNotDeleted(article: Article): boolean {
    return !article.isDeleted;
}

class ArticleServiceImpl implements ArticleService {

    private articles = new Articles([]);


    constructor(
        private readonly repo: ArticleRepo
    ) {
    }

    // CRUD
    // ------------========================================================------------
    public create(article: Article): Articles {
        this.articles = this.repo.create(article).filter(isNotDeleted);
        return this.runSearchAndSort();
    }

    public readAll(): Articles {
        this.articles = this.repo.readAll().filter(isNotDeleted);
        return this.runSearchAndSort();
    }

    public update(article: Article): Articles {
        this.articles = this.repo.update(article).filter(isNotDeleted);
        return this.runSearchAndSort();
    }

    public delete(articleId: string): Articles {
        let articleToDelete = this.articles.findByIdOrThrow(articleId);
        articleToDelete.isDeleted = true
        this.articles = this.repo.update(articleToDelete).filter(isNotDeleted);
        return this.runSearchAndSort();
    }

    // SEARCH & SORT
    // ------------========================================================------------

    // terms mit start with a "#" indicating a tag search
    private currentSearchTerms: Nullable<string[]> = null

    private sortOption: SortOption = SortOptions.defaultOption

    public searchArticles(terms: string[]): Articles {
        console.log("change search to: ", terms)
        this.currentSearchTerms = terms;
        return this.runSearchAndSort();
    }

    public disableSearch(): Articles {
        console.log("disableSearch")
        this.currentSearchTerms = null
        return this.runSearchAndSort();
    }

    public changeSort(option: SortOption): Articles {
        console.log("changeSort:", option);
        if (this.sortOption == option) {
            console.log("aborting sort, already sorted like this")
            return this.articles;
        }
        this.sortOption = option;
        return this.runSearchAndSort();
    }

    private runSearchAndSort(): Articles {
        let result = this.articles;

        if (this.currentSearchTerms != null) {
            console.log("running search...", this.currentSearchTerms);
            const terms = this.currentSearchTerms;
            result = result.filter((article) => {
                return ArticleServiceImpl.searchFilterPredicate(article, terms);
            })
        }

        return result.sorted(this.sortOption);
    }

    private static searchFilterPredicate(article: Article, terms: string[]): boolean {
        return terms.every((term) => {
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
    }
}
