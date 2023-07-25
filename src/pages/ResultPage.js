import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Cookies, useCookies } from 'react-cookie';
import { Routes, Route, Link, useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faSearch, faCalendar, faChevronRight } from '@fortawesome/free-solid-svg-icons'

import {
  registerables,
  Chart as ChartJS,
  RadialLinearScale,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { useLocation } from 'react-router-dom';
function ResultPage(){
  ChartJS.register(RadialLinearScale, LineElement, Tooltip, Legend, ...registerables);
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
  
  const update = ()=>{
    let patientDate = location.state;
    patientDate['update'] = true;
    navigator('/memberList/addPatient', {state: patientDate})
  }

  //결과 그래프 목록 요청 FVC,SVC
  const[volumeFlow,setVolumeFlow] = useState([]);
  const[timeVolume,setTimeVolume] = useState([]);
  const[svcGraph,setSvcGraph] = useState([]);

  const [simpleResult,setSimpleResult] = useState([]);
  useEffect(()=>{
    axios.get(`/examinees/${location.state.id}/measurements/simple-result?type=FVC&date=${location.state.date}`,{
      headers: {
        Authorization: `Bearer ${cookies.get('accessToken')}`
      }}).then((res)=>{
        setSimpleResult(res.data.response);
      }).catch((err)=>{
        console.log(err);
      })
  },[])

  useEffect(()=>{
    //volume-flow
    axios.get(`/examinees/${location.state.id}/measurements/graph?graph-type=volume-flow&date=${location.state.date}&type=FVC`,{
      headers: {
        Authorization: `Bearer ${cookies.get('accessToken')}`
      }}).then((res)=>{
        setVolumeFlow(res.data.response);
        console.log(res.data.response);
      }).catch((err)=>{
        console.log(err);
      })

    //time-volume
    axios.get(`/examinees/${location.state.id}/measurements/graph?graph-type=time-volume&date=${location.state.date}&type=FVC`,{
      headers: {
        Authorization:`Bearer ${cookies.get('accessToken')}`
      }})
      .then((res)=>{
        setTimeVolume(res.data.response);
      })
      .catch((err)=>{
        console.log(err);
      })
    
    //SVC time-volume
    axios.get(`/examinees/${location.state.id}/measurements/graph?graph-type=time-volume&date=${location.state.date}&type=SVC`,{
      headers: {
        Authorization: `Bearer ${cookies.get('accessToken')}`
    }})
    .then((res)=>{
      setSvcGraph(res.data.response);
    })
    .catch((err)=>{
      console.log(err);
    })
  },[])

  const selectGraph=(mId)=>{
  // volumeFlow.filter((volume)=>volume.measurementId === mId).map((item)=>(
  //   console.log(item)
  // ))
  // timeVolume.filter((time)=>time.measurementId === mId).map((item)=>(
  //   console.log(item)
  // ))
  // svcGraph.filter((time)=>time.measurementId === mId).map((item)=>(
  //   console.log(item)
  // ))
  }


  const [graphData, setGraphData] = useState({
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: "WEEEK",
      data: [
        {x: 0.030999999999999996, y: 0.23858681948280724},
        {x: 0.030999999999999996, y: 0.23858681948280724},
        {x: 0.030999999999999996, y: 0.23858681948280724}],
      borderColor: 'rgb(255,255,255)',
      showLine: true,
      tension: 0.4
    },]
  })
  const graphOption={
    plugins:{
      legend: {
          display: false
      },
    },
    responsive: false,
    interaction: false,
    elements: {
      point: {
        radius: 0,
      },
    },
    scales: {
      x: {
        axios: 'x',
        ticks:{
          max: 0.0,
          min: 12.0,
          stepSize : 1
        }
      },
      y: {
        axios: 'y',
        max: 16.8,
        min: -9.6,
        ticks: {
          beginAtZero: true,
          stepSize : 2.1,
          fontSize : 10,
          textStrokeColor: 10,
          precision: 2,
        },
      },
    },
    title: {

    }
  }
  useEffect(()=>{
    let time = setTimeout(()=>{
      console.log("!#!##")
      let temp  = [];
      volumeFlow.forEach(item => {
        temp.push(item.graph);
      })
      console.log(temp);
      let dataset = []

      temp.forEach((item,index)=>{
        dataset.push(
          {
            label: "WEEEK",
            data: item,
            borderColor: `rgb(${0*(index+5)},${30*(index+1)},${70*(index+3)})`,
            borderWidth: 2,
            showLine: true,
            tension: 0.4
          }
        )
      })
      let data = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: dataset,
        
      }
      setGraphData(data);
    })
    return()=>{
      clearTimeout(time);
    }
  },[])

  const graphStyle = {width:"100%" ,height:"80%"}





  return(
    <div className="result-page-container">
        <div className="nav">
          <div className="nav-logo" onClick={()=>{console.log(graphData)}}>
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
              <div className="content">{state.name}</div>
              <div className="title">성별</div>
              <div className="content">{state.gender=="MALE"?"남자":"여자"}</div>
              <div className="title">신장</div>
              <div className="content">{state.inform.height}cm</div>
              <div className="title">몸무게</div>
              <div className="content">{state.inform.weight}kg</div>
              <div className="title">생년월일</div>
              <div className="content">{state.birthday}</div>
              <div className="title">연간 흡연량</div>
              <div className="content">{state.smoke.packYear == 0 ? "-":state.smoke.packYear}</div>
              <div className="title">흡연 여부</div>
              <div className="content">{state.smoke.smoking === "false"||state.smoke.smoking === false ? "아니오" : "예"}</div>
              <div className="title">흡연 기간</div>
              <div className="content">{state.smoke.period === 0 ? "-" : state.smoke.period}</div>
              {/* <div className="space"></div> */}
            </div>
            <button onClick={update}>환자정보 수정</button>
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
            <div className="graph">
              {graphData?<Scatter style={graphStyle} data={graphData} options={graphOption}/>:<p>Hello</p>}
            </div>
            <div className="graph">
            {graphData?<Scatter style={graphStyle} data={graphData} options={graphOption}/>:<p>Hello</p>}
            </div>
          </div>
          <div className="history-container">
            <div className="slider">
              {
              simpleResult.map((item)=>(
              <div key={item.measurementId} onClick={()=>selectGraph(item.measurementId)}>
                {item.medicationState}
                검사 일시({item.date})
                <table border={1}>
                  <tr>
                    <td></td>
                    <td>meas</td>
                    <td>pred</td>
                    <td>percent</td>
                  </tr>
                  {item.results.map((result)=>(
                  <tr>
                    <td>{result.title}</td>
                    <td>{result.meas}</td>
                    <td>{result.pred}</td>
                    <td>{result.per}</td>
                  </tr>
                  ))}
                </table>
                </div>

            ))}
            </div>
          </div>
        </div>
      </div>
  );
}
export default ResultPage;