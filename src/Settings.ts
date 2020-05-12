
const settings = require("electron-settings"); // have to do it old school way

export { Settings, WindowPosition, ElectronSettings }


interface Settings {
    loadWindow(): WindowPosition | null
    saveWindow(window: WindowPosition): void
}

class ElectronSettings implements Settings {

    private static WINDOW_KEY = "window";

    loadWindow(): WindowPosition | null {
        let savedWindow = settings.get(ElectronSettings.WINDOW_KEY);
        if (savedWindow === undefined) {
            return null;
        }
        return new WindowPosition(
            savedWindow.width,
            savedWindow.height,
            savedWindow.x,
            savedWindow.y
        );
    }

    saveWindow(window: WindowPosition) {
        settings.set(ElectronSettings.WINDOW_KEY, {
            width: window.width,
            height: window.height,
            x: window.x,
            y: window.y,
        });
    }
}

/** same as electron's Rectangle */
class WindowPosition {
    constructor(
        public width: number,
        public height: number,
        public x: number,
        public y: number
    ) {}
}
