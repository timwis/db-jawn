const {app, BrowserWindow, Menu} = require('electron')
const menuTemplate = require('./menu')(app)

let window

app.on('ready', () => {
  window = new BrowserWindow({width: 1360, height: 800})
  window.loadURL(`file://${__dirname}/public/index.html`)

  // Open dev tools
  if (process.env.NODE_ENV === 'development') window.webContents.openDevTools()

  window.on('closed', () => { window = null })
})

// Create default menu
app.once('ready', () => {
  if (Menu.getApplicationMenu()) return
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
