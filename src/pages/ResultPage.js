import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Cookies, useCookies } from 'react-cookie';
import { Routes, Route, Link, useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faSearch, faCalendar, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { debounce } from 'lodash'
import {registerables,Chart as ChartJS,RadialLinearScale,LineElement,Tooltip,Legend,} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { useLocation } from 'react-router-dom';


function ResultPage(){
  ChartJS.register(RadialLinearScale, LineElement, Tooltip, Legend, ...registerables);
  const location = useLocation();
  const navigator = useNavigate();
  const state = location.state;
  const cookies = new Cookies();

  const [info, setInfo] = useState();
  const [tvMax, setTvMax] = useState([10]);


  let diagnosis, trials;
  let timeVolumeList = [];
  let volumeFlowList = [];
  let timeVolumeMaxList = [];
  let colorList = ['rgb(5,128,190)','rgb(158,178,243)','rgb(83,126,232)','rgb(67,185,162)','rgb(106,219,182)','rgb(255,189,145)','rgb(255,130,130)','rgb(236,144,236)'];
  useEffect(()=>{
    console.log(1);
    diagnosis = location.state.diagnosis;
    trials = location.state.trials;
    if(trials){
      // 매 결과에서 데이터 추출
      trials.forEach((item)=>{
        timeVolumeList.push(item.graph.timeVolume);
        volumeFlowList.push(item.graph.volumeFlow);
        //현 timeVolume에서 최대값 찾기
        timeVolumeMaxList.push(item.results[3].meas);
        console.log(timeVolumeMaxList);
      })
      setVolumeFlow(volumeFlowList);
      setTimeVolume(timeVolumeList);
      setTvMax(timeVolumeMaxList);
      graphOption.scales.x.max = parseInt(Math.max(...timeVolumeMaxList));
    }
  },[])





  const click = ()=>{
    console.log(location.state);
    console.log(state.info[0].content);
  }
  
  const updateData = ()=>{
    let patientDate = location.state;
    patientDate['update'] = true;
    navigator('/memberList/addPatient', {state: patientDate})
  }

  //결과 그래프 목록 요청 FVC,SVC
  const[volumeFlow,setVolumeFlow] = useState([]);
  const[timeVolume,setTimeVolume] = useState([]);
  const[svcGraph,setSvcGraph] = useState([]);

  const [simpleResult,setSimpleResult] = useState([]);



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
      label: "",
      data: [
        {x: 0.030999999999999996, y: 0.23858681948280723},
        {x: 0.030999999999999996, y: 0.23858681948280724},
        {x: 0.030999999999999996, y: 0.23858681948280724}],
      borderColor: 'rgb(255,255,255)',
      showLine: true,
      tension: 0.4
    },]
  })
  const [graphData2, setGraphData2] = useState({
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: "",
      data: [
        {x: 0.030999999999999996, y: 0.23858681948280723},
        {x: 0.030999999999999996, y: 0.23858681948280724},
        {x: 0.030999999999999996, y: 0.23858681948280724}],
      borderColor: 'rgb(255,255,255)',
      showLine: true,
      tension: 0.4
    },]
  })

  // window.addEventListener('beforeprint', () => {
  //   chartRef.current.resize(600, 600);
  // });
  // window.addEventListener('afterprint', () => {
  //   chartRef.current.resize();
  // });

  const graphOption={
    plugins:{
      legend: {
          display: false
      },
      resizeDelay:0,
    },
    responsive: true,
    animation:{
      // duration:0
    },
    maintainAspectRatio: false,
    interaction: false, 
    elements: {
      point: {
        radius: 0,
      },
    },
    scales: {
      x: {
        axios: 'x',
        min: 0,
        max: parseFloat(Math.max(...tvMax)),
        // suggestedMax: 6.0,
        ticks:{
          autoSkip: false,
          // stepSize : 0.1,
          // precision : 0.1,
          beginAtZero: false,
          max: 12.0,
        }
      },
      y: {
        gridLines:{
          zeroLineColor:'rgb(0, 0, 255)',
        },
        axios: 'y',
        // min: -9,
        // suggestedMax:12,
        // suggestedMin:-6,
        ticks: {
          major: true,
          beginAtZero: true,
          stepSize : 1,
          fontSize : 10,
          textStrokeColor: 10,
          precision: 1,
        },
      },
    },
  }

  const graphOption2={
    plugins:{
      legend: {
          display: false
      },
      resizeDelay:0,
    },
    responsive: true,
    animation:{
      // duration:0
    },
    maintainAspectRatio: false,
    interaction: false, 
    elements: {
      point: {
        radius: 0,
      },
    },
    scales: {
      x: {
        axios: 'x',
        min: 0,
        max: 3,
        // suggestedMax: 6.0,
        ticks:{
          stepSize : .5,
          beginAtZero: false,
          max: 12.0,
          autoSkip: false,
        }
      },
      y: {
        gridLines:{
          zeroLineColor:'rgba(0, 0, 255, 1)',
        },
        axios: 'y',
        // max: 3,
        min: 0,
        suggestedMax:3.3,
        // suggestedMin:-6,
        ticks: {
          major: true,
          beginAtZero: true,
          stepSize : .5,
          fontSize : 10,
          textStrokeColor: 10,
          precision: 1,
        },
      },
    },
  }



  // 창 크기 조절에 따른 그래프 크기 조절
  const [first, setFirst] = useState({x:window.innerWidth, y: window.innerHeight})
  const [second, setSecond] = useState({x:window.innerWidth, y: window.innerHeight})
  const [temp, setTemp] = useState(false);

  const handleResize = debounce(()=>{
    console.log(second);
    setTemp(false);
    setSecond({
      x: window.innerWidth,
      y: window.innerHeight,
    })
  })

  useEffect(()=>{
    let time = setTimeout(() => {
      setTemp(true);
    },1000);
  },[graphData])

  useEffect(()=>{
    setFirst(second)
  },[second])

  useEffect(()=>{
    let time = setTimeout(() => {
      if (first["x"]===second["x"] && first["y"]==second["y"]){
        console.log("OOOOOOHHH")
        setTemp(true);
        if(chartRef.current){
          console.log("HELLO")
          chartRef.current.resize();
        };
      }
      else{
        setTemp(false)
        console.log("HEllt")
      };
    }, 300);
    return()=>{clearTimeout(time)}
  })
  
  useEffect(()=>{
    setFirst({
      x: window.innerWidth,
      y: window.innerHeight,
    })
  },[])


  useEffect(()=>{
    window.addEventListener("resize", handleResize)
    return()=>{
      window.removeEventListener("resize", handleResize)
    }
  },[])
  



  // volumeFlow 그리기
  useEffect(()=>
  {
    console.log("!#!##")

    let time = setTimeout(()=>{
      console.log("!#!##!@!@")
      
      let time2 = setTimeout(() => {
        let dataset = []
        volumeFlow.forEach((item,index)=>{
          dataset.push(
            {
              label: "",
              data: item,
              borderColor: `${colorList[index]}`,
              borderWidth: 2.5,
              showLine: true,
              tension: 0.4
            }
          )
        })
        let time3 = setTimeout(() => {
          let data = {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: dataset,
          }
          let time4 = setTimeout(() => {
            setGraphData(data);
          }, 50);
          return()=>{
            clearTimeout(time4);
          }
        }, 50);
        return()=>{
          clearTimeout(time3);
        }
      }, 50);
      return()=>{
        clearTimeout(time2);
      }
    },50)

    return()=>{
      clearTimeout(time);
    }
  },[volumeFlow])



  // timeVolume 그리기
  useEffect(()=>
  {
    console.log("!#!##")

    let time = setTimeout(()=>{
      console.log("!#!##!@!@")
      
      let time2 = setTimeout(() => {
        let dataset = []
        timeVolume.forEach((item,index)=>{
          dataset.push(
            {
              label: "WEEEK",
              data: item,
              borderColor: `${colorList[index]}`,
              borderWidth: 2.5,
              showLine: true,
              tension: 0.4
            }
          )
        })
        let time3 = setTimeout(() => {
          let data = {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: dataset,
          }
          let time4 = setTimeout(() => {
            setGraphData2(data);
          }, 50);
          return()=>{
            clearTimeout(time4);
          }
        }, 50);
        return()=>{
          clearTimeout(time3);
        }
      }, 50);
      return()=>{
        clearTimeout(time2);
      }
    },50)

    return()=>{
      clearTimeout(time);
    }
  },[timeVolume])

  const graphStyle = {width:"0px" ,height:"0px", transition:"none"}

  const chartRef = useRef();



  return(
    <div className="result-page-container">
        <div className="nav">
          <div className="nav-logo" onClick={()=>{console.log(chartRef.current['boxes'][3].max)}}>
            <h1>The SpiroKit</h1>
          </div>
          <div className="nav-content-container">
            <div className="nav-left-container">
              <div className="admin">
                <span>담당자</span>
                <span>{state.subject[7].value}</span>
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
              <div className="content">{state.subject[1].value}</div>
              <div className="title">성별</div>
              <div className="content">{state.subject[3].value=="m"?"남자":"여자"}</div>
              <div className="title">신장</div>
              <div className="content">{state.subject[4].value}cm</div>
              <div className="title">몸무게</div>
              <div className="content">{state.subject[5].value}kg</div>
              <div className="title">생년월일</div>
              <div className="content">{state.birthday}</div>
              <div className="title">연간 흡연량</div>
              <div className="content">{state.subject[13].value == "0" ? "-":state.subject[13].value}</div>
              <div className="title">흡연 여부</div>
              <div className="content">{state.subject[9].value === "false"||state.subject[9].value === false ? "아니오" : "예"}</div>


              {/* // 이부분 api 문제있음 */}
              <div className="title">흡연 기간</div> 
              {/* <div className="content">{state.smoke.period === 0 ? "-" : state.smoke.period}</div> */}

              <div className="space"></div>
            </div>
            <button onClick={updateData}>환자정보 수정</button>
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
              {temp?<Scatter ref={chartRef} style={graphStyle} data={graphData} options={graphOption}/>:<p className='loadingG'>화면 조정 중..</p>}
            </div>
            <div className="graph">
            {temp?<Scatter style={graphStyle} data={graphData2} options={graphOption2}/>:<p className='loadingG'>화면 조정 중..</p>}
            </div>
          </div>
          <div className="history-container">
            <div className="slider">
            {
              location.state.trials.map((item, index)=>(
              <div  key={item.measurementId}  className='simple-result-container'>
                <div className='simple-result-title-container'>
                  <p className='simple-result-title'>{item.bronchodilator}</p>
                  <p className='simple-result-date'>검사일시({item.date})</p>
                </div>
                <div className='simple-result-table-container'>
                  <div className='simple-result-table-column'>
                    <p></p>
                    <p>meas</p>
                    <p>pred</p>
                    <p>percent</p>
                  </div>
                  <div className='simple-result-table-FVC'>
                    <p>{item.results[0].title}({item.results[0].unit})</p>
                    <p>{item.results[0].meas}</p>
                    <p>{item.results[0].pred}</p>
                    <p>{item.results[0].per}</p>
                  </div>
                  <div className='simple-result-table-FEV1'>
                    <p>{item.results[1].title}({item.results[1].unit})</p>
                    <p>{item.results[1].meas}</p>
                    <p>{item.results[1].pred}</p>
                    <p>{item.results[1].per}</p>
                  </div>
                  <div className='simple-result-table-FEV1per'>
                    <p>FEV1%</p>
                    <p>{item.results[2].meas}</p>
                    <p>{item.results[2].pred}</p>
                    <p>{item.results[2].per}</p>
                  </div>
                  <div className='simple-result-table-PEF'>
                    <p>PEF(L/s)</p>
                    <p>{item.results[3].meas}</p>
                    <p>{item.results[3].pred}</p>
                    <p>{item.results[3].per}</p>
                  </div>
                </div>
              </div>
            ))}
              


            </div>
          </div>
        </div>
      </div>
  );
}
export default ResultPage;