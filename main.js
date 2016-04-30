const {app, BrowserWindow, ipcMain} = require('electron')

require('crash-reporter').start()

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', function () {
  let mainWindow = new BrowserWindow({ width: 1360, height: 800 })

  mainWindow.loadUrl('file://' + __dirname + '/public/index.html')

  mainWindow.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
})

ipcMain.on('asynchronous-message', function (event, arg) {
  console.log(arg)
  event.sender.send('asynchronous-reply', 'pong')
})
