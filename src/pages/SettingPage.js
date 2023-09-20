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
  let navigator = useNavigate();

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
          <div className='setting-page-backBtn' onClick={()=>{navigator(-1)}}>
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
                  <div><p>SpiroKit-E265</p></div>
                  <div><p>AD:ec:12:vc:dc:18</p></div>
                  <div><p>-49</p></div>
                </div>

            </div>
          </div>
          <div className='device-scan-btn-container'>
            <div className='device-scan-btn'>
              <p>스캔</p>
            </div>
          </div>

        </div>
        <div className="setting-page-right-container">
          <div className="user-info-change-btn" onClick={()=>{navigator("./subjectSetting")}}><p>유저 정보 변경</p></div>
          <div className="measure-setting-btn"><p>검사 설정</p></div>
          <div className="clinic-manage-btn" onClick={()=>{navigator("./mngClncs")}}><p>의료진 관리</p></div>
          <div className="device-manage-btn" onClick={()=>{navigator("./deviceSetting")}}><p>디바이스 관리</p></div>
          <div className="calibration-btn"><p>보정</p></div>
          <div className="calibration-verification-btn"><p>보정 검증</p></div>

          <div className="log-out-btn" onClick={logOut}><p>로그아웃</p></div>
        </div>
      </div>
  );
}

export default SettingPage;