import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Cookies, useCookies } from 'react-cookie';
import { Routes, Route, Link, useNavigate, useLocation} from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft,faGear, faCog, faSearch, faCalendar, faChevronRight } from '@fortawesome/free-solid-svg-icons'


import DateSelector from './DateSelector.js'
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from "react-redux"
import { changeDeviceInfo } from "../deviceInfo.js"
const MemberListCopy = ()=>{
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

  // // 클릭한 subject css State
  // const [clicked, setClicked] = useState("");

  // // 클릭했을때 css 변화
  // useEffect(()=>{
  //   if(clicked == false){return}
  //   let temp = document.getElementById(clicked);
  //   console.log(temp);
  //   temp.classList.add("memberList-selected");
  // },[clicked])

  // const removeCSS=(e)=>{
  //   let temp = document.getElementById(clicked);
  //   temp.classList.remove("memberList-selected")
  // }

  const click = (index,chartNumber, birth) =>{
    setBirth(birth);
    console.log(birth);

    axios.get(`/subjects/${chartNumber}/histories` , {
      headers: {
        Authorization: `Bearer ${cookies.get('accessToken')}`
      }
    }).then((res)=>{
      report(res.data.response,chartNumber);
    }).catch((err)=>{
      console.log(err);
    })
  }
  const [goTO, setGoTO] = useState(false)
  // let data1, data2;
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const report = async(date,chartNum)=>{
    await axios.get(`/v3/subjects/${chartNum}/types/fvc/results/${date[0]}` , {
      headers: {
        Authorization: `Bearer ${cookies.get('accessToken')}`
      }
    }).then((res)=>{
      console.log(res);
      if(res.data.subCode === 2004){
        setData1(res.data.message);
      }
      else setData1(res.data.response);
    }).catch((err)=>{
      console.log(err);
    })
    await axios.get(`/subjects/${chartNum}/histories`
    , {
      headers: {
        Authorization: `Bearer ${cookies.get('accessToken')}`
    }}).then((res)=>{
      console.log(res.data.response);
      setDate(res.data.response);
    }).catch((err)=>{
      console.log(err);
    })
    await axios.get(`/v3/subjects/${chartNum}/types/svc/results/${date[0]}` , {
      headers: {
        Authorization: `Bearer ${cookies.get('accessToken')}`
      }
    }).then((res)=>{
      console.log(res);
      if(res.data.subCode === 2004){
        setData2(res.data.message);
      }
      else setData2(res.data.response);
    }).catch((err)=>{
      console.log(err);
    })
    

    setGoTO(true);
    // let time = setTimeout(()=>{
    //   setGoTO(true);
    // },1000)
  }
  useEffect(()=>{
    if(goTO){
      console.log(data1);
      console.log(data2);
      console.log(date)
      navigator('./resultPage', {state: {fvc:data1, svc:data2, date:date, birth:birth}});
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
  },[])
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
  // useEffect(()=>{console.log(searchVal)},[searchVal])
  const MemberListCopy = useCallback(async () => {
    setLoading(true)
    axios.get(`/subjects?page=${page}&size=10&name=${searchVal}`,{
      headers: {
        Authorization: `Bearer ${cookies.get('accessToken')}`
      }}).then((res)=>{
        if(res.data.subCode !== 2004){
          setExaminees([...examinees, ...res.data.response.subjects]);
          setPage((page) => page + 1);
        }
      }).catch((err)=>{
        console.log(err);
      });
    setLoading(false)
  },[page,searchVal])

  useEffect(()=>{
    MemberListCopy()
  },[examinees])

  // useEffect(() => {
  //   // 사용자가 마지막 요소를 보고 있고, 로딩 중이 아니라면
  //   if (inView && !loading) {
  //     console.log(page);
      
  //     setPage((page) => page + 1);
  //   }
  // }, [inView,loading])


  return (
      <div className="memberList-page-containerC">
        {dateSelectorStat ? <DateSelector data={inspectionDate} onOff={setDateSelectorStat} select={dateSelect}/> : null}
        <div className="memberList-page-navC">
          <p onClick={()=>{console.log(deviceInfo);
            // testIt()
            navigator('/memberList');
          }}>환자 선택</p>
          <div className='setting-btn-containerC' onClick={()=>{navigator("/setting")}}>
            <FontAwesomeIcon className='cogIconC' icon={faGear}/>
            <p className="setting-btnC" >설정</p>
          </div>
        </div>
        <div className="memberList-page-left-containerC">
          <div className="patient-list-containerC">
            <div className="add-patient-btn-containerC">
              <div className="add-patient-btnC" onClick={()=>{navigator("./addPatient", {state: {update:false}})}}>
                + 환자 추가
              </div>
            </div>
            <div className="search-patient-containerC">
              <FontAwesomeIcon className='searchIconC' icon={faSearch} style={{color: "#4b75d6",}} />
              <form 
                onSubmit={(e)=>{
                e.preventDefault(); // 전체 리렌더링 방지
                setExaminees([]);
                MemberListCopy();
                setPage(1)}}>
              <input type="text" placeholder='찾고자 하는 환자의 이름 또는 차트넘버를 입력해주세요.'
                onChange={(e)=>{setSearchVal(e.target.value); }}/>
              </form>
            </div>
            <div className="patient-listC">
              <div className="patient-list-columnC">
                <div className="patient-list-column-nameC">차트넘버</div>
                <div className="patient-list-column-nameC">환자 이름</div>
                <div className="patient-list-column-nameC">성별</div>
                <div className="patient-list-column-nameC">생년월일</div>
                <div className="patient-list-column-nameC"></div>
                <div className="patient-list-column-nameC"></div>
              </div>
              <div className="patient-item-containerC">
                {
                  examinees.map((item, index)=>{
                    return(
                    <div id={"memberItem"+index} className="patient-itemC" key={index}>
                      <div className="patient-item-chartNumberC"><p>{item.chartNumber}</p></div>
                      <div className="patient-item-nameC"><p>{item.name}</p></div>
                      <div className="patient-item-genderC"><p>{item.gender == "m" ? "남자" : "여자"}</p></div>
                      <div className="patient-item-birthdayC"><p>{item.birthday}</p></div>
                      <div className="btn" onClick={(e)=>{e.preventDefault(); navigator("./addPatient", {state: {chartNumber:item.chartNumber,update:true}})}}>
                        <input type='button' id='measurmentBtn' className='measurmentBtn'/>
                        <label htmlFor='measurmentBtn'>검사하기</label>
                      </div>
                      <div className="btn" onClick={(e)=>{
                          e.preventDefault();
                          console.log(e.target);
                          console.log(item.chartNumber); 
                          click(index,item.chartNumber,item.birthday);}}>
                        <input type='button' id={"resultBtn" + index} className='resultBtn'/>
                        <label htmlFor='resultBtn'>결과보기</label>
                      </div>
                    </div>
                    )
                  })
                  //아래 요소가 마지막(무한로딩 트리거)
                }
                <div className='patient-loadingC' ref={ref}></div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
  );
}
export default MemberListCopy;