import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Cookies, useCookies } from 'react-cookie';
import { Routes, Route, Link, useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faSearch, faCalendar, faChevronRight } from '@fortawesome/free-solid-svg-icons'

import DateSelector from './DateSelector.js'

const MemberList = ()=>{
  const [examinees, setExaminees] = useState([]);
  const [date, setDate] = useState([]);
  const [examinee, setExaminee] = useState("");
  const [birth, setBirth] = useState("");
  const cookies = new Cookies();
  let navigator = useNavigate();

  useEffect(()=>{
    axios.get("/examinees?name=" , {
      headers: {
        Authorization: `Bearer ${cookies.get('accessToken')}`
      }}).then((res)=>{
        setExaminees(res.data.response);
      }).catch((err)=>{
        console.log(err);
      })
  },[])

  const [clicked, setClicked] = useState("");
  useEffect(()=>{
    if(clicked == false){return}
    let temp = document.getElementById(clicked);
    console.log(temp);
    temp.classList.add("memberList-selected");
  },[clicked])
  const removeCSS=(e)=>{
    let temp = document.getElementById(clicked);
    temp.classList.remove("memberList-selected")
  }
  const click = (index,exId, birth) =>{
    setCurtainStat(false)
    if(clicked !== ""){removeCSS();}
    setClicked("memberItem"+index);
    setBirth(birth);
    console.log(birth);

    axios.get(`/examinees/${exId}/measurements/date?from=&to=` , {
      headers: {
        Authorization: `Bearer ${cookies.get('accessToken')}`
      }
    }).then((res)=>{
      setDate(res.data.response);
      setExaminee(exId);
    }).catch((err)=>{
      console.log(err);
    })
  }

  const report = (date)=>{
    axios.get(`/examinees/${examinee}` , {
      headers: {
        Authorization: `Bearer ${cookies.get('accessToken')}`
      }
    }).then((res)=>{
      console.log(res.data.response);
      let data = res.data.response;
      data["date"] = date;
      navigator('/memberList/resultPage', {state: data})
    }).catch((err)=>{
      console.log(err);
    })
  }

  const [curtainStat, setCurtainStat] = useState(true);

  // 검색 기능
  const [searchVal, setSearchVal] = useState("")
  const searchName = ()=>{
    axios.get(`/examinees?name=${searchVal}` , {
      headers: {
        Authorization: `Bearer ${cookies.get('accessToken')}`
      }})
      .then((res)=>{
        setExaminees(res.data.response);
      }).catch((err)=>{
        console.log(err);
      })
  }


  //기간 설정 기능
  const [inspectionDate, setInspectionDate] = useState({
    start : "",
    end : ""
  });

  useEffect(()=>{
    if(examinee==="")return;
    axios.get(`/examinees/${examinee}/measurements/date?from=${inspectionDate.start}&to=${inspectionDate.end}` , {
      headers: {
        Authorization: `Bearer ${cookies.get('accessToken')}`
      }}).then((res)=>{
        setDate(res.data.response);
      }).catch((err)=>{
        console.log(err);
      })
  },[examinee,inspectionDate])


const dateSelect = (select) =>{
    console.log(select);
    setInspectionDate(select);
}

const [dateSelectorStat, setDateSelectorStat] = useState(false);



  return (
      <div className="memberList-page-container">
        {dateSelectorStat ? <DateSelector data={inspectionDate} onOff={setDateSelectorStat} select={dateSelect}/> : null}
        <div className="memberList-page-nav">
          <p>환자 선택</p>
        </div>
        <div className="memberList-page-left-container">
          <div className="patient-list-container">
            <div className="add-patient-btn-container">
              <div className="add-patient-btn" onClick={()=>{navigator("./addPatient")}}>
                + 환자 추가
              </div>
            </div>
            <div className="search-patient-container">
              <FontAwesomeIcon className='searchIcon' icon={faSearch} style={{color: "#4b75d6",}} />
              <form 
                onSubmit={(e)=>{
                e.preventDefault(); // 전체 리렌더링 방지
                searchName();}}>
              <input type="text" placeholder='환자 이름을 입력해주세요.'
                onChange={(e)=>{setSearchVal(e.target.value);}}/>
              </form>
            </div>
            <div className="patient-list">
              <div className="patient-list-column">
                <div className="patient-list-column-name">차트넘버</div>
                <div className="patient-list-column-name">환자 이름</div>
                <div className="patient-list-column-name">성별</div>
                <div className="patient-list-column-name">생년월일</div>
              </div>
              <div className="patient-item-container">
                {
                  examinees.map((item, index)=>{
                    return(
                    <div id={"memberItem"+index} className="patient-item" key={item.chartNumber} onClick={(e)=>{click(index,item.id,item.birthday);}}>
                      <div className="patient-item-chartNumber"><p>{item.chartNumber}</p></div>
                      <div className="patient-item-name"><p>{item.name}</p></div>
                      <div className="patient-item-gender"><p>{item.gender == "MALE" ? "남자" : "여자"}</p></div>
                      <div className="patient-item-birthday"><p>{item.birthday}</p></div>
                    </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>
        <div className="memberList-page-right-container">
          {
            curtainStat ?  <div className="curtain"><p>환자를 먼저 선택해주세요.</p></div> : null
          }
          <div className="patient-personal-container">
            <div className="measure-btn-container">
              <div onClick={()=>{navigator("./measureSetting")}} className="measure-btn">검사하기</div>
            </div>
            <div className="measure-date-container">
              <div className="measure-selected-date-container">
                <div>검사 이력</div>
                <div className='measure-selected-date'>
                  <div className="measure-selected-date-start">{inspectionDate.start ? inspectionDate.start : "0000-00-00"}</div>
                  <div>~</div>
                  <div className="measure-selected-date-end">{inspectionDate.end ? inspectionDate.end : "0000-00-00"}</div>
                </div>
              </div>
              <div className="measure-select-date-btn-container" onClick={()=>{
                  setDateSelectorStat(!dateSelectorStat)
                }}>
              <FontAwesomeIcon className='calenderIcon' icon={faCalendar} style={{color: "#4b75d6",}} />
                <div className="measure-select-date-btn">기간선택</div>
              </div>
            </div>
            <div className="measure-list">
              <div className="measure-item-container">
                {date.map((item, index)=>(
                  // <Link key={item} to={`/ss/${examinee}/${item}`}>
                  <div key={item} className="measure-item" onClick={()=>{report(item);}}>
                    <div>검사일시</div>
                    <div className='measure-item-date'>{item}</div>
                    <div className="measure-item-right-chevron">
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
export default MemberList;

