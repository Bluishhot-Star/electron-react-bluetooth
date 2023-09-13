import { useState, useRef, useEffect} from 'react';
import axios from 'axios';
import { Cookies, useCookies } from 'react-cookie';
import Alert from "../components/Alerts.js"

const SettingPage = () =>{

const cookies = new Cookies();


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
    <div>
      <div>
        스캔
      </div>
      <div>
        <div>유저 정보 변경</div>
        <div>검사 정보</div>
        <div>의료진 관리</div>
        <div>디바이스 관리</div>
        <div>보정</div>
        <div>보정 검증</div>
      </div>
      
      <div onClick={logOut}>
        로그아웃
      </div>
    </div>
  );
}

export default SettingPage;