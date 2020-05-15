
export default class IndexHtml {

    // CRUD
    // ================================================================================================================
    private static ID_BTN_CREATE = "btnCreate";
    private static ID_BTN_UPDATE = "btnUpdate";
    private static ID_BTN_CANCEL = "btnCancel";
    private static ID_BTN_DELETE = "btnDelete";

    static btnCreate(): HTMLElement {
        return document.getElementById(IndexHtml.ID_BTN_CREATE)!;
    }
    static btnUpdate(): HTMLElement {
        return document.getElementById(IndexHtml.ID_BTN_UPDATE)!;
    }
    static btnCancel(): HTMLElement {
        return document.getElementById(IndexHtml.ID_BTN_CANCEL)!;
    }
    static btnDelete(): HTMLElement {
        return document.getElementById(IndexHtml.ID_BTN_DELETE)!;
    }

    // SEARCH
    // ================================================================================================================
    private static ID_BTN_CANCEL_SEARCH = "btnCancelSearch";

    static btnCancelSearch(): HTMLElement {
        return document.getElementById(IndexHtml.ID_BTN_CANCEL_SEARCH)!;
    }
    static btnCancelSearchVisible(isVisible: boolean) {
        IndexHtml.btnCancelSearch().hidden = !isVisible;
    }
    static onInpSearchInput(action: () => void) {
        document.getElementById("inpSearch")!.addEventListener("input", action); 
    }

    // COMMON
    // ================================================================================================================
    static onClick(element: HTMLElement, action: () => void) {
        element.addEventListener("click", () => { action(); });
    }
}
