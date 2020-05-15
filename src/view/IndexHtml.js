"use strict";
exports.__esModule = true;
var IndexHtml = /** @class */ (function () {
    function IndexHtml() {
    }
    IndexHtml.btnCreate = function () {
        return document.getElementById(IndexHtml.ID_BTN_CREATE);
    };
    IndexHtml.btnUpdate = function () {
        return document.getElementById(IndexHtml.ID_BTN_UPDATE);
    };
    IndexHtml.btnCancel = function () {
        return document.getElementById(IndexHtml.ID_BTN_CANCEL);
    };
    IndexHtml.btnDelete = function () {
        return document.getElementById(IndexHtml.ID_BTN_DELETE);
    };
    IndexHtml.btnCancelSearchVisible = function (isVisible) {
        document.getElementById(IndexHtml.ID_BTN_CANCEL_SEARCH).hidden = !isVisible;
    };
    IndexHtml.onInpSearchInput = function (action) {
        document.getElementById("inpSearch").addEventListener("input", action);
    };
    // COMMON
    IndexHtml.onClick = function (element, action) {
        element.addEventListener("click", function () { action(); });
    };
    // CRUD
    IndexHtml.ID_BTN_CREATE = "btnCreate";
    IndexHtml.ID_BTN_UPDATE = "btnUpdate";
    IndexHtml.ID_BTN_CANCEL = "btnCancel";
    IndexHtml.ID_BTN_DELETE = "btnDelete";
    // SEARCH
    IndexHtml.ID_BTN_CANCEL_SEARCH = "btnCancelSearch";
    return IndexHtml;
}());
exports["default"] = IndexHtml;
