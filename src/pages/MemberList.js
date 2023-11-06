import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Cookies, useCookies } from 'react-cookie';
import { Routes, Route, Link, useNavigate, useLocation} from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft,faGear, faCog, faSearch, faCalendar, faChevronRight } from '@fortawesome/free-solid-svg-icons'


import DateSelector from './DateSelector.js'
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from "react-redux"
import { changeDeviceInfo } from "./../deviceInfo.js"
const MemberList = ()=>{
  let deviceInfo = useSelector((state) => state.deviceInfo ) 
  const [examinees, setExaminees] = useState([]);
  const [date, setDate] = useState([]);
  const [chartNumber, setChartNumber] = useState("");
  const [birth, setBirth] = useState("");
  const [loading, setLoading] = useState(false)
  const cookies = new Cookies();
  let location = useLocation();
  let navigator = useNavigate();

  


  //페이지 스크롤시 /subjects?page=1&size=10에서 page가 변경되어야 함
  // useEffect(()=>{
  //   axios.get("/subjects?page=1&size=10" , {
  //     headers: {
  //       Authorization: `Bearer ${cookies.get('accessToken')}`
  //     }}).then((res)=>{
  //       setExaminees(res.data.response.subjects);
  //       console.log(res.data.response)
  //     }).catch((err)=>{
  //       console.log(err);
  //     })
  // },[])

  // 클릭한 subject css State
  const [clicked, setClicked] = useState("");

  // 클릭했을때 css 변화
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

  const click = (index,chartNumber, birth) =>{
    setCurtainStat(false) // 환자 선택 문구 삭제
    if(clicked !== ""){removeCSS();}//햔재 클릭된 요소css 제거
    setClicked("memberItem"+index);
    setBirth(birth);
    console.log(birth);

    axios.get(`/subjects/${chartNumber}/histories` , {
      headers: {
        Authorization: `Bearer ${cookies.get('accessToken')}`
      }
    }).then((res)=>{
      setDate(res.data.response);
      setChartNumber(chartNumber);
    }).catch((err)=>{
      console.log(err);
    })
  }
  useEffect(()=>{
    
  },[])
  const [goTO, setGoTO] = useState(false)
  // let data1, data2;
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const report = (date)=>{
    axios.get(`/subjects/${chartNumber}/types/fvc/results/${date}` , {
      headers: {
        Authorization: `Bearer ${cookies.get('accessToken')}`
      }
    }).then((res)=>{
      console.log(res);
      setData1(res.data.response);
      console.log(data1);
      
    }).catch((err)=>{
      console.log(err);
    })
    axios.get(`/subjects/${chartNumber}/types/svc/results/${date}` , {
      headers: {
        Authorization: `Bearer ${cookies.get('accessToken')}`
      }
    }).then((res)=>{
      console.log(res);
      setData2(res.data.response);
    }).catch((err)=>{
      console.log(err);
    })
    let time = setTimeout(()=>{
      setGoTO(true);
    },1000)
  }
  useEffect(()=>{
    if(goTO){
      console.log(data1);
      console.log(data2);
      navigator('/memberList/resultPage', {state: {fvc:data1, svc:data2, date:date, birth:birth}});
    }
    else{}
  },[goTO])

  const [curtainStat, setCurtainStat] = useState(true);

  // 검색 기능

  // const searchName = ()=>{
  //   axios.get(`/subjects?page=1&size=10&name=${searchVal}` , {
  //     headers: {
  //       Authorization: `Bearer ${cookies.get('accessToken')}`
  //     }})
  //     .then((res)=>{
  //       setExaminees(res.data.response.subjects);
  //     }).catch((err)=>{
  //       console.log(err);
  //     })
  // }
  

  //기간 설정 기능
  const [inspectionDate, setInspectionDate] = useState({
    start : "",
    end : ""
  });
//수정
  useEffect(()=>{
    if(chartNumber !== ""){
      axios.get(`/subjects/${chartNumber}/histories?from=${inspectionDate.start === "" ? "2000-01-01" : inspectionDate.start}&end=${inspectionDate.end === "" ? "2099-01-01" : inspectionDate.end}` , {
        headers: {
          Authorization: `Bearer ${cookies.get('accessToken')}`
        }}).then((res)=>{
          console.log(inspectionDate);
          setDate(res.data.response);
        }).catch((err)=>{
          console.log(err);
        })
    }
      
    
  },[inspectionDate])

  useEffect(()=>{
    console.log(date)
  })
  const dateSelect = (select) =>{
      console.log(select);
      setInspectionDate(select);
  }


  const [dateSelectorStat, setDateSelectorStat] = useState(false);

  const [ref, inView] = useInView();
  const [page, setPage] = useState(1); // 현재 페이지 번호 (페이지네이션)

  // 무한 스크롤
  // 지정한 타겟 div가 화면에 보일 때 마다 서버에 요청을 보냄
  // const productFetch = () => {
  //   axios.get(`/subjects?page=${page}&size=10` , {
  //     headers: {
  //       Authorization: `Bearer ${cookies.get('accessToken')}`
  //     }}).then((res)=>{
  //       if(res.data.message !== "OK"){return;}
  //       setExaminees([...examinees, ...res.data.response.subjects]);
  //       console.log(res.data.response)
  //       setPage((page) => page + 1)
  //     }).catch((err)=>{
  //       console.log(err);
  //     })
  // };
  // useEffect(()=>{
  //   console.log(page);
  // },[examinees])

  // useEffect(() => {
  //   // inView가 true 일때만 실행(마지막 요소 보이면 true)
  //   if (inView) {
  //     console.log(inView, '무한 스크롤 요청')
  //     let time = setTimeout(()=>{
  //       productFetch();
  //     },10)
  //     return()=>{
  //       clearTimeout(time);
  //     }
  //   }
  //   else{
  //     console.log(inView);
  //   }
  // },);
  const [searchVal, setSearchVal] = useState("")
  const MemberList = useCallback(async () => {
    setLoading(true)
    axios.get(`/subjects?page=${page}&size=10&name=${searchVal}`,{
      headers: {
        Authorization: `Bearer ${cookies.get('accessToken')}`
      }}).then((res)=>{
        console.log(res.data.response.clinicians);
        console.log(res.data.subCode);
        if(res.data.subCode !== 2004){
          setExaminees([...examinees, ...res.data.response.subjects]);
          setPage((page) => page + 1);
        }
      }).catch((err)=>{
        console.log(err);
      });
    setLoading(false)
  },[page])

  useEffect(()=>{
    MemberList()
  },[examinees])

  // useEffect(() => {
  //   // 사용자가 마지막 요소를 보고 있고, 로딩 중이 아니라면
  //   if (inView && !loading) {
  //     console.log(page);
      
  //     setPage((page) => page + 1);
  //   }
  // }, [inView,loading])


  return (
      <div className="memberList-page-container">
        {dateSelectorStat ? <DateSelector data={inspectionDate} onOff={setDateSelectorStat} select={dateSelect}/> : null}
        <div className="memberList-page-nav">
          <p onClick={()=>{console.log(deviceInfo);
            // testIt()
          }}>환자 선택</p>
          <span onClick={()=>{
            console.log(deviceInfo)
          }}>dfff</span>
          <span onClick={()=>{
            // console.log(result)
          }}>---jjkj</span>
          <div className='setting-btn-container' onClick={()=>{navigator("/setting")}}>
            <FontAwesomeIcon className='cogIcon' icon={faGear}/>
            <p className="setting-btn" >설정</p>
          </div>
        </div>
        <div className="memberList-page-left-container">
          <div className="patient-list-container">
            <div className="add-patient-btn-container">
              <div className="add-patient-btn" onClick={()=>{navigator("./addPatient", {state: {update:false}})}}>
                + 환자 추가
              </div>
            </div>
            <div className="search-patient-container">
              <FontAwesomeIcon className='searchIcon' icon={faSearch} style={{color: "#4b75d6",}} />
              <form 
                onSubmit={(e)=>{
                e.preventDefault(); // 전체 리렌더링 방지
                setExaminees([]);
                MemberList();
                setPage(1)}}>
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
                    <div id={"memberItem"+index} className="patient-item" key={item.chartNumber} onClick={(e)=>{click(index,item.chartNumber,item.birthday);}}>
                      <div className="patient-item-chartNumber"><p>{item.chartNumber}</p></div>
                      <div className="patient-item-name"><p>{item.name}</p></div>
                      <div className="patient-item-gender"><p>{item.gender == "m" ? "남자" : "여자"}</p></div>
                      <div className="patient-item-birthday"><p>{item.birthday}</p></div>
                    </div>
                    )
                  })
                  //아래 요소가 마지막(무한로딩 트리거)
                }
                <div className='patient-loading' ref={ref}></div>
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
              <div onClick={()=>{navigator("./measureInfo", {state: chartNumber})}} className="measure-btn">검사하기</div>
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