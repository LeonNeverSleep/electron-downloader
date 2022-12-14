const electron = require('electron')
const { dialog, ipcMain } = require('electron')
const { download } = require('electron-dl');
const app = electron.app
const BrowserWindow = electron.BrowserWindow
require('electron-dl')();

const path = require('path')
const url = require('url')

let mainWindow
let folderpath
let downloadpath
function createWindow() {
  mainWindow = new BrowserWindow({ width: 800, height: 600, resizable: false })
  ipcMain.on('download', (evt, args) => {
    var arr = args.split("+");
    downloadpath = arr[0];
    folderpath = arr[1];
    evt.sender.send('tips', downloadpath);
    mainWindow.webContents.downloadURL(downloadpath);
  });
  mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
    item.setSavePath(folderpath + `\\${item.getFilename()}`);
    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log("下载暂停");
        } else {
          console.log(`下载中。。。接收字节：${item.getReceivedBytes()}`);
        }
      }
    })
    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log("下载成功");
      } else {
        console.log("下载失败");
      }
    })
  })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/app/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('closed', function () {
    mainWindow = null
  })

}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

