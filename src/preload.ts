import {Context} from './Context';

console.log("src/preload.js running ...");

window.addEventListener('DOMContentLoaded', () => {
    console.log("preload.js: on DOMContentLoaded -> init UI");
    (<any>window).$ = require('jquery');
    Context.controller().initView();
});
