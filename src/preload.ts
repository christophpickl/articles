
console.log("preload.ts");

import UiHandler from './UiHandler';

window.addEventListener('DOMContentLoaded', () => {
    console.log("on DOMContentLoaded");
    UiHandler.init();
});
