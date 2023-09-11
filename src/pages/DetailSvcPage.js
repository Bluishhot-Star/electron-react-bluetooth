import { useEffect, useState, useRef} from "react";
import axios from "axios";
import { Cookies, useCookies } from 'react-cookie';
import { useLocation,useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { debounce } from 'lodash'
function DetailSvcPage(){
  const location = useLocation();
  const navigator = useNavigate();
  const state = location.state;
  const cookies = new Cookies();
  const [preResult, setPreResult] = useState([]);
  const [measurementId, setMeasurementId] = useState([]);
  const [quadrant4,setQuadrant4] = useState();
  const [postResult, setPostResult] = useState([]);
  const [quadrant4XY,setQuadrant4XY] = useState({
      x:0.0,
      y:0.0
  })
  const [preFvc,setPreFvc] = useState({
    lower: "",
    max: "",
    meas: "",
    min: "",
    post: "",
    title: "FVC",
    upper: "",
  });
  const [postFvc,setPostFvc] = useState({
    lower: "",
    max: "",
    meas: "",
    min: "",
    post: "",
    title: "FVC",
    upper: "",
  });
  const [preFev1,setPreFev1] = useState({
    lower: "",
    max: "",
    meas: "",
    min: "",
    post: "",
    title: "FEV1",
    upper: "",
  });
  const [postFev1,setPostFev1] = useState({
    lower: "",
    max: "",
    meas: "",
    min: "",
    post: "",
    title: "FEV1",
    upper: "",
  });
  const [preFev1Per,setPreFev1Per] = useState({
    lower: "",
    max: "",
    meas: "",
    min: "",
    post: "",
    title: "FEV%",
    upper: "",
  });
  const [postFev1Per,setPostFev1Per] = useState({
    lower: "",
    max: "",
    meas: "",
    min: "",
    post: "",
    title: "FEV%",
    upper: "",
  });
  ChartJS.register(LinearScale, PointElement, LineElement,BarElement, Tooltip, Legend);
  //종합 결과 목록 조회
  useEffect(()=>{
      let i = 0;
      let pre = undefined;
      let post = undefined;
      console.log(state)
      while(state.trials.length !== i){
        if(state.trials[i].best === true){
          if(pre === undefined){
            pre = i;
            setPreResult(state.trials[i].results);
            
          }else if(post === undefined){
            post = i;
            setPostResult(state.trials[i].results);
            break;
          }
        }
        i++;
      }        
      
  },[]);

  useEffect(()=>{
    console.log(Math.min(parseFloat(preFvc.meas, preFvc.min)));
  },[preFvc])
  
  // useEffect(()=>{
  //   axios.get(`/subjects/${chartNumber}/types/fvc/results/${state.date}/diagnosis` , {
  //     headers: {
  //       Authorization: `Bearer ${cookies.get('accessToken')}`
  //     }})
  //     .then((res)=>{

  //     }).catch((err)=>{
  //       console.log(err);
  //     })
  // })

  //4사분면 좌표
  useEffect(()=>{
    if(preResult.length !== 0){
      const fvcMeas = parseFloat(preResult[0].meas);
      const fvcPred = parseFloat(preResult[0].pred);
      setPreFvc(preResult[0]);
      const fev1Meas = parseFloat(preResult[1].meas);
      setPreFev1(preResult[1]);
      setPreFev1Per(preResult[2]);
      const x = fvcMeas/fvcPred
      const y = fev1Meas/fvcMeas
      setQuadrant4XY({
          ...quadrant4XY,
          x:(x >= 1 ? 1 : x),
          y:(y >= 1 ? 1 : y)
        })
    }
  },[preResult]);

  //post
  useEffect(()=>{
    if(Object.keys(postResult).length !== 0){
      setPostFvc(postResult[0]);
      setPostFev1(postResult[1]);
      setPostFev1Per(postResult[2]);
    }
    
  },[postResult])

  //4사분면 데이터
  const quadrant4Data = {
      labels: "",
      datasets: [{
        label: "",
        fill: false,
        // pointBackgroundColor: "red",
        pointRadius: 3,
        pointHitRadius: 3,
        backgroundColor: 'red',
        data: [{x: quadrant4XY.x, y: quadrant4XY.y}], 
        tension: 0.4,
      },]
    }
  //4사분면 옵션
  const quadrant4Option={
    plugins:{
      legend: {
        display: false
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    interaction: false,
    elements: {
      point: {
        radius: 0,
      },
    },
    pointRadius: 1,
    pointHoverRadius: 1,
    scales: {
      x: {
        axios: 'x',
        max: 1.0,
        min: 0.0,
        ticks:{
          display:false,
          beginAtZero: true,
          stepSize : 0.8,
          fontSize : 10,
          textStrokeColor: 10,
          precision: 2,
          
        },
        grid:{
          color:'#FF9191'
        }
      },
      y: {
        axios: 'y',
        max: 1.0,
        min: 0.0,
        
        ticks: {
          display:false,
          beginAtZero: true,
          stepSize : 0.7,
          fontSize : 10,
          textStrokeColor: 10,
          precision: 2,
        },
        grid:{
          color:'#FF9191',
        }
      },
    },
    title: {

    }
  }

  

  const fev1CompareBarData = {
    labels: "",
    datasets: [{
      label: "pre",
      fill: false,
      pointBackgroundColor: "#000",
      pointRadius: 5,
      pointHitRadius: 10,
      data: [{ x :preFev1.meas, y : 0.5}],
      tension: 0.4,
    },{
      label: "post",
      fill: false,
      pointBackgroundColor: "#000",
      pointRadius: 5,
      pointHitRadius: 10,
      data: [{x:postFev1.meas, y : 0.5}],
      tension: 0.4,
    }]
  }

  
  const fev1CompareBarOption={
    plugins:{
      legend: {
          display: false
      },
    },
    responsive: true,  
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
        max: preFev1.max,
        min: Math.min(parseFloat(preFev1.meas), parseFloat(preFev1.min)),
        ticks:{
          display:false,
          beginAtZero: true,
        },
        grid:{
          display:false
        }
      },
      y: {
        axios: 'y',
        max: 1.0,
        min: 0.0,
        ticks: {
          display:false,
          beginAtZero: true,
        },
        grid:{
          display:false
        }
      },
    },
    title: {
      
    }
  }
  

  const fev1PerCompareBarData = {
    labels: "",
    datasets: [{
      label: "pre",
      fill: false,
      pointBackgroundColor: "#000",
      pointRadius: 5,
      pointHitRadius: 10,
      data: [{ x :preFev1Per.meas, y : 0.5}],
      tension: 0.4,
    },{
      label: "post",
      fill: false,
      pointBackgroundColor: "#000",
      pointRadius: 5,
      pointHitRadius: 10,
      data: [{x:postFev1Per.meas, y : 0.5}],
      tension: 0.4,
    }]
  }

  const fev1PerCompareBarOption={
    plugins:{
      legend: {
          display: false
      },
    },
    responsive: true,  
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
        max: preFev1Per.max,
        min: Math.min(parseFloat(preFev1Per.meas), parseFloat(preFev1Per.min)),
        ticks:{
          beginAtZero: true,
          display:false,
        },
        grid:{
          display:false
        }
      },
      y: {
        axios: 'y',
        max: 1.0,
        min: 0.0,
        ticks: {
          beginAtZero: true,
          display:false,
        },
        grid:{
          display:false
        }
      },
    },
    title: {
      
    }
  }


  const fvcCompareBarData = {
    labels: "",
    datasets: [{
      label: "pre",
      fill: false,
      pointBackgroundColor: "#000",
      pointRadius: 5,
      // pointHitRadius: 10,
      data: [{ x :preFvc.meas, y : 0.5}],
      tension: 0.4,
    },{
      label: "post",
      fill: false,
      pointBackgroundColor: "#000",
      pointRadius: 5,
      data: [{x:postFvc.meas, y : 0.5}],
      tension: 0.4,
    }]
  }

  const fvcCompareBarOption={
    plugins:{
      legend: {
          display: false
      },
    },
    responsive: true,  
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
        
        min: Math.min(parseFloat(preFvc.meas), parseFloat(preFvc.min)),
        max: preFvc.max,
        ticks:{

          display:false,
          beginAtZero: true,
        },
        grid:{
          display:false
        }
      },
      y: {
        axios: 'y',
        max: 1.0,
        min: 0.0,
        ticks: {
          display:false,
          beginAtZero: true,
        },
        grid:{
          display:false
        }
      },
    },
    title: {
      
    }
  }
  
  const chartRef = useRef();
  const [FvcSvc, setFvcSvc] = useState("fvc"); //fvc, svc
  const [info, setInfo] = useState();
  const [tvMax, setTvMax] = useState([10]);
  //결과 그래프 목록 요청 FVC
  const[volumeFlow,setVolumeFlow] = useState([]);
  const[timeVolume,setTimeVolume] = useState([]);

  const[svcGraph,setSvcGraph] = useState([]);
  const[svcMax, setSvcMax] = useState([10]);
  let diagnosis, trials;

  let colorList = ['rgb(5,128,190)','rgb(158,178,243)','rgb(83, 225, 232)','rgb(67,185,162)','rgb(106,219,182)','rgb(255,189,145)','rgb(255,130,130)','rgb(236,144,236)','rgb(175,175,175)','rgb(97,97,97)'];
  
  const graphStyle = {width:"0px" ,height:"0px", transition:"none"}
  useEffect(()=>{
    console.log(location.state);
    console.log(123123123);
    diagnosis = location.state.diagnosis;
    //fvc의 심플카드
    trials = location.state.trials;
    let timeVolumeList = [];
    let volumeFlowList = [];
    let timeVolumeMaxList = [];

    if(trials){
      // 매 결과에서 데이터 추출
      trials.forEach((item)=>{
        if(item.best){
          timeVolumeList.push(item.graph.timeVolume);
          volumeFlowList.push(item.graph.volumeFlow);
          //현 timeVolume에서 최대값 찾기
          timeVolumeMaxList.push(item.results[3].meas);
        }
      })
      setVolumeFlow(volumeFlowList);
      setTimeVolume(timeVolumeList);
      setTvMax(timeVolumeMaxList);
    }
  },[])
  useEffect(()=>{
    //   console.log(location.state);
      console.log(123123123);
      //fvc의 심플카드
      trials = location.state.trials;
      let svcGraphList = [];
      let svcMaxList = [];
  
      if(trials){
        // 매 결과에서 데이터 추출
        trials.forEach((item)=>{
          svcGraphList.push(item.graph.timeVolume);
  
          //현 svc 최대값 찾기
          svcMaxList.push(parseInt(item.results[0].meas));
        })
        setSvcGraph(svcGraphList);
        setSvcMax(svcMaxList);
      }
    },[])
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
  const [graphData3, setGraphData3] = useState({
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
        suggestedMax: 3,
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
  const graphOption3={
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
        // min: 0,
        suggestedMax: 60.0,
        // suggestedMax: 6.0,
        ticks:{
          stepSize : 10.0,
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
        max: parseFloat(Math.max(...svcMax)),
        min: parseFloat(Math.max(...svcMax))*-1,
        suggestedMax:0,
        suggestedMin:-6,
        ticks: {
          major: true,
          beginAtZero: true,
          // stepSize : .5,
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
    setTemp(false);
    setSecond({
      x: window.innerWidth,
      y: window.innerHeight,
    })
  })

  useEffect(()=>{
    setTemp(false);
  },[FvcSvc])

  useEffect(()=>{
    let time = setTimeout(() => {
      setTemp(true);
    },500);
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
    },300);
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
              borderColor: 'rgba(255,0,0,1)',
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
              label: "",
              data: item,
              borderColor:'rgba(255,0,0,1)',
              borderWidth: 2.5,
              showLine: true,
              tension: 0.4
            }
          )
        })
        let time3 = setTimeout(() => {
          let data = {
            labels: "",
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

  useEffect(()=>
  {
    console.log("!#!##")

    let time = setTimeout(()=>{
      console.log("!#!##!@!@")
      
      let time2 = setTimeout(() => {
        let dataset = []
        svcGraph.forEach((item,index)=>{
          dataset.push(
            {
              label: "",
              data: item,
              borderColor: "red",
              borderWidth: 2.5,
              showLine: true,
              tension: 0.4
            }
          )
        })
        let time3 = setTimeout(() => {
          let data = {
            labels: "",
            datasets: dataset,
          }
          let time4 = setTimeout(() => {
            setGraphData3(data);
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
  },[svcGraph])

    return (
        // <div> 
        //   <div>담당자 {state.subject[7].value}</div>
        //   <div>검사적합성 : {state.diagnosis.suitability}</div>
        //     <div onClick={()=>{
        //       navigator(-1) //탈출용
        //     }}>
        //         {preResult.map((item)=>(
        //             <table border={1}>
        //                 <tr>
        //                     <td></td>
        //                     <td>측정</td>
        //                     <td>예측값</td>
        //                     <td>%</td>
        //                     <td>정상범위</td>
        //                 </tr>
        //                 <tr>
        //                     <td>{item.title}</td>
        //                     <td>{item.meas === '' ? '-' : item.meas}</td>
        //                     <td>{item.pred === '' ? '-' : item.pred}</td>
        //                     <td>{item.per === '' ? '-' : item.per}</td>
        //                     <td>{item.min} ~ {item.max}</td>
                        
        //                 </tr>
        //             </table>
        //         ))}
        //         pre
        //     </div>

        //     <div>
              
        //         {postResult.map((item)=>(
        //             <table border={1}>
        //                 <tr>
        //                     <td></td>
        //                     <td>측정</td>
        //                     <td>예측값</td>
        //                     <td>%</td>
        //                     <td>정상범위</td>
        //                 </tr>
        //                 <tr>
        //                     <td>{item.title}</td>
        //                     <td>{item.meas === '' ? '-' : item.meas}</td>
        //                     <td>{item.pred === '' ? '-' : item.pred}</td>
        //                     <td>{item.per === '' ? '-' : item.per}</td>
        //                     <td>{item.min} {item.min === '' ? '-' : '~'} {item.max}</td>
                        
        //                 </tr>
        //             </table>
        //         ))}
        //         Post
        //     </div>

        //     <div>
        //       4사분면
        //         <Scatter options={quadrant4Option} data={quadrant4Data} />
        //     </div>
        //     <div >
        //       FVC<Scatter id="fvc" options={fvcCompareBarOption} data={fvcCompareBarData}/>
        //     </div>
        //     <div>
        //       FEV1<Scatter options={fev1CompareBarOption} data={fev1CompareBarData} />
        //     </div>
        //     <div>
        //       FEV1%<Scatter options={fev1PerCompareBarOption} data={fev1PerCompareBarData} />
        //     </div>
        // </div>
        <div className="result-page-container detail-page-container">
        <div className="nav">
          <div className="nav-logo" onClick={()=>{console.log(volumeFlow);}}>
            <h1>The SpiroKit</h1>
          </div>
          <div className="nav-content-container">
            <div className="nav-left-container">
              <div className="admin">
                <span>담당자</span>
                {/* <span>{state.subject[7].value}</span> */}
              </div>
            </div>
            {/* <div className="nav-right-container">
              <button className="select-patient-btn" onClick={()=>{navigator(-1)}}>환자 선택</button>
              <button className="setting-btn">설정</button>
            </div> */}
          </div>
        </div>
        <div className="nav-bottom">
          <div className="button-container">
            <div className="suitability">검사 적합성 : </div>
            <button className="detail-btn" onClick={()=>{navigator(-1)}}>결과 요약보기</button>
          </div>
        </div>
        <div className="left-container">
          {/* <div className="button-container">
            <button className="detail-btn" onClick={()=>{}}>결과 상세보기</button>
          </div> */}
            <div className="detail-svc-graph-container">
              <div className="graph">
                {temp?<div className="title-y">Volume(L)</div>:<></>}
                {temp?<Scatter style={graphStyle} data={graphData3} options={graphOption3}/>:<p className='loadingG'>화면 조정 중..</p>}
                {temp?<div className="title-x">Time(s)</div>:<></>}
              </div>
            </div>
          
          {/* <div className="fvc-graph-container">
          </div> */}
          

          <div className="bottom-graph-container">
            <div className="quadrant-graph-container">
              <div className="graph">
                {temp?<Scatter options={quadrant4Option} style={graphStyle} data={quadrant4Data} />:<></>}
                <div className="guard guard-top"></div>
                <div className="guard guard-right"></div>
                <div className="guard guard-bottom"></div>
                <div className="guard guard-left"></div>
              </div>
            </div>
            <div className="compare-graph-container">
              {/* <div className="fvc-compare-graph">
                <div className="compare-title">FVC(L)</div>
                <div className="compare-canvas-container">
                  {temp?<Scatter id="fvcCompare" style={graphStyle} options={fvcCompareBarOption} data={fvcCompareBarData}/>:<></>}
                </div>
              </div>
              <div className="fev1-compare-graph">
                <div className="compare-title">FEV1(L)</div>
                <div className="compare-canvas-container">
                  {temp?<Scatter style={graphStyle} options={fev1CompareBarOption} data={fev1CompareBarData} />:<></>}
                </div>
              </div>
              <div className="fev1per-compare-graph">
                <div className="compare-title">FEV1(%)</div>
                <div className="compare-canvas-container">
                  {temp?<Scatter style={graphStyle} options={fev1PerCompareBarOption} data={fev1PerCompareBarData} />:<></>}
                </div>
              </div> */}
            </div>
          </div>
        </div>
        <div className="right-container">
        <div className="prePost-container">
            <div className="prePost-column">
              <div className="prePost-column-name"></div>
              <div className="prePost-column-name"></div>
              <div className="prePost-column-name">측정</div>
              <div className="prePost-column-name">예측값</div>
              <div className="prePost-column-name">%</div>
              <div className="prePost-column-name">정상범위</div>
              <div className="prePost-column-name"></div>
            </div>
            <div className="prePost-item-container">
              {
                preResult.map((item)=>(
                    <div className="prePost-item">
                        <div></div>
                        <div className="prePost-item-title"><p>{item.title}</p></div>
                        <div><p>{item.meas === '' ? '-' : item.meas}</p></div>
                        <div><p>{item.pred === '' ? '-' : item.pred}</p></div>
                        <div><p>{item.per === '' ? '-' : item.per}</p></div>
                        <div><p>{item.min} ~ {item.max}</p></div>
                        <div></div>
                    </div>
                ))
              }
            </div>
            <div className="prePost-btn-container">
              <button>Pre 보기</button>
              <button>Post 보기</button>
            </div>
          </div>
        </div>
      </div>
    );

}

export default DetailSvcPage;