import { useState, useRef, useEffect} from 'react';
import axios from 'axios';
import {Cookies, useCookies } from 'react-cookie';

import { Routes, Route, Link, useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronDown } from '@fortawesome/free-solid-svg-icons'
const MeasureSetting = ()=>{
  const submitMSetting = ()=>{
    
  }
  const cookies = new Cookies();

  // 숫자Input 강제성
  const numberInput = (target)=>{
    target.value = target.value.replace(/[^0.0-9.0]/g, '');
  }
  // 각종 useRef
  // const mangerIdRef = useRef();
  const FVCTypeRef = useRef();
  const SVCTypeRef = useRef();
  const mediTrueRef = useRef();
  const mediFalseRef = useRef();
  // const mediTypeRef = useRef();
  // const mediToolsRef = useRef();
  // const mediAmountRef = useRef();
  // const mediCountRef = useRef();

  // medication 상황별 버튼 활성화
  // useEffect(()=>{
  //   if(examinee.smoke.experience === "false"){
  //     mediTrueRef.current.checked = false;
  //     mediFalseRef.current.checked = false;
  //     mediTrueRef.current.disabled = true;
  //     mediFalseRef.current.disabled = true;
  //     startAgeRef.current.disabled = true;
  //     amountRef.current.disabled = true;
  //     let copy = examinee.smoke;
  //     copy.medi = "";
  //     copy.startAge = "";
  //     copy.stopAge = "";
  //     copy.amountDay = "";
  //     setExaminee({...examinee, smoke: copy});
  //   }
  //   else{
  //     mediTrueRef.current.disabled = false;
  //     mediFalseRef.current.disabled = false;
  //     startAgeRef.current.disabled = false;
  //     amountRef.current.disabled = false;
  //   }
  // },[examinee.smoke.experience])
  // useEffect(()=>{
  //   if(examinee.smoke.medi === "false"){
  //     stopAgeRef.current.disabled = false;
  //   }
  //   else{
  //     stopAgeRef.current.disabled = true;
  //     let copy = examinee.smoke;
  //     copy.stopAge = "";
  //     setExaminee({...examinee, smoke: copy});
  //   }
  // },[examinee.smoke.medi])

  // 담당자 명 기본값 css
  // useEffect(()=>{
  //   if(examinee.managerId === ""){
  //     mangerIdRef.current.classList.add("unselect")
  //   }
  //   else{
  //     mangerIdRef.current.classList.remove("unselect")
  //   }
  // },[examinee.managerId])

  // 추가 완료 버튼 상태
  const addBtnRef = useRef();
  const [addBtnStatus, setAddBtnStatus] = useState(false);
  
  // 추가 완료 버튼 유효성 검사
  // useEffect(()=>{
  //   if(!(examinee.managerId!==""&&examinee.chartNumber!==""&&examinee.name!==""&&examinee.birthday!==""
  //   &&examinee.gender!==""&&examinee.info.height!==""&&examinee.info.weight&&examinee.smoke.experience!=="")){
  //     console.log("ch1");
  //     setAddBtnStatus(false);
  //     return;
  //   }
  //   if(!validity){
  //     setAddBtnStatus(false);
  //     return;
  //   }
  //   if(examinee.smoke.experience === "true"){
  //     if(!(examinee.smoke.medi !== ""&&examinee.smoke.amountDay !== ""&&examinee.smoke.startAge !== "")){
  //       console.log("ch2");
  //       setAddBtnStatus(false);
  //       return;
  //     }
  //     if(examinee.smoke.medi === "false"){
  //       if(!(examinee.smoke.stopAge !== "")){
  //         console.log("ch3");
  //         setAddBtnStatus(false);
  //         return;
  //       }
  //     }
  //   }
  //   setAddBtnStatus(true);
  // })

  // 추가 완료 버튼 css
  // useEffect(()=>{
  //   if(addBtnStatus === true){
  //     addBtnRef.current.disabled = false;
  //   }
  //   else{
  //     addBtnRef.current.disabled = true;
  //   }
  // },[addBtnStatus])

  // useNavigate
  const navigator = useNavigate();

  return(
    <>
      <div className="measure-setting-page-container">
        <div className="measure-setting-page-nav">
          <div className='measure-setting-backBtn' onClick={()=>{navigator(-1)}}>
            <FontAwesomeIcon icon={faChevronLeft} style={{color: "#4b75d6",}} />
          </div>
          <p>검사 정보</p>
        </div>
        <div className="measure-setting-page-main-container">
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
                  <div className='radioBtn' >
                    <input ref={FVCTypeRef} 
                    // onChange={(e)=>{smokeChange(e,"experience")}} 
                    value="true" type="radio" name="experience" id="expTrue"/>
                    <label htmlFor="expTrue">FVC</label>
                  </div>
                  <div className='radioBtn'>
                    <input ref={SVCTypeRef} 
                    // onChange={(e)=>{smokeChange(e,"experience")}} 
                    value="false" type="radio" name="experience" id="expFalse" />
                    <label htmlFor="expFalse">SVC</label>
                  </div>
                </div>
              </div>
              <div className="info-input-container">
                <label htmlFor="">약물 적용 여부</label>
                <div className="radio-container">
                  <div className='radioBtn' >
                    <input ref={mediTrueRef} 
                    // onChange={(e)=>{smokeChange(e,"medi")}} 
                    value="true" type="radio" name="medi" id="mediTrue"/>
                    <label htmlFor="mediTrue">예</label>
                  </div>
                  <div className='radioBtn'>
                    <input ref={mediFalseRef} 
                    // onChange={(e)=>{smokeChange(e,"medi")}} 
                    value="false" type="radio" name="medi" id="mediFalse" />
                    <label htmlFor="mediFalse">아니오</label>
                  </div>
                </div>
              </div>
              {/* <div className="info-input-container">
                <label htmlFor="">적용 약물 종류</label>
                <select
                id='adminSelect'
                ref={mediTypeRef}
                // onChange={(e)=>{
                //   let copy = examinee.managerId;
                //   copy = e.target.value;
                //   setExaminee({...examinee, managerId: copy});
                // }}
                >
                  <option value="">약물 종류</option>
                  {medications.map((item)=>(
                    <option value={item.id} key={item.id}>
                        {item.name}
                    </option>
                  ))}
                </select>
                <FontAwesomeIcon className='measure-admin-chevronDown' icon={faChevronDown} style={{color: "#4b75d6",}} />
              </div> */}
              {/* <div className="info-input-container">
                <label htmlFor="">약물 투여 기구</label>
                <select
                id='adminSelect'
                ref={mediToolsRef}
                // onChange={(e)=>{
                //   let copy = examinee.managerId;
                //   copy = e.target.value;
                //   setExaminee({...examinee, managerId: copy});
                // }}
                >
                  <option value="">투여 기구</option>
                  {mediTools.map((item)=>(
                    <option value={item.id} key={item.id}>
                        {item.name}
                    </option>
                  ))}
                </select>
                <FontAwesomeIcon className='measure-admin-chevronDown' icon={faChevronDown} style={{color: "#4b75d6",}} />
              </div> */}
              
              {/* <div className="info-input-container">
                <label htmlFor="">적용 약물 양</label>
                <input ref={mediAmountRef} type="text" 
                // value={examinee.smoke.stopAge} 
                placeholder='0'
                onInput={(e)=>{numberInput(e.target)}}
                // onChange={(e)=>{
                //   let copy = examinee.smoke;
                //   copy.stopAge = e.target.value;
                //   setExaminee({...examinee, smoke: copy})
                // }}
                />
              </div> */}
              {/* <div className="info-input-container">
                <label htmlFor="">약물 적용 횟수</label>
                <input ref={mediCountRef} type="text" 
                // value={examinee.smoke.stopAge} 
                placeholder='0'
                onInput={(e)=>{numberInput(e.target)}}
                // onChange={(e)=>{
                //   let copy = examinee.smoke;
                //   copy.stopAge = e.target.value;
                //   setExaminee({...examinee, smoke: copy})
                // }}
                />
              </div> */}
              <button ref={addBtnRef} className="measure-btn"><p>검사하기</p></button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
export default MeasureSetting;