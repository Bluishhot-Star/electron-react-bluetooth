const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    // whitelist channels
    let validChannels = ["toMain", "BLEScannFinished", "getBLEDeviceList", "getConnectedDevice","set-cookie","remove-cookies"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    let validChannels = ["BLEScannElement", "BLEDeviceList", "connectedBLEDevice"];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  get: (channel,data) => {
    if(channel === 'get-cookies'){
      // console.log(key)
      return ipcRenderer.sendSync(channel,data);
    }
  },
});

