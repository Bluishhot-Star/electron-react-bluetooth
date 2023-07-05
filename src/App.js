/*eslint-disable*/  // Lint제거 (warning 메세지 제거)

import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { refresh } from './refresh';
import { useCookies } from 'react-cookie';

// Variable & State
const author = "KASSID";

function App() {
  //const { ipcRenderer } = window.require("electron"); 
  return (
    <div className="App">
      {/* <ResultPage/> */}
      <LoginForm/>
      {/*<SignUpForm/>*/}
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


function ResultPage(){
  return(
    <div className="result-page-container">
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
  );
}


const LoginForm = () =>{
  const [values, setValues] = useState({
    loginId: "",
    password: "",
  });
  const [cookies, setCookie, remoteCookie] = useCookies();

  const [error, setError] = useState(undefined);
  const accessExpires = new Date();
  const refreshExpires = new Date();
  const handleSubmit = async (event)=>{
    event.preventDefault();

    axios.post("/auth/sign-in", 
    {
      loginId: values.loginId,
      password: values.password,
    },{withCredentials : true})
    .then((res)=>{
      // 쿠키에 토큰 저장
      accessExpires.setMinutes(accessExpires.getMinutes() + 14);
      setCookie("accessToken", res.data.response.accessToken,{expires : accessExpires,secure:"true"});
      refreshExpires.setDate(refreshExpires.getDate()+7);
      setCookie("refreshToken",res.data.response.refreshToken,{expires : refreshExpires,secure:"true"});
      setTimeout(()=>{
          refresh(null);
      },(1000*60*14));
    })
    .catch((error)=>{
      console.log(error);alert("ERROR");
    })
  };

  return(
    <div className="login-page-container">
      <div className="logo"><p>The SpiroKit</p></div>
      <form onSubmit={handleSubmit}>
        <div className="login-field">
          <label htmlFor="loginId">아이디</label>
          <input
            type="text" name='loginId'
            onChange={(e)=>setValues({...values, loginId: e.target.value})}
            placeholder='아이디'
            value={values.loginId}
          />
        </div>
        <div className="login-field">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password" name='password'
            onChange={(e)=>setValues({...values, password: e.target.value})}
            placeholder='비밀번호'
            value={values.password}
          />
        </div>
        {error ? <p className='error'>{error}</p> : <p></p>}
        <button type='submit' className='loginBtn'>로그인</button>
        <button>회원가입</button>
      </form>
      
    </div>
  );
}


const SignUpForm = () =>{
  const [values, setValues] = useState({
    countryId: "",
    organizationId: "",
    roleId: "",
    manager: {
      name:"",
      loginId: "",
      password: "",
      reEnterPassword: ""
  }
  });

  const [error, setError] = useState(undefined);
  const [validity, setValidity] = useState([-1, -1, -1]);
  const handleSubmit = async (event)=>{
    event.preventDefault();
    console.log(country);
    console.log(selectOValue);
    console.log(selectRValue);
    console.log(values);

    
    // ***************(TODO)**************
    // 아이디 중복 기능
    // 코드 깔끔하게 정리
    // select option --> 드롭다운 형식으로 새로만들기
    // post할때 values 그대로 해도 괜찮은지 (가장 마지막에 서버CALLBACK 보면될듯?)
    // ***********************************

    // axios.post("/auth/sign-up", 
    // values,{withCredentials : true})
    // .then((res)=>{
    //   console.log(res);
    // })
    // .catch((error)=>{
    //   console.log(error);alert("ERROR");
    // })
    
  };
  
  const hypenTel = (target) => {
    target.value = target.value
      .replace(/[^0-9]/g, '')
      .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
  }
  const reportLoginID = (e)=>{
    let regExp = /^[a-zA-Z0-9]{5,20}$/;
    return regExp.test(e.target.value);
  }
  const reportPassword = (e)=>{
    let regExp = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W]).{8,20}$/;
    return regExp.test(e.target.value);
  }
  const reportReEnterPassword = (e)=>{
    if(values.manager.password === e.target.value) return true;
    else false;
  }
  const ValidityFunc = {
    0:reportLoginID,
    1:reportPassword,
    2:reportReEnterPassword
  }

  const setInput = (e, num, func)=>{
    if(e.target.value.length === 0){
      if(e.target.classList.contains("incorrect")){
        e.target.classList.remove("incorrect")
      }
      let copy = [...validity];
      copy[num] = -1;
      setValidity(copy);
      return;
    };

    if(!func(e)){
      if(e.target.classList.contains("incorrect"))return;
      e.target.classList+="incorrect"
      let copy = [...validity];
      copy[num] = false;
      setValidity(copy);
    }
    else{
      if(e.target.classList.contains("incorrect")){
        e.target.classList.remove("incorrect")
      }
      let copy = [...validity];
      copy[num] = true;
      setValidity(copy);
    }
  }

  //나라 UUID
  const [country, setCountry] = useState("");
  //나라 선택
  const [selectCValue, setSelectCValue] = useState("");
  //기관 선택
  const [selectOValue, setSelectOValue] = useState("");
  //직책 선택
  const [selectRValue, setSelectRValue] = useState("");
  //기관 리스트
  const [organizations,setOrganizations] = useState([]);
  //직책 리스트
  const [roles, setRoles] = useState([]);
  //나라 UUID 선택
  const onChangeCSelect = (event) =>{
    setSelectCValue(event.target.value);
    setSelectOValue("");
    setSelectRValue("");
  }
  //기관 UUID 선택
  const onChangeOSelect = (event) =>{
    setSelectOValue(event.target.value); //기관UUID 저장
    setSelectRValue("");
  }
  //직책 UUID 선택
  const onChangeRSelect = (event) =>{
    console.log(event.target.value);
    setSelectRValue(event.target.value);
  }
  //나라 json
  useEffect(() => {
    axios.get('/countries')
    .then((res) => {
      if(selectCValue === "") return;

      let countriesUUID = res.data.response.filter(function(e){
        return e.code === selectCValue;
      })
      // UUID 정보 저장
      console.log(countriesUUID[0]);
      setCountry(countriesUUID[0].id);
    }).catch((error) => {
      console.log(error);
      alert("에러");
    })
  },[selectCValue])

  //기관 json
  useEffect(()=>{
    if(country === "") return;
    axios.get(`/countries/${country}/organizations`)
    .then((res) => {
      //기관 리스트 저장
      setOrganizations(res.data.response);
    }).catch((error) => {
      console.log(error);
      alert("에러1");
    })
  },[country])

  //직책 json
  useEffect(()=>{
    if(selectOValue === "") return;
    console.log(selectCValue);
    console.log(selectOValue);
    axios.get(`/organizations/${selectOValue}/roles`)
    .then((res)=>{
      console.log(res)
      setRoles(res.data.response);
    }).catch((error) => {
      console.log(error);
      alert("에러11");
  })
  },[selectOValue])

  useEffect(()=>{
    if(selectRValue === "")return;
    console.log("Hello")
    setValues({
      ...values,
      countryId: country,
      organizationId: selectOValue,
      roleId: selectRValue,
    })
  },[selectRValue])

  return(
    <div className="signUp-page-container">
      <div className="signUp-title"><p>회원가입</p></div>
      <form onSubmit={handleSubmit}>
      <div className="signUp-field">
          <label htmlFor="name">이름
            <p className='hint'>이름을 입력하세요.</p>
          </label>
          <input
            type="text" placeholder='이름' name='name'
            onChange={(e)=>{
              let copy = values.manager
              copy.name = e.target.value
              setValues({...values, manager: copy})}}
            value={values.manager.name}
          />
        </div>
        <div className="signUp-field">
          <label htmlFor="loginId">아이디
            {
            validity[0] === true || validity[0] === -1 ?
            <p className='hint'>5글자 이상 20글자 이하인 영문과 숫자를 사용하여 입력하세요.</p>
            : <p className='hint hint-incorrect'>올바른 아이디 형식이 아닙니다.</p>
            }
          </label>
          <input
            type="text" placeholder='아이디' name='loginId'
            onInput={
              (e)=>{
              setInput(e, 0, ValidityFunc[0]);
            }
          
          }
            onChange={(e)=>{
              let copy = values.manager
              copy.loginId = e.target.value
              setValues({...values, manager: copy})}}
            value={values.manager.loginId}
          />
        </div>
        {/* <p className='hint'>이름을 입력하세요.</p> */}
        <div className="signUp-field">
          <label htmlFor="password">비밀번호
          {
            validity[1] === true || validity[1] === -1 ?
            <p className='hint'>8글자 이상 20글자 이하인 영문과 숫자, 특수문자를 포함하여 입력하세요.</p>
            : <p className='hint hint-incorrect'>올바른 비밀번호 형식이 아닙니다.</p>
          }
          </label>
          <input
            type="password" placeholder='비밀번호' name='user-pwd'
            onInput={(e)=>{
              setInput(e, 1, ValidityFunc[1]);
            }}
            onChange={(e)=>{
              let copy = values.manager
              copy.password = e.target.value
              setValues({...values, manager: copy})}}
            value={values.manager.password}
          />
        </div>
        <div className="signUp-field">
          <label htmlFor="reEnterPassword">
            {
              validity[2] === true || validity[2] === -1 ?
              <></>
              : <p className='hint hint-incorrect'>비밀번호를 일치하게 입력해주세요.</p>
            }
          </label>
          <input
            type="password" name='reEnterPassword'
            onInput={(e)=>{
              setInput(e, 2, ValidityFunc[2]);
            }}
            onChange={(e)=>{
              let copy = values.manager
              copy.reEnterPassword = e.target.value
              setValues({...values, manager: copy})}}
            value={values.manager.reEnterPassword}
          />
        </div>
        <div className="signUp-field">
          <label htmlFor="tel">전화번호</label>
          <input
            type="tel" name='tel'
            // pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            onInput={(e)=>hypenTel(e.target)}
            onChange={(e)=>{
              let copy = values.manager
              copy.tel = e.target.value
              setValues({...values, manager: copy})}}
            value={values.manager.tel}
          />
        </div>
        <div className="signUp-field">
          <label htmlFor="countryId">나라</label>
          {/* <input
            type="text" name='countryId'
            onChange={(e)=>setValues({...values, countryId: e.target.value})}
            value={values.countryId}
          /> */}
          <select value={selectCValue} onChange={onChangeCSelect}>
            <option value="">나라</option>
            {/* <option value="">나라가 없습니다.</option> */}
            <option value="MN">몽골</option>
            <option value="KZ">카자흐스탄</option>
            <option value="KR">한국</option>
            <option value="VN">베트남</option>
          </select>
        </div>
        <div className="signUp-field">
          <label htmlFor="organizationId">기관</label>
          {/* <input
            type="text" name='organizationId'
            onChange={(e)=>setValues({...values, organizationId: e.target.value})}
            value={values.organizationId}
          /> */}
          <select value={selectOValue} onChange={onChangeOSelect}>
            <option value="">기관</option>
            {organizations.map((item)=>(
              <option value={item.id} key={item.id}>
                  {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="signUp-field">
          <label htmlFor="tel">직책</label>
          {/* <input
            type="tel" name='user-id'
            // onChange={(e)=>setValues({...values, email: e.target.value})}
            // value={values.email}
          /> */}
          <select value={selectRValue} onChange={onChangeRSelect}>
            <option value="">직책</option>
            {roles.map((item)=>(
              <option value={item.id} key={item.name}>
                  {item.name}
              </option>
            ))}
          </select>
        </div>
        {/* {error ? <p className='error'>{error}</p> : <p></p>} */}
        <button type='submit' className='signUpBtn'>회원가입</button>
      </form>
      
    </div>
  );
}














