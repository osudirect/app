const { app, BrowserWindow, shell } = require('electron');
const path = require("path")

let mainWindow;
let gamePath; //TODO: add option to only download file.

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true
    });
    
    mainWindow.loadURL("https://catboy.best");

    mainWindow.webContents.session.on("will-download", (event, item, webContents) => {
        const savePath = path.join(app.getPath('downloads'), item.getFilename());
        item.setSavePath(savePath);

        item.on("updated", (event, state) => {
            if (state === 'interrupted') {
                console.log('Download is interrupted but can be resumed')
              } else if (state === 'progressing') {
                if (item.isPaused()) {
                  console.log('Download is paused')
                }
              }
        })

        item.once('done', (event, state) => {
            if (state === 'completed') {
            shell.openPath(path.join(app.getPath('downloads'), item.getFilename()))
              console.log('Download successfully')
            } else {
              console.log(`Download failed: ${state}`)
            }
        })
    })

    mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
