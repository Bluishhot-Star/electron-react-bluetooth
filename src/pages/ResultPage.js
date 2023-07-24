import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Cookies, useCookies } from 'react-cookie';
import { Routes, Route, Link, useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faSearch, faCalendar, faChevronRight } from '@fortawesome/free-solid-svg-icons'

import { useLocation } from 'react-router-dom';
function ResultPage(){

  const location = useLocation();
  const navigator = useNavigate();
  const state = location.state;
  const cookies = new Cookies();

  const [info, setInfo] = useState();

  useEffect(()=>{
    axios.get(`/examinees/${location.state.id}` , {
      headers: {
        Authorization: `Bearer ${cookies.get('accessToken')}`
      }
    }).then((res)=>{
      console.log(res.data.response)
      setInfo(res.data.response);
    }).catch((err)=>{
      console.log(err);
    })
  },[])

  const click = ()=>{
    console.log(location.state);
    console.log(state.info[0].content);
  }
  

  return(
    <div className="result-page-container">
        <div className="nav">
          <div className="nav-logo" onClick={()=>{click()}}>
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
              <button className="select-patient-btn" onClick={()=>{navigator(-1)}}>환자 선택</button>
              <button className="setting-btn">설정</button>
            </div>
          </div>
        </div>
        <div className="left-container">
          <div className="patient-info-container">
            <span>환자 정보</span>
            <div className="patient-info">
              <div className="title">이름</div>
              <div className="content">{state.info[0].content}</div>
              <div className="title">성별</div>
              <div className="content">{state.info[2].content=="MALE"?"남자":"여자"}</div>
              <div className="title">신장</div>
              <div className="content">{state.info[3].content}cm</div>
              <div className="title">몸무게</div>
              <div className="content">{state.info[4].content}kg</div>
              <div className="title">생년월일</div>
              <div className="content">{state.birth}</div>
              <div className="title">연간 흡연량</div>
              <div className="content">{state.info[16].content == 0 ? "-":state.info[16].content}</div>
              <div className="title">흡연 여부</div>
              <div className="content">{state.info[12].content === "FALSE" ? "아니오" : "예"}</div>
              <div className="title">흡연 기간</div>
              <div className="content">{state.info[15].content-state.info[14].content === 0 ? "-" : state.info[15].content-state.info[14].content+1}</div>
              {/* <div className="space"></div> */}
            </div>
            <button>환자정보 수정</button>
            {/* <div className="button-container"></div> */}
          </div>
        </div>
        <div className="right-container">
          <div className="button-container">
            <div className="two-btn-container">
              <button onClick={()=>{}} id="clickme" className="FVC-btn">FVC</button>
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
export default ResultPage;