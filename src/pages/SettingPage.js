import { useState, useRef, useEffect} from 'react';
import axios from 'axios';
import { Cookies, useCookies } from 'react-cookie';
import Alert from "../components/Alerts.js"
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FaBluetoothB } from "react-icons/fa6";
import {} from "@fortawesome/fontawesome-svg-core"


const SettingPage = () =>{

  const cookies = new Cookies();
  let navigatorR = useNavigate();

  const logOut = () => {
    axios.post(`/auth/sign-out`,{
      headers: {
        Authorization: `Bearer ${cookies.get('accessToken')}`
      }}).then((res)=>{
        cookies.remove('refreshToken',{path : '/'});
        cookies.remove('accessToken',{path : '/'});
        window.location.replace('/');
      }).catch((err)=>{
        console.log(err);
      });
  }


  async function scanDevice(){
    const wait = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay))
    const device = navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e'], //Nordic UART Service 가진 디바이스만 accept
      duration: 5000,
    })
    .then((res)=>{
      console.log("JE");
      console.log(res);
    })
    .catch((err)=>{
      console.log(err)
      setTimeout(() => {
        // console.log("디바이스가 검색되지 않습니다.");
      }, 5000);
      console.log(err);
    })
    // console.log(device);
    // if(navigator.bluetooth.)continue;
    await wait(5000);
    console.log("HEllo!! 5초 후 스캔버튼으로")

    return;
    // stopScan()
    // function stopScan(){
    //   device.stop();
    // }
    // try {
    //   let time = 1;
    //   while (time--) {
    //     const device = navigator.bluetooth.requestDevice({
    //       acceptAllDevices: true,
    //       optionalServices: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e'] //Nordic UART Service 가진 디바이스만 accept
    //     })
    //     .then((res)=>{
    //       console.log("JE");
    //       console.log(res);
    //     })
    //     .catch((err)=>{
    //       console.log("HEHEHEHEHEH");
    //       console.log(err);
    //     })
    //     // console.log(device);
    //     // if(navigator.bluetooth.)continue;
    //     await wait(5000);
    //   }
    //   throw new Error('Stop!!!');
      
    // } catch (error) {
    //   console.error('Failed to select device:', error);
    // }
  }
  async function test(){
    //비동기 함수 멈추고 5초
    const wait = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay))
    try {
      scanDevice()
      await wait(5000);
      throw new Error('Stop!!!');
    } catch (error) {
      console.error('znzn');
    }
  }

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
    
    // Nordic UART Service 가져오기
    const service = await server.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e');
  
    // 수신 특성 가져오기
    const rxCharacteristic = await service.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e');
  
    // 송신 특성 가져오기
    const txCharacteristic = await service.getCharacteristic('6e400003-b5a3-f393-e0a9-e50e24dcca9e');

     // GATT 서버 연결
    const server = await device.gatt.connect();

    // 검사하기 버튼 누르고 쓸 부분
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

  return(
    // <div>
    //   <div onClick={()=>{navigator(-1)}}>
    //     스캔
    //   </div>
    //   <div>
    //     <div>유저 정보 변경</div>
    //     <div>검사 정보</div>
    //     <div>의료진 관리</div>
    //     <div>디바이스 관리</div>
    //     <div>보정</div>
    //     <div>보정 검증</div>
    //   </div>
      
    //   <div onClick={logOut}>
    //     로그아웃
    //   </div>
    // </div>
    <div className="setting-page-container">
        <div className="setting-page-nav" onClick={()=>{console.log()}}>
          <div className='setting-page-backBtn' onClick={()=>{navigatorR(-1)}}>
            <FontAwesomeIcon icon={faChevronLeft} style={{color: "#4b75d6",}} />
          </div>
          <p>설정</p>
        </div>

        <div className="setting-page-left-container">
          <div className="setting-page-left-container-nav">
            <p>디바이스 정보</p>
            <div className="device-connect" onClick={()=>{}}>
              <p>연결되지 않음</p>
              <FaBluetoothB/>
            </div>
          </div>

          <div className='connect-info-container'>
            <div className='connect-info'>
                <p>{"PC의 블루투스 옵션을 켜신 후, 애플리케이션에서 요구하는 권한을 허용하셔야 합니다.\n"}디바이스의 전원을 켜신 후 스캔 버튼을 눌러주세요.</p>
                {"연결이 원활하지 않은 경우, 디바이스를 껐다가 다시 켜주신 후 연결을 시도해주세요."}

            </div>
          </div>
          <div className='device-list-container'>
            <div className="device-list-column">
              <div>디바이스</div>
              <div>맥 주소</div>
              <div>dB</div>
            </div>
            <div className="device-item-container">
                {/* 반복할 부분 */}
                <div className="device-item">
                  {/* <div><p>SpiroKit-E265</p></div>
                  <div><p>AD:ec:12:vc:dc:18</p></div>
                  <div><p>-49</p></div> */}
                </div>

            </div>
          </div>
          <div className='device-scan-btn-container'>
            <div className='device-scan-btn' onClick={()=>{scanDevice()}}>
              <p>스캔</p>
            </div>
          </div>

        </div>
        <div className="setting-page-right-container">
          <div className="user-info-change-btn" onClick={()=>{navigatorR("./subjectSetting")}}><p>유저 정보 변경</p></div>
          <div className="measure-setting-btn"><p>검사 설정</p></div>
          <div className="clinic-manage-btn" onClick={()=>{navigatorR("./mngClncs")}}><p>의료진 관리</p></div>
          <div className="device-manage-btn" onClick={()=>{navigatorR("./deviceSetting")}}><p>디바이스 관리</p></div>
          <div className="calibration-btn"><p>보정</p></div>
          <div className="calibration-verification-btn"><p>보정 검증</p></div>

          <div className="log-out-btn" onClick={logOut}><p>로그아웃</p></div>
        </div>
      </div>
  );
}

export default SettingPage;