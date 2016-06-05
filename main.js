const {app, BrowserWindow} = require('electron')

let window

app.on('ready', () => {
  window = new BrowserWindow({width: 1360, height: 800})
  window.loadURL(`file://${__dirname}/public/index.html`)

  // Open dev tools
  window.webContents.openDevTools()

  window.on('closed', () => window = null)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
