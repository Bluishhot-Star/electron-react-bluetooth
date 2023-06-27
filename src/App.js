/*eslint-disable*/  // Lint제거 (warning 메세지 제거)

import './App.css';
import { useState } from 'react';

// Variable & State
const author = "KASSID";

function App() {
  const { ipcRenderer } = window.require("electron"); 
  return (
    <div className="App">
      <div className="container">
        <div className="nav">
          <div className="nav-logo">
            <h1>The SpiroKit</h1>
          </div>
          <div className="nav-content-container">
            <div className="nav-left-container">
              <div className="admin">
                <span>담당자</span>
                <span>TR 관리자</span>
              </div>
            </div>
            <div className="nav-right-container">
              <button className="select-patient-btn">환자 선택</button>
              <button className="setting-btn">설정</button>
            </div>
          </div>
        </div>
        <div className="left-container">
          <div className="patient-info-container">
            <span>환자 정보</span>
            <div className="patient-info">
              <div className="title">이름</div>
              <div className="content">홍길동</div>
              <div className="title">성별</div>
              <div className="content">남자</div>
              <div className="title">신장</div>
              <div className="content">185.0cm</div>
              <div className="title">몸무게</div>
              <div className="content">90.0kg</div>
              <div className="title">생년월일</div>
              <div className="content">1995-11-18</div>
              <div className="title">연간 흡연량</div>
              <div className="content">-</div>
              <div className="title">흡연 여부</div>
              <div className="content">아니오</div>
              <div className="title">흡연 기간</div>
              <div className="content">-</div>
              {/* <div className="space"></div> */}
            </div>
            <button>환자정보 수정</button>
            {/* <div className="button-container"></div> */}
          </div>
        </div>
        <div className="right-container">
          {/* <div className="top"></div> */}
          <div className="button-container">
            <div className="two-btn-container">
              <button onClick={()=>{testIt()}} id="clickme" className="FVC-btn">FVC</button>
              <button className="SVC-btn">SVC</button>
            </div>
            <button className="detail-btn">결과 상세보기</button>
          </div>
          <div className="graph-container">
            <div className="graph"></div>
            <div className="graph"></div>
          </div>
          <div className="history-container">
            <div className="slider">
              <div>
                <p>Currently selected bluetooth device: <strong id="device-name"></strong></p></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;


// 기기 연결
async function testIt () {
  try{
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e']
    })
    console.log(device.id)
    console.log(device.gatt)
    document.getElementById('device-name').innerHTML = device.name
     // GATT 서버 연결
    const server = await device.gatt.connect();
  
    // Nordic UART Service 가져오기
    const service = await server.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e');
  
    // 수신 특성 가져오기
    const rxCharacteristic = await service.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e');
  
    // 송신 특성 가져오기
    const txCharacteristic = await service.getCharacteristic('6e400003-b5a3-f393-e0a9-e50e24dcca9e');
  
    // Notify(구독) 활성화
    await txCharacteristic.startNotifications();
  
    // Notify(구독) 이벤트 핸들러 등록
    txCharacteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
  
    console.log('Connected to BLE device');
  }
  catch(error){
    console.error('Failed to select device:', error);
    alert('Failed to select device. Please try again.');
  }
}

function handleCharacteristicValueChanged(event) {
  const value = event.target.value;
  // 데이터 처리 및 UART 프로토콜 해석
  console.log('Received data:', value);
}
function cancelRequest () {
  window.electronAPI.cancelBluetoothRequest()
}