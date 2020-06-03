// import * as $ from "jquery";

import {Article} from "../domain";

export default class IndexHtml {

    static readonly LikeSymbol = "❤️"
    // ABSTRACTION
    // =================================================================================================================

    static isInCreateMode = true

    static fillArticleForm(article: Article | null) {
        IndexHtml.inpId().value = article ? article.id : "";
        IndexHtml.inpTitle().value = article ? article.title : "";
        let inpTags = IndexHtml.inpTags();
        inpTags.trigger("tokenize:clear");
        if (article !== null) {
            article.tags.forEach((tag) => {
                inpTags.trigger("tokenize:tokens:add", tag);
            });
        }
        IndexHtml.inpBody().value = article ? article.body : "";
        IndexHtml.inpCreated().value = article ? article.created.toString() : "";
        IndexHtml.inpUpdated().value = article ? article.updated.toString() : "";
        IndexHtml.inpLikes().value = article ? article.likes.toString() : "";
        IndexHtml.switchButtonsToCreateMode(article === null);
    }

    static switchButtonsToCreateMode(isCreateMode: boolean) {
        IndexHtml.isInCreateMode = isCreateMode;
        IndexHtml.btnCreate().hidden = !isCreateMode;
        IndexHtml.btnUpdate().hidden = isCreateMode;
        IndexHtml.btnCancel().hidden = isCreateMode;
        IndexHtml.btnDelete().hidden = isCreateMode;
    }

    // CRUD
    // =================================================================================================================

    static btnCreate(): HTMLButtonElement {
        return document.getElementById("btnCreate") as HTMLButtonElement;
    }

    static btnUpdate(): HTMLButtonElement {
        return document.getElementById("btnUpdate") as HTMLButtonElement;
    }

    static btnCancel(): HTMLButtonElement {
        return document.getElementById("btnCancel") as HTMLButtonElement;
    }

    static btnDelete(): HTMLButtonElement {
        return document.getElementById("btnDelete") as HTMLButtonElement;
    }

    static inpId(): HTMLInputElement {
        return document.getElementById("inpId") as HTMLInputElement;
    }

    static inpTitle(): HTMLInputElement {
        return document.getElementById("inpTitle") as HTMLInputElement;
    }

    static inpTags(): JQuery {
        return $("#inpTags");
    }

    static inpBody(): HTMLInputElement {
        return document.getElementById("inpBody") as HTMLInputElement;
    }

    static inpCreated(): HTMLInputElement {
        return document.getElementById("inpCreated") as HTMLInputElement;
    }

    static inpUpdated(): HTMLInputElement {
        return document.getElementById("inpUpdated") as HTMLInputElement;
    }

    static inpLikes(): HTMLInputElement {
        return document.getElementById("inpLikes") as HTMLInputElement;
    }


    // SEARCH
    // ================================================================================================================

    static inpSearch(): HTMLInputElement {
        return document.getElementById("inpSearch") as HTMLInputElement;
    }

    static onInpSearchInput(action: () => void) {
        IndexHtml.onInput(IndexHtml.inpSearch(), action);
    }

    static btnCancelSearch(): HTMLButtonElement {
        return document.getElementById("btnCancelSearch") as HTMLButtonElement;
    }

    static btnCancelSearchVisible(isVisible: boolean) {
        IndexHtml.btnCancelSearch().hidden = !isVisible;
    }

    // LIST
    // ================================================================================================================

    private static ID_ARTICLE_LIST = "articleList";

    static articleList(): HTMLDivElement {
        return document.getElementById(IndexHtml.ID_ARTICLE_LIST) as HTMLDivElement;
    }

    static findArticleChildNodeById(attributeName: string, articleId: string): HTMLElement | null {
        let found = $("#" + IndexHtml.ID_ARTICLE_LIST + " div[" + attributeName + "='" + articleId + "']").toArray();
        return (found.length == 1) ? found[0] : null;
    }

    static incrementCounter() {
        let counter = $("#articleListCount");
        counter.text(parseInt(counter.text()) + 1);
    }

    static decrementCounter() {
        let counter = $("#articleListCount");
        counter.text(parseInt(counter.text()) - 1);
    }

    static setCounter(newCounter: number) {
        let counter = $("#articleListCount");
        counter.text(newCounter);
    }

    // COMMON
    // ================================================================================================================
    static onClick(element: HTMLElement, action: () => void) {
        element.addEventListener("click", () => {
            action();
        });
    }

    static onInput(element: HTMLInputElement, action: () => void) {
        element.addEventListener("input", action);
    }

    static onKeyDown(element: HTMLElement, action: (KeyboardEvent) => void) {
        element.addEventListener("keydown", action);
    }

}
