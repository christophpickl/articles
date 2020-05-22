
export default class IndexHtml {

    // ABSTRACTION
    // =================================================================================================================
    static isInCreateMode = true

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
        return document.getElementById( "btnUpdate") as HTMLButtonElement;
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
    static inpTags(): HTMLInputElement {
        return document.getElementById("inpTags") as HTMLInputElement;
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

    // COMMON
    // ================================================================================================================
    static onClick(element: HTMLElement, action: () => void) {
        element.addEventListener("click", () => { action(); });
    }

    static onInput(element: HTMLInputElement, action: () => void) {
        element.addEventListener("input", action);
    }

    static onKeyDown(element: HTMLElement, action: (KeyboardEvent) => void) {
        element.addEventListener("keydown", action);
    }

}
