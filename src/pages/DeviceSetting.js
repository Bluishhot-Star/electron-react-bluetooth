import { useState, useRef, useEffect} from 'react';
import axios from 'axios';
import { Cookies, useCookies } from 'react-cookie';
import Alert from "../components/Alerts.js"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft,faGear, faCog, faSearch, faCalendar, faChevronRight } from '@fortawesome/free-solid-svg-icons'

import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import DateSelector from './DateSelector.js'
import { useInView } from 'react-intersection-observer';
const DeviceSetting= () =>{
    
  const cookies = new Cookies();
  const [deviceList,setDeviceList] = useState([]);
  const [calibrations,setCalibrations] = useState([]);
  const [chartNumber, setChartNumber] = useState("");
  const [curtainStat,setCurtainStat] = useState(true);
  const [dateSelectorStat, setDateSelectorStat] = useState(false);
  const [inspectionDate, setInspectionDate] = useState({
    start : "",
    end : ""
  });

  let navigator = useNavigate();

  useEffect(()=>{
    axios.get(`/devices?sort=serialNumber&order=desc`,{
      headers: {
        Authorization: `Bearer ${cookies.get('accessToken')}`
      }}).then((res)=>{
        // console.log(res.data.response);
        if(res.subCode !== 2004){
          setDeviceList(res.data.response);
        }
      }).catch((err)=>{
        console.log(err);
      });
  },[])

  const click = (deviceNum) =>{
    axios.get(`/devices/${deviceNum}/calibrations`,{
      headers: {
        Authorization: `Bearer ${cookies.get('accessToken')}`
      }}).then((res)=>{
        console.log(res.data.response);
        setCurtainStat(false)
        setCalibrations(res.data.response);
        setChartNumber(deviceNum);
      }).catch((err)=>{
        console.log(err);
      });
  }

  useEffect(()=>{
    if(chartNumber !== ""){
      axios.get(`/devices/${chartNumber}/calibrations?from=${inspectionDate.start === "" ? "2000-01-01" : inspectionDate.start}&to=${inspectionDate.end === "" ? "2099-01-01" : inspectionDate.end}`,{
        headers: {
          Authorization: `Bearer ${cookies.get('accessToken')}`
        }}).then((res)=>{
          console.log(res.data.response);
          setCurtainStat(false)
          setCalibrations(res.data.response);
        }).catch((err)=>{
          console.log(err);
        });
    }
    
  },[inspectionDate]);

  const dateSelect = (select) =>{
    console.log(select);
    setInspectionDate(select);
}


  return(
    <div className="deviceList-page-container">
      {dateSelectorStat ? <DateSelector data={inspectionDate} onOff={setDateSelectorStat} select={dateSelect}/> : null}
      <div className='deviceList-page-nav'>
        <div className='backBtn' onClick={()=>{navigator(-1)}}>
          <FontAwesomeIcon icon={faChevronLeft} style={{color: "#4b75d6",}} />
        </div>
        <p>디바이스 관리</p>
      </div>

      <div className='deviceList-page-left-container'>
        <div className='device-list-container'>
          <div className="add-device-btn-container">
            <div>
              디바이스 목록
            </div>
            <div className="add-device-btn">
              제조번호 재설정
            </div>
          </div>
          <div className='device-list'> 
            <div className='device-list-column'>
              <div className='device-list-column-name'>제조번호</div>
              <div className='device-list-column-name'>보정 횟수</div>
            </div>
            <div className='device-item-container' >
              {
                deviceList.map((item,index)=>{
                  return(
                    <div id={"deviceItem"+index} className='device-item' key={item.serialNumber} onClick={(e)=>click(item.serialNumber)}>
                      <div className='device-item-serialNumber'><p>{item.serialNumber}</p></div>
                      <div className='device-item-calibrationCount'><p>{item.calibrationCount}</p></div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
      
      <div className='deviceList-page-right-container'>
        {
          curtainStat ? <div className='curtain'></div> : null
        }
        <div className='device-personal-container'>
          <div className="calibration-date-container">
            <div className="calibration-selected-date-container">
              <div>보정 이력</div>
              <div className='calibration-selected-date'>
                <div className="calibration-selected-date-start">{inspectionDate.start ? inspectionDate.start : "0000-00-00"}</div>
                <div>~</div>
                <div className="calibration-selected-date-end">{inspectionDate.end ? inspectionDate.end : "0000-00-00"}</div>
              </div>
            </div>
            <div className="calibration-select-date-btn-container" onClick={()=>{
                  setDateSelectorStat(!dateSelectorStat)
                }}>
              <FontAwesomeIcon className='calenderIcon' icon={faCalendar} style={{color: "#4b75d6",}} />
              <div className="calibration-select-date-btn">기간선택</div>
            </div>
          </div>
          <div className="calibration-list">
              <div className="calibration-item-container">
                {calibrations.map((item, index)=>(
                  // <Link key={item} to={`/ss/${examinee}/${item}`}>
                  <div key={index} className="calibration-item" >
                    <div>보정 일시</div>
                    <div className='calibration-item-date'>{item.date}</div>
                    <div className="calibration-item-right-chevron">
                      <FontAwesomeIcon icon={faChevronRight} style={{color: "#4b75d6",}} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </div>
      

    </div>
  );
}

export default DeviceSetting;