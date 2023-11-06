import { useState, useRef, useEffect} from 'react';
import axios from 'axios';
import {Cookies, useCookies } from 'react-cookie';

import { Routes, Route, Link, useNavigate,useLocation } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronDown } from '@fortawesome/free-solid-svg-icons'
const MeasureInfo = ()=>{
  const submitMInfo = ()=>{
    
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


  // 추가 완료 버튼 상태
  const addBtnRef = useRef();
  const [addBtnStatus, setAddBtnStatus] = useState(false);
  
  // useNavigate
  const navigatorR = useNavigate();
  const location = useLocation();
  const state = location.state;





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
              <button ref={addBtnRef} className="measure-btn" onClick={()=>{navigatorR("/measurement")}}><p>검사하기</p></button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
export default MeasureInfo;