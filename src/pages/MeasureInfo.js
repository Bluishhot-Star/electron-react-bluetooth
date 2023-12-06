import { useState, useRef, useEffect} from 'react';
import axios from 'axios';
import {Cookies, useCookies } from 'react-cookie';

import { Routes, Route, Link, useNavigate,useLocation } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronDown } from '@fortawesome/free-solid-svg-icons'
const MeasureInfo = ()=>{

  const cookies = new Cookies();

  //검사 정보
  const [info,setInfo] = useState({
    type : "",
    administration: ""
  });

  // 숫자Input 강제성
  const numberInput = (target)=>{
    target.value = target.value.replace(/[^0.0-9.0]/g, '');
  };
  // 각종 useRef
  // const mangerIdRef = useRef();
  const FVCTypeRef = useRef();
  const SVCTypeRef = useRef();
  const mediTrueRef = useRef();
  const mediFalseRef = useRef();


  // 추가 완료 버튼 상태
  const addBtnRef = useRef();
  const [addBtnStatus, setAddBtnStatus] = useState(false);
  
  // useNavigate
  const navigatorR = useNavigate();
  const location = useLocation();
  const state = location.state;

  const administration = (value) =>{
    setInfo({...info, administration: value});
  };

  const type = (value) =>{
    setInfo({...info,type:value});
  };

  useEffect(()=>{
    console.log(info);
    if(info.administration !=='' && info.type !== ''){
      addBtnRef.current.classList.remove("disabled");
    }else{
      addBtnRef.current.classList += " disabled";
      console.log(addBtnRef.current.classList)
    }
  },[info]);

  return(
    <>
      <div className="measure-info-page-container">
        <div className="measure-info-page-nav">
          <div className='measure-info-backBtn' onClick={()=>{navigatorR(-1)}}>
            <FontAwesomeIcon icon={faChevronLeft} style={{color: "#4b75d6",}} />
          </div>
          <p>검사 정보</p>
        </div>
        <div className="measure-info-page-main-container">
          <div className="inner">
            <form>

              {/* <div className="info-input-container">
                <label htmlFor="">담당의</label>
                <FontAwesomeIcon htmlFor="adminSelect" className='admin-chevronDown' icon={faChevronDown} style={{color: "#4b75d6",}} />
                <select
                id='adminSelect'
                ref={mangerIdRef}
                onChange={(e)=>{
                  let copy = examinee.managerId;
                  copy = e.target.value;
                  setExaminee({...examinee, managerId: copy});
                }}
                >
                  <option value="">담당자명</option>
                  {managers.map((item)=>(
                    <option value={item.clinicianId} key={item.clinicianId}>
                        {item.clinicianName}
                    </option>
                  ))}
                </select>
                <FontAwesomeIcon className='measure-admin-chevronDown' icon={faChevronDown} style={{color: "#4b75d6",}} />
              </div> */}
              <div className="info-input-container">
                <label htmlFor="">검사 종류</label>
                <div className="radio-container">
                  <div className='radioBtn measure-radio' >
                    <input ref={FVCTypeRef}  onClick={(e)=>{console.log(e.target.value        );type(e.target.value)}}
                    value="FVC" type="radio" name="type" id="fvc"/>
                    <label htmlFor="fvc">FVC</label>
                  </div>
                  <div className='radioBtn measure-radio'>
                    <input ref={SVCTypeRef} onClick={(e)=>{type(e.target.value)}}
                    value="SVC" type="radio" name="type" id="svc" />
                    <label htmlFor="svc">SVC</label>
                  </div>
                </div>
              </div>
              <div className="info-input-container">
                <label htmlFor="">약물 적용 여부</label>
                <div className="radio-container">
                  <div className='radioBtn measure-radio' >
                    <input ref={mediTrueRef} onClick={(e)=>{administration(e.target.value)}}
                    value="true" type="radio" name="medi" id="mediTrue"/>
                    <label htmlFor="mediTrue">예</label>
                  </div>
                  <div className='radioBtn measure-radio'>
                    <input ref={mediFalseRef} onClick={(e)=>{administration(e.target.value)}}
                    value="false" type="radio" name="medi" id="mediFalse" />
                    <label htmlFor="mediFalse">아니오</label>
                  </div>
                </div>
              </div>
              <div ref={addBtnRef} className="measure-btn" onClick={()=>{
                if(!addBtnRef.current.classList.contains("disabled")){
                  navigatorR("/measurement",{state:{info}});
      
                }

                }}>검사하기</div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
export default MeasureInfo;