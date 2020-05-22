"use strict";
exports.__esModule = true;
var IndexHtml = /** @class */ (function () {
    function IndexHtml() {
    }
    // CRUD
    // ================================================================================================================
    IndexHtml.btnCreate = function () {
        return document.getElementById("btnCreate");
    };
    IndexHtml.btnUpdate = function () {
        return document.getElementById("btnUpdate");
    };
    IndexHtml.btnCancel = function () {
        return document.getElementById("btnCancel");
    };
    IndexHtml.btnDelete = function () {
        return document.getElementById("btnDelete");
    };
    IndexHtml.inpId = function () {
        return document.getElementById("inpId");
    };
    IndexHtml.inpTitle = function () {
        return document.getElementById("inpTitle");
    };
    IndexHtml.inpTags = function () {
        return document.getElementById("inpTags");
    };
    IndexHtml.inpBody = function () {
        return document.getElementById("inpBody");
    };
    IndexHtml.inpCreated = function () {
        return document.getElementById("inpCreated");
    };
    IndexHtml.inpUpdated = function () {
        return document.getElementById("inpUpdated");
    };
    IndexHtml.inpLikes = function () {
        return document.getElementById("inpLikes");
    };
    // SEARCH
    // ================================================================================================================
    IndexHtml.inpSearch = function () {
        return document.getElementById("inpSearch");
    };
    IndexHtml.onInpSearchInput = function (action) {
        IndexHtml.inpSearch().addEventListener("input", action);
    };
    IndexHtml.btnCancelSearch = function () {
        return document.getElementById("btnCancelSearch");
    };
    IndexHtml.btnCancelSearchVisible = function (isVisible) {
        IndexHtml.btnCancelSearch().hidden = !isVisible;
    };
    IndexHtml.articleList = function () {
        return document.getElementById(IndexHtml.ID_ARTICLE_LIST);
    };
    // COMMON
    // ================================================================================================================
    IndexHtml.onClick = function (element, action) {
        element.addEventListener("click", function () { action(); });
    };
    // MAIN
    // ================================================================================================================
    IndexHtml.ID_ARTICLE_LIST = "articleList";
    return IndexHtml;
}());
exports["default"] = IndexHtml;
