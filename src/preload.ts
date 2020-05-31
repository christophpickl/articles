import {Context} from './Context';

console.log("preload.js: adding event listener");

window.addEventListener('DOMContentLoaded', () => {
    console.log("preload.js: on DOMContentLoaded -> initView()");
    Context.controller().initView();
});
