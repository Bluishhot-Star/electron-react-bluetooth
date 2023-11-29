import { useState, useRef, useEffect} from 'react';
import axios from 'axios';
import { Cookies, useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom'
import Alert from "../components/Alerts.js"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronDown } from '@fortawesome/free-solid-svg-icons'

const GainPage = () =>{
  const [gainInfo, setGainInfo] = useState({
    temperature : "",
	  humidity : "",
    atm:""
  });
  
  const chBtn = useRef();
  const cookies = new Cookies();
  let navigator = useNavigate();
  
  useEffect(()=>{
    if(gainInfo.temperature !=="" && gainInfo.humidity !=="" && gainInfo.atm !== ""){
        chBtn.current.disabled =false;
    }else{
        chBtn.current.disabled = true;
    }
  },[gainInfo])
  
  const GainMeasurement = () =>{
    console.log("aa")
    navigator("./gainMeasurementPage",{state:gainInfo})
  }
  return(
    <div className="gain-info-page-container">
      <div className="gain-info-page-nav">  
        <div className='backBtn' onClick={()=>{navigator(-1)}}>
          <FontAwesomeIcon icon={faChevronLeft} style={{color: "#4b75d6",}} />
        </div>
        <p>보정 정보</p>
      </div>
        <div className="gain-info-list-container">
            <div className='gain-field'>
              <label htmlFor="temperature"> 
                온도
              </label>
              <input
                type="number" name='temperature'
                onChange={(e)=>{setGainInfo({...gainInfo,temperature : e.target.value})}}
              />
            </div>

            <div className='gain-field'>
              <label htmlFor="humidity">
                습도
              </label>
              <input
                type="number"  name='humidity'
                onChange={(e)=>{setGainInfo({...gainInfo,humidity:e.target.value})}}
              />
            </div>
          <div className='gain-field'>
            <label htmlFor="atm">
              기압
            </label>
            <input
              type="numbe" name='atm'
              onChange={(e)=>{setGainInfo({...gainInfo,atm:e.target.value})}}
            />
          </div>
        <button ref={chBtn} className ='chBtn' onClick={GainMeasurement}>보정 하기</button>
      </div>
    </div>
  );
}

export default GainPage;