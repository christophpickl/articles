
console.log("preload.js running.");
var service = require("./service");

// to get more logging, enable:
// # export ELECTRON_ENABLE_LOGGING=1

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    addArticleNodes(service.loadArticles());
    
    document.getElementById("btnCreate").addEventListener("click", onCreateClicked); 
    document.getElementById("btnUpdate").addEventListener("click", onUpdateClicked); 
    document.getElementById("btnCancel").addEventListener("click", onCancelClicked); 
    document.getElementById("btnDelete").addEventListener("click", onDeleteClicked); 
    switchButtonsToCreateMode(true);
});

function switchButtonsToCreateMode(isCreateMode) {
    document.getElementById("btnCreate").hidden = isCreateMode ? false : true;
    document.getElementById("btnUpdate").hidden = isCreateMode ? true : false;
    document.getElementById("btnCancel").hidden = isCreateMode ? true : false;
    document.getElementById("btnDelete").hidden = isCreateMode ? true : false;
}

function onUpdateClicked() {
    var article = readArticleFromUI();
    service.updateArticle(article);
    resetArticleList();
}

function onCancelClicked() {
    resetInputs();
    switchButtonsToCreateMode(true);
}

function onDeleteClicked() {
    service.deleteArticle(document.getElementById("inpId").value);
    resetArticleList();
    resetInputs();
    switchButtonsToCreateMode(true);
}

function resetArticleList() {
    var articleList = document.getElementById("articleList");
    while (articleList.firstChild) {
        articleList.removeChild(articleList.lastChild);
    };
    addArticleNodes(service.loadArticles());
}

function scrollToTop() {
    document.body.scrollTop = 0; // safari
    document.documentElement.scrollTop = 0; // chrome, firefox, IE, opera
}

function onCreateClicked() {
    console.log("Creating new article.");
    
    var article = readArticleFromUI(randomUuid());
    if (article.title.trim().length == 0) {
        alert("Title must not be empty!");
        return;
    }
    service.saveArticle(article);
    addArticleNodes([article]);
    resetInputs();
}

function readArticleFromUI(givenId) {
    var inpTitle = document.getElementById("inpTitle").value;
    var inpBody = document.getElementById("inpBody").value;
    var inpTags = document.getElementById("inpTags").value.split(" ").filter(function(it) { return it.length > 0; });
    var realId = document.getElementById("inpId").value;
    if (givenId !== undefined) {
        realId = givenId;
    }
    return { id: realId, title: inpTitle, body: inpBody, tags: inpTags };
}

function resetInputs() {
    document.getElementById("inpId").value = "";
    document.getElementById("inpTitle").value = "";
    document.getElementById("inpBody").value = "";
    document.getElementById("inpTags").value = "";
}

function createArticleNode(article) {
    var articleTitle = document.createElement("h1");
    articleTitle.classList = "articleTitle";
    var articleTitleLink = document.createElement("a");
    articleTitleLink.innerText = article.title;
    articleTitleLink.href = "#";
    articleTitle.appendChild(articleTitleLink);

    var articleBody = document.createElement("p");
    articleBody.classList = "articleBody";
    articleBody.innerText = article.body;
    
    var articleTags = document.createElement("p");
    articleTags.classList = "articleTags";
    articleTags.innerText = article.tags.map(function(tag) {
        return "#" + tag;
    }).join(" ");

    articleTitleLink.onclick = () => {
        onArticleTitleClicked(article);
    };

    var articleNode = document.createElement("div");
        articleNode.classList = "articleNode";
        articleNode.appendChild(articleTitle);
        articleNode.appendChild(articleBody);
        articleNode.appendChild(articleTags);
    return articleNode;
}

function onArticleTitleClicked(article) {
    scrollToTop();
    document.getElementById("inpId").value = article.id;
    document.getElementById("inpTitle").value = article.title;
    document.getElementById("inpBody").value = article.body;
    document.getElementById("inpTags").value = article.tags.join(" ");
    switchButtonsToCreateMode(false);
}

function addArticleNodes(articles) {
    var articleList = document.getElementById("articleList");
    articles.forEach(function(article) {
        articleList.prepend(createArticleNode(article));
    });
}

function randomUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}
