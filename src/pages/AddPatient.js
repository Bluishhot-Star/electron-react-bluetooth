import { useState, useRef, useEffect} from 'react';
import axios from 'axios';
import {Cookies, useCookies } from 'react-cookie';

import { Routes, Route, Link, useNavigate,useLocation } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronDown } from '@fortawesome/free-solid-svg-icons'
const AddPatient = ()=>{
  const [examinee,setExaminee] = useState({
    managerId:"",//담당 매니저의 UUID
    chartNumber:"",
    name:"",
    birthday:"",
    gender:"",
    info: {
      height: "",
      weight: "",
    },
    smoke: {
      experience: "", //true : 경험있음, false : 경험없음
      smoking: "", //true : 현재 흡연중, false : 현재 금연 상태
      amountDay: "", //하루 흡연량(갑 기준)
      startAge: "",
      stopAge: ""
    }
  });
  const submitAddP = ()=>{
    console.log("GH")
    //PATCH 부분
    // if(location.state.update){
    //   axios.patch('/examinees',examinee,{withCredentials : true})
    //   .then((res)=>{
    //     console.log(res);
    //   })
    //   .catch((error)=>{
    //     console.log(error);alert("ERROR");
    //   })
    // }
    //POST 부분
    // else{
    //   axios.post('/examinees',examinee,{withCredentials : true})
    //   .then((res)=>{
    //     console.log(res);
    //   })
    //   .catch((error)=>{
    //     console.log(error);alert("ERROR");
    //   })
    // }
    navigator(-1);
  }
  const location = useLocation();
  const cookies = new Cookies();

  // 숫자Input 강제성
  const numberInput = (target)=>{
    target.value = target.value.replace(/[^0.0-9.0]/g, '');
  }

  // 성별radio값 반영
  const genderChange = (e)=>{
    let copy = examinee.gender;
    copy = e.target.value;
    setExaminee({...examinee, gender:copy});
  }
  // 흡연여부radio값 반영
  const smokeChange = (e, val)=>{
    let copy = examinee.smoke;
    copy[val] = e.target.value;
    setExaminee({...examinee, smoke:copy});
  }
  // 생년월일 하이픈
  const hypenBirth = (target) => {
    target.value = target.value
    .replace(/[^0-9]/g, '')
    .replace(/^(\d{4})(\d{2})(\d{2})$/, `$1-$2-$3`);
  }

  // 담당자 데이터 GET
  const [managers, setManagers] = useState([]);
  useEffect(()=>{
    axios.get('/managers?loginId=&name=',{
      headers: {
        Authorization: `Bearer ${cookies.get('accessToken')}`
    }}).then((res)=>{
      // console.log(res.data.response);
      setManagers(res.data.response);
    }).catch((err)=>{
      console.log(err);
    })
  },[])
  
  // 각종 useRef
  const mangerIdRef = useRef();
  const birthdayRef = useRef();
  const expTrueRef = useRef();
  const expFalseRef = useRef();
  const smokingTrueRef = useRef();
  const smokingFalseRef = useRef();
  const startAgeRef = useRef();
  const amountRef = useRef();
  const stopAgeRef = useRef();
  const maleRef = useRef();
  const femaleRef = useRef();

  // smoke 상황별 버튼 활성화
  useEffect(()=>{
    let time = setTimeout(()=>{
      if(examinee.smoke.experience === false || examinee.smoke.experience === "false"){
        console.log("HERERER");
        console.log(examinee);
        smokingTrueRef.current.checked = false;
        smokingFalseRef.current.checked = false;
        smokingTrueRef.current.disabled = true;
        smokingFalseRef.current.disabled = true;
        startAgeRef.current.disabled = true;
        amountRef.current.disabled = true;
        stopAgeRef.current.disabled = true;
        let copy = examinee.smoke;
        copy.smoking = "";
        copy.startAge = "";
        copy.stopAge = "";
        copy.amountDay = "";
        setExaminee({...examinee, smoke: copy});
      }
      else{
        console.log("HERE1");
        console.log(examinee);
        smokingTrueRef.current.disabled = false;
        smokingFalseRef.current.disabled = false;
        startAgeRef.current.disabled = false;
        amountRef.current.disabled = false;
      }
    },100)
    return()=>{clearTimeout(time)}
  },[examinee.smoke.experience])

  useEffect(()=>{
    let time = setTimeout(()=>{
      if(examinee.smoke.experience === false || examinee.smoke.experience === "false")return;
      if(examinee.smoke.smoking === false || examinee.smoke.smoking === "false"){
        console.log("HERE11")
        stopAgeRef.current.disabled = false;
      }
      else{
        console.log("HERE2")
        stopAgeRef.current.disabled = true;
        let copy = examinee.smoke;
        copy.stopAge = "";
        setExaminee({...examinee, smoke: copy});
      }
    },200)

    return()=>{
      clearTimeout(time);
    }
  },[examinee.smoke.smoking])

  // 담당자 명 기본값 css
  useEffect(()=>{
    if(examinee.managerId === ""){
      mangerIdRef.current.classList.add("unselect")
    }
    else{
      mangerIdRef.current.classList.remove("unselect")
    }
  },[examinee.managerId])

  // 생년월일 유효성 상태
  const [validity, setValidity] = useState(false);
  useEffect(()=>{
    let regExp = /^(\d{4})-(\d{2})-(\d{2})$/;
    let result = regExp.test(birthdayRef.current.value);
    setValidity(result);
  },[examinee["birthday"]])

  // 추가 완료 버튼 상태
  const addBtnRef = useRef();
  const [addBtnStatus, setAddBtnStatus] = useState(false);
  
  // 추가 완료 버튼 유효성 검사
  useEffect(()=>{
    if(!(examinee.managerId!==""&&examinee.chartNumber!==""&&examinee.name!==""&&examinee.birthday!==""
    &&examinee.gender!==""&&examinee.info.height!==""&&examinee.info.weight&&examinee.smoke.experience!=="")){
      console.log("ch1");
      setAddBtnStatus(false);
      return;
    }
    if(!validity){
      setAddBtnStatus(false);
      return;
    }
    if(examinee.smoke.experience === "true"){
      if(!(examinee.smoke.smoking !== ""&&examinee.smoke.amountDay !== ""&&examinee.smoke.startAge !== "")){
        console.log("ch2");
        setAddBtnStatus(false);
        return;
      }
      if(examinee.smoke.smoking === "false"){
        if(!(examinee.smoke.stopAge !== "")){
          console.log("ch3");
          setAddBtnStatus(false);
          return;
        }
      }
    }
    setAddBtnStatus(true);
  })

  // 추가 완료 버튼 css
  useEffect(()=>{
    if(addBtnStatus === true){
      addBtnRef.current.disabled = false;
    }
    else{
      addBtnRef.current.disabled = true;
    }
  },[addBtnStatus])

  // useNavigate
  const navigator = useNavigate();

  //환자 정보 수정하기
  const [addUpdate,setAddUpdate] = useState(false);

  useEffect(()=>{
    if(location.state){
      axios.get(`/examinees/${location.state.id}`,{
        headers: {
          Authorization: `Bearer ${cookies.get('accessToken')}`
      }}).then((res)=>{
        const exData = res.data.response;
        setAddUpdate(location.state.update);
        //흡연 경혐
        if(exData.smoke.experience){
          expTrueRef.current.checked = true;
        }else{
          expFalseRef.current.checked = true;
        }
        //현재 흡연 여부
        if(exData.smoke.smoking){
          smokingTrueRef.current.checked = true;
        }else{
          smokingFalseRef.current.checked = true;
        }
        //성별
        if(exData.gender === "MALE"){
          maleRef.current.checked = true;
        }else{
          femaleRef.current.checked = true;
        }
        setExaminee({
          ...examinee,
          managerId:exData.manager.id,
          chartNumber:exData.chartNumber,
          name:exData.name,
          birthday:exData.birthday,
          gender:exData.gender,
          info: {
            height: exData.inform.height,
            weight: exData.inform.weight,
          },
          smoke: {
            experience: exData.smoke.experience,
            smoking: exData.smoke.smoking, 
            amountDay: exData.smoke.amountDay,
            startAge: exData.smoke.startAge,
            stopAge: exData.smoke.stopAge
          }
      });
      }).catch((err)=>{
        console.log(err);
      })
      
    }
  },[])

  return(
    <>
      <div className="add-patient-page-container">
        
        <div className="add-patient-page-nav">
          <div className='add-patient-backBtn' onClick={()=>{navigator(-1)}}>
            <FontAwesomeIcon icon={faChevronLeft} style={{color: "#4b75d6",}} />
          </div>
          <p onClick={()=>{console.log(examinee)}}>{addUpdate === true ? "환자 정보 수정" : "환자 정보 추가"}</p>
          <button ref={addBtnRef} className="add-complete-btn"
          onClick={(e)=>{
            e.preventDefault();
            console.log(examinee);
            submitAddP();
          }}><p>{addUpdate === true ? "수정 완료" : "추가 완료"}</p></button>
        </div>
        <div className="add-patient-page-top-container">
          <div className="inner">
            <div className="chartNumInput-container input-container">
              <label htmlFor="">차트넘버</label>
              <input type="number" value={examinee.chartNumber}
              onChange={(e)=>{
                let copy = examinee.chartNumber;
                copy = e.target.value;
                setExaminee({...examinee, chartNumber: copy})
              }}/>  
            </div>
            <div className="input-container">
              <label htmlFor="">담당자 선택</label>
              {/* <FontAwesomeIcon htmlFor="adminSelect" className='admin-chevronDown' icon={faChevronDown} style={{color: "#4b75d6",}} /> */}
              <select
              id='adminSelect'
              ref={mangerIdRef}
              value={examinee.managerId}
              onChange={(e)=>{
                let copy = examinee.managerId;
                copy = e.target.value;
                setExaminee({...examinee, managerId: copy});
              }}>
                <option value="">담당자명</option>
                {managers.map((item)=>(
                  <option value={item.id} key={item.id}>
                      {item.name}
                  </option>
                ))}
              </select>
              <FontAwesomeIcon className='admin-chevronDown' icon={faChevronDown} style={{color: "#4b75d6",}} />
            </div>
          </div>
        </div>
        <div className="add-patient-page-bottom-container">
          <div className="inner">
            <div className="info-container">
              <p>기본 정보</p>
            </div>
            <div className="info-input-container">
              <label htmlFor="name">이름</label>
              <input type="text" name='name' value={examinee.name} 
              onChange={(e)=>{
                let copy = examinee.name;
                copy = e.target.value;
                setExaminee({...examinee, name: copy})
              }}/>
            </div>
            <div className="info-input-container">
              <label htmlFor="">성별</label>
              <div className="radio-container">
                <div className='radioBtn' >
                  <input ref={maleRef} onChange={genderChange} value="MALE" type="radio" name="gender" id="man"/>
                  <label htmlFor="man">남</label>
                </div>
                <div className='radioBtn'>
                  <input ref={femaleRef} onChange={genderChange} value="FEMALE" type="radio" name="gender" id="woman" />
                  <label htmlFor="woman">여</label>
                </div>
              </div>
            </div>
            <div className="info-input-container">
              <label htmlFor="">신장</label>
              <input type="text" value={examinee.info.height} placeholder='0'
              onInput={(e)=>{numberInput(e.target)}}
              onChange={(e)=>{
                let copy = examinee.info;
                copy.height = e.target.value;
                setExaminee({...examinee, info: copy})
              }}/>
              <div className='inputMeasure'><p>cm</p></div>
            </div>
            <div className="info-input-container">
              <label htmlFor="">몸무게</label>
              <input type="text" value={examinee.info.weight} placeholder='0'
              onInput={(e)=>{numberInput(e.target)}}
              onChange={(e)=>{
                let copy = examinee.info;
                copy.weight = e.target.value;
                setExaminee({...examinee, info: copy})
              }}/>  
              <div className='inputMeasure'><p>Kg</p></div>
            </div>
            <div className="info-input-container">
              <label htmlFor="">생년월일</label>
              <input ref={birthdayRef} type="text" value={examinee.birthday} placeholder='0000-00-00'
              onInput={(e)=>{hypenBirth(e.target)}}
              onChange={(e)=>{
                let copy = examinee.birthday;
                copy = e.target.value;
                setExaminee({...examinee, birthday: copy})
              }}/>
            </div>
          </div>
        </div>
        <div className="add-patient-page-bottom-container">
          <div className="inner">
          <div className="info-container">
            <p>기본 정보</p>
          </div>
            <div className="info-input-container">
              <label htmlFor="">흡연경험</label>
              <div className="radio-container">
                <div className='radioBtn' >
                  <input ref={expTrueRef} onChange={(e)=>{smokeChange(e,"experience")}} value="true" type="radio" name="experience" id="expTrue"/>
                  <label htmlFor="expTrue">있음</label>
                </div>
                <div className='radioBtn'>
                  <input ref={expFalseRef} onChange={(e)=>{smokeChange(e,"experience")}} value="false" type="radio" name="experience" id="expFalse" />
                  <label htmlFor="expFalse">없음</label>
                </div>
              </div>
            </div>
            <div className="info-input-container">
              <label htmlFor="">현재 흡연 여부</label>
              <div className="radio-container">
                <div className='radioBtn' >
                  <input ref={smokingTrueRef} onChange={(e)=>{smokeChange(e,"smoking")}} value="true" type="radio" name="smoking" id="smokingTrue"/>
                  <label htmlFor="smokingTrue">흡연</label>
                </div>
                <div className='radioBtn'>
                  <input ref={smokingFalseRef} onChange={(e)=>{smokeChange(e,"smoking")}} value="false" type="radio" name="smoking" id="smokingFalse" />
                  <label htmlFor="smokingFalse">금연</label>
                </div>
              </div>
            </div>
            <div className="info-input-container">
              <label htmlFor="">흡연 시작나이</label>
              <input ref={startAgeRef} type="text" value={examinee.smoke.startAge} placeholder='0'
              onInput={(e)=>{numberInput(e.target)}}
              onChange={(e)=>{
                let copy = examinee.smoke;
                copy.startAge = e.target.value;
                setExaminee({...examinee, smoke: copy})
              }}/>  
            </div>
            <div className="info-input-container">
              <label htmlFor="">하루 흡연량(갑)</label>
              <input ref={amountRef} type="text" value={examinee.smoke.amountDay} placeholder='0'
              onInput={(e)=>{numberInput(e.target)}}
              onChange={(e)=>{
                let copy = examinee.smoke;
                copy.amountDay = e.target.value;
                setExaminee({...examinee, smoke: copy})
              }}/>  
            </div>
            <div className="info-input-container">
              <label htmlFor="">금연한 나이</label>
              <input ref={stopAgeRef} type="text" value={examinee.smoke.stopAge} placeholder='0'
              onInput={(e)=>{numberInput(e.target)}}
              onChange={(e)=>{
                let copy = examinee.smoke;
                copy.stopAge = e.target.value;
                setExaminee({...examinee, smoke: copy})
              }}/>  
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default AddPatient;