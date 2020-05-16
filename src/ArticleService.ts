import {Article} from "./domain";
import {Nullable} from "./common";
import {ArticleCrud, ArticleRepo} from "./ArticleRepo";

export {
    ArticleService,
    ArticleServiceImpl
}

interface ArticleService extends ArticleCrud {
    searchArticles(terms: string[]): Article[]

    disableSearch(): Article[];
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
    saveArticle(article: Article): Article[] {
        this.articles = this.repo.saveArticle(article);
        return this.articles;
    }

    loadArticles(): Article[] {
        this.articles = this.repo.loadArticles();
        return this.runSearch();
    }

    updateArticle(article: Article): Article[] {
        this.articles = this.repo.updateArticle(article);
        return this.articles;
    }

    deleteArticle(articleId: string): Article[] {
        this.articles = this.repo.deleteArticle(articleId);
        return this.articles;
    }

    // SEARCH
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
