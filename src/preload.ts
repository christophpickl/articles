import { Context } from './Context';

window.addEventListener('DOMContentLoaded', () => {
    console.log("preload.js: on DOMContentLoaded -> init UI");
    Context.controller().initView();
});
