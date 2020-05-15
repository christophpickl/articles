import UiHandler from './UiHandler';
import { ipcRenderer } from 'electron';

window.addEventListener('DOMContentLoaded', () => {
    console.log("on DOMContentLoaded");
    // UiHandler().init();
    console.log("in preload:", document.getElementById("inpSearch"));
    ipcRenderer.sendSync("preloaded", document);
});
