import {delay} from "../src/common";

import {Application} from "spectron";

import * as electron from "electron";
// const electronPath = require('electron') // Require Electron from the binaries included in node_modules.
const path = require('path')

/* re-enable ... and use properly, sophisticated tests.

describe('Spectron', function () {
    let app: Application;

    beforeEach(async () => {
        app = new Application({
            path: "" + electron,
            args: [path.join(__dirname, "..")],
            env: {ARTIKLES_ENV: "TEST"}
        })

        await app.start()
        expect(app.isRunning()).toEqual(true);
    });

    afterEach(() => {
        if (app !== undefined && app.isRunning()) {
            app.stop();
        }
    });

    it('test window', async () => {
        // await app.client.waitUntilWindowLoaded()
        await delay(500);
        const inpTitle = app.client.element("#inpTitle");
        inpTitle.setValue("haha");
        // app.client.setValue("#inpTitle", "haha");
        // app.client.waitForExist("#articleListCount", 5 * 60 * 1000)
        // expect(await app.client.getText("#articleListCount")).toEqual("0");

        // app.client.elementIdClick("inpTitle");
        // app.client.pressKeycode("a", "");
        await delay(500);
        app.client.click("#btnCreate");
        await delay(500);

        // doesnt work :-/
        // console.log("foo:", app.client.element("#inpTitle").getValue());

        // app.webContents.executeJavaScript('1 + 2')
        //     .then(function (result) {
        //         console.log(result) // prints 3
        //     })

        // app.electron.clipboard.writeText("")
        // app.electron.clipboard.readText().then
    });
});
*/