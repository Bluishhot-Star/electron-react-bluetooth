const { app, BrowserWindow, ipcMain } = require('electron')
const { Menu, MenuItem, dialog } = require('@electron/remote/main');
const path = require('path')
const url = require('url')
const Store = require('electron-store');

let bluetoothPinCallback = () =>{};
let selectBluetoothCallback = ()=>{};

// new
let BLEDevicesWindow;
let BLEDevicesList=[];
let connectedBLEDevice;
let callbackForBluetoothEvent = ()=>{};

let mainWindow;
function createWindow () {
  return new Promise((resolve, reject) => {
    try{
      mainWindow = new BrowserWindow({
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
          contextIsolation: true,
          enableRemoteModule: true,
          // devTools: false,
          webviewTag: true,
          // preload: path.join(__dirname, '/preload.js')
          preload: path.join(__dirname, "/BLEDevicesPreload.js")
        }
      })


      //******************************past START******************************************
      // mainWindow.webContents.on("select-bluetooth-device", (event, deviceList, callback) => {
      //   event.preventDefault();
      //   selectBluetoothCallback = callback
      //   console.log(deviceList);
      //   const result = deviceList.find((device)=>{
      //     if ((device.deviceName).split('-')[0] == "SpiroKit"){
      //       mainWindow.webContents.send("xyz", deviceList);
      //       return device
      //     }
      //   })
      //   if (result) {
      //     callback(result.deviceId);
      //   }else{
          
      //   }
      // });
    
      // ipcMain.on('cancel-bluetooth-request', (event) => {
      //   selectBluetoothCallback('');
      // })
    
      // // Listen for a message from the renderer to get the response for the Bluetooth pairing.
      // ipcMain.on('bluetooth-pairing-response', (event, response) => {
      //   bluetoothPinCallback(response)
      // })
      // const ses = mainWindow.webContents.session
      // ses.setBluetoothPairingHandler((details, callback) => {
      //   bluetoothPinCallback = callback
      //   // Send a message to the renderer to prompt the user to confirm the pairing.
      //   mainWindow.webContents.send('bluetooth-pairing-request', details)
      // })
      //******************************past FINISH******************************************
      
      // NEW START
      mainWindow.webContents.on(
        "select-bluetooth-device",
        (event, deviceList, callback) => 
        {
          event.preventDefault(); // do not choose the first one
    
          if (deviceList && deviceList.length > 0) {  // find devices?
            deviceList.forEach((element) => {    
              if (!BLEDevicesWindow) {
                console.log(32);
                createBLEDevicesWindow(); // open new window to show devices
              }     
              if (
                element.deviceName.includes("Spiro")&&
                !element.deviceName.includes(                  // reduce noise by filter Devices without name
                  "알 수 없거나 지원되지 않는 기기" // better use filter options in renderer.js
                ) &&
                !element.deviceName.includes("Unknown or Unsupported Device") // better use filter options in renderer.js
              ) {
                if (BLEDevicesList.length > 0) {  // BLEDevicesList not empty?
                  if (
                    BLEDevicesList.findIndex(     // element is not already in BLEDevicesList
                      (object) => object.deviceId === element.deviceId
                    ) === -1
                  ) {
                    BLEDevicesList.push(element);
                    console.log(BLEDevicesList);
                  }
                } else {
                  BLEDevicesList.push(element);
                  console.log(BLEDevicesList);
                }
              }
              
            });
          }
    
          callbackForBluetoothEvent = callback; // to make it accessible outside https://technoteshelp.com/electron-web-bluetooth-api-requestdevice-error/
        }
      );



      mainWindow.addListener("resize",(event)=>{
        if(BLEDevicesWindow){
          console.log("RRR");
          let size = mainWindow.getSize();
          let x = size[0];
          let y = size[1]-30;
          BLEDevicesWindow.setSize(x, y);
        }
      })
      mainWindow.loadURL("http://localhost:3000") 
      
      // resolve(mainWindow);
    }
    catch(error){
      reject(error);
    }
    
  })
}

// NEW
function createBLEDevicesWindow() {
  let size = mainWindow.getSize();
  BLEDevicesWindow = new BrowserWindow({
    width: size[0],
    height: size[1]-2,
    parent: mainWindow,
    title: "Bluetooth Devices near by",
    modal: true,
    hasShadow: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "/BLEDevicesPreload.js"), // use a preload script
    },
  });
  let current_win = BrowserWindow.getFocusedWindow();
  const pos = current_win.getPosition();
  console.log("Heello",pos)
  BLEDevicesWindow.setPosition(0,0);
  BLEDevicesWindow.setWindowButtonVisibility(true);


  BLEDevicesWindow.loadFile(__dirname+"/BLEDevicesWindow.html");
  BLEDevicesWindow.on('close', function () {
    BLEDevicesWindow = null;    
    callbackForBluetoothEvent("");
    BLEDevicesList = [];
  })
}
ipcMain.on("toMain", (event, args) => {
  console.log(args);
});

ipcMain.on("BLEScannFinished", (event, args) => {
  console.log(args);
  console.log(1);
  console.log(BLEDevicesList.find((item) => item.deviceId === args));
  let BLEDevicesChoosen = BLEDevicesList.find((item) => item.deviceId === args);
  BLEDevicesWindow = null;
  if (BLEDevicesChoosen) {
    BLEDevicesWindow = null;
    callbackForBluetoothEvent(BLEDevicesChoosen.deviceId);
    connectedBLEDevice = BLEDevicesChoosen;
  }
  else {
    BLEDevicesWindow = null;    
    callbackForBluetoothEvent("");
    console.log(2);
  }
  BLEDevicesList = [];
});

ipcMain.on("getBLEDeviceList", (event, args) => {
  if (BLEDevicesWindow)
  {
    BLEDevicesWindow.webContents.send("BLEDeviceList", BLEDevicesList);
  }
});
ipcMain.on("getConnectedDevice", (event, args)=>{
  console.log(connectedBLEDevice);
  mainWindow.reload();
  if(connectedBLEDevice) mainWindow.webContents.send("connectedBLEDevice", connectedBLEDevice);
})


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

app.commandLine.appendSwitch("enable-experimental-web-platform-features", "true");
app.commandLine.appendSwitch('enable-web-bluetooth', "true");
app.commandLine.appendSwitch('enable-web-bluetooth-new-permissions-backend', "true");
