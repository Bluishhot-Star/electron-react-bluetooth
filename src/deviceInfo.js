import { configureStore, createSlice, getDefaultMiddleware } from '@reduxjs/toolkit'

let deviceInfo = createSlice({
  name : 'deviceInfo',
  initialState : {},
  reducers : {
    changeDeviceInfo(state, action){
      return action.payload
    },
    reset(state, action) {
      return "";
    }
  },
})

export default configureStore({
  reducer: {
    deviceInfo : deviceInfo.reducer
  },
  // middleware: (getDefaultMiddleware)=>{
  //   getDefaultMiddleware({
  //     serializableCheck:false,
  //   })
  // }
}) 

export let { changeDeviceInfo, reset } = deviceInfo.actions 
