const {app, BrowserWindow} = require('electron');


const isDevelopment = process.env.NODE_ENV !== 'production';

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;

function createMainWindow() {
  const window = new BrowserWindow({webPreferences: {nodeIntegration: true}});


  if (isDevelopment) {
    window.loadURL(`http://localhost:8089`)
  } else {
    window.loadFile("build/index.html")
  }

  window.on('closed', () => {
    mainWindow = null
  });

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus()
    })
  });

  return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow();
  if (process.env.PLUGIN === 'true') {
    const installExtension = require('electron-devtools-installer');
    const {REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS} = installExtension;
    const extensions = [REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS];
    installExtension(extensions)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));
  }
});
