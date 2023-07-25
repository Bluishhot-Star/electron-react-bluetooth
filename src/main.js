const { app, BrowserWindow, ipcMain } = require('electron')
const { Menu, MenuItem, dialog } = require('@electron/remote/main');
const path = require('path')
const url = require('url')

// function createWindow () {  
//   mainWindow = new BrowserWindow({
//     width: initialWidth,
//     height: initialHeight,
//     minWidth: 800,
//     minHeight: 600,
//     webPreferences: {
//       nodeIntegration: true,
//       contextIsolation: false,
//       transparent: false,
//       frame: true,
//       resizable: true,
//       hasShadow: false,
//       alwaysOnTop: false,
//       nodeIntegration: true,
//       contextIsolation: false,
//       enableRemoteModule: true,
//       webviewTag: true
//     },
//   });

//   mainWindow.loadURL("http://localhost:3000") 

//   mainWindow.on('closed', () => {
//     mainWindow = null;
//   });

//   mainWindow.on('resize', () => {
//   });
// }  

function createWindow () {
  return new Promise((resolve, reject) => {
    try{
      const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          transparent: false,
          frame: true,
          resizable: true,
          hasShadow: false,
          alwaysOnTop: false,
          nodeIntegration: true,
          contextIsolation: false,
          enableRemoteModule: true,
          // devTools: false,
          webviewTag: true,
          preload: path.join(__dirname, 'preload.js')
        }
      })
      mainWindow.webContents.on("select-bluetooth-device", (event, deviceList, callback) => {
        event.preventDefault();
        selectBluetoothCallback = callback
    
        const result = deviceList.find((device)=>{
          if ((device.deviceName).split('-')[0] == "SpiroKit"){
            mainWindow.webContents.send("xyz", deviceList);
            return device
          }
        })
        if (result) {
          callback(result.deviceId);
        }else{
    
        }
      });
    
      ipcMain.on('cancel-bluetooth-request', (event) => {
        selectBluetoothCallback('')
      })
    
      // Listen for a message from the renderer to get the response for the Bluetooth pairing.
      ipcMain.on('bluetooth-pairing-response', (event, response) => {
        bluetoothPinCallback(response)
      })
      const ses = mainWindow.webContents.session
      ses.setBluetoothPairingHandler((details, callback) => {
        bluetoothPinCallback = callback
        // Send a message to the renderer to prompt the user to confirm the pairing.
        mainWindow.webContents.send('bluetooth-pairing-request', details)
      })
    
      
      mainWindow.loadURL("http://localhost:3000") 
      
      resolve(mainWindow);
    }
    catch(error){
      reject(error);
    }
    
  })
}




// app.on('ready', createWindow);

app.whenReady().then(() => {
  createWindow()

  //for MacOS
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
//for Window, Linux
//when close 
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

