const {app, BrowserWindow} = require("electron");
const path = require("path");
const settings = require("electron-settings");
const common = require("./common");

console.log("Starting articles app ...");
console.log(app.getPath("userData"));

var mainWindow = null;
function createWindow () {
  console.log("createWindow()");
  mainWindow = new BrowserWindow({
    // width: 1000,
    // height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.setTitle("Articles" + (common.IS_DEBUG ? " - DEV" : ""));
  mainWindow.setMinimumSize(600, 600);
  applyWindowSettings();
  
  mainWindow.loadFile("index.html");
  // mainWindow.webContents.openDevTools()

  mainWindow.on("close", function(e) {
    // also invoked when hitting CMD+Q :)
    let bounds = mainWindow.getBounds();
    
    console.log("about to close and save settings for:", bounds);
    settings.set("window", {
      width: bounds.width,
      height: bounds.height,
      x: bounds.x,
      y: bounds.y,
    });

    e.returnValue = true;
  });
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

function applyWindowSettings() {
  let lastWin = settings.get("window");
  // setSize(width, height, animate=true)
  // setPosition(x, y, animate=true)
  if(lastWin !== undefined) {
    mainWindow.setBounds(lastWin);
  }
}

app.on("ready", function() {
  console.log("on: ready");
});

app.on("window-all-closed", function () {
  console.log("on: window-all-closed; app.quit()");
  app.quit();
});

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
});
