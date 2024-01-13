import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Cookies, useCookies } from 'react-cookie';
import { Routes, Route, Link, useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear,faChevronRight,faCalendar, faSquareXmark } from '@fortawesome/free-solid-svg-icons'
import { debounce } from 'lodash'
import {registerables,Chart as ChartJS,RadialLinearScale,LineElement,Tooltip,Legend,} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { useLocation } from 'react-router-dom';
import DateSelector from './DateSelector.js'
import annotationPlugin from 'chartjs-plugin-annotation';
import PdfView from "../components/PdfView.js";
import { PDFViewer } from '@react-pdf/renderer';


function ResultPageCopy(){
  ChartJS.register(RadialLinearScale, LineElement, Tooltip, Legend, ...registerables,annotationPlugin);

  const location = useLocation();
  const navigator = useNavigate();
  const state = location.state;
  const cookies = new Cookies();
  const [FvcSvc, setFvcSvc] = useState("fvc"); //fvc, svc
  const [info, setInfo] = useState();
  const [tvMax, setTvMax] = useState([10]);
  const [totalData,setTotalData] = useState({
    fvc:"Empty resource",
    svc:"Empty resource",
    date:"",
    birth:""
  })

  let diagnosis, trials;

  const chartRef = useRef();
  const chartRef2 = useRef();

  let colorList = ['rgb(5,128,190)','rgb(158,178,243)','rgb(83, 225, 232)','rgb(67,185,162)','rgb(106,219,182)','rgb(255,189,145)','rgb(255,130,130)','rgb(236,144,236)','rgb(175,175,175)','rgb(97,97,97)'];
  
  const [graphOnOff, setGraphOnOff] = useState([]);
  const [allTimeVolumeList, setAllTimeVolumeList] = useState([]);
  const [allVolumeFlowList, setAllVolumeFlowList] = useState([]);
useEffect(()=>{
  setTotalData(state);
},[])
  //fvc 그래프 처리
  useEffect(()=>{
    console.log(location.state);
    console.log(123123123);
    diagnosis = location.state.diagnosis;
    //fvc의 심플카드
    trials = totalData.fvc.trials;
    let timeVolumeList = [];
    let volumeFlowList = [];
    let timeVolumeMaxList = [];
    let timeVolumeMaxListX = [];

    if(trials){
      console.log(trials.length);
      let temp = new Array(trials.length).fill(0);
      setGraphOnOff(temp);

      // 매 결과에서 데이터 추출
      trials.forEach((item)=>{
        timeVolumeList.push(item.graph.timeVolume);
        volumeFlowList.push(item.graph.volumeFlow);

        //현 timeVolume에서 최대값 찾기
        timeVolumeMaxList.push(item.results[3].meas);
        timeVolumeMaxListX.push(item.graph.timeVolume[item.graph.timeVolume.length-1].x); //최대 x값 찾기
      })
      timeVolumeMaxListX.sort((a,b)=>a-b);
      timeVolumeMaxList.forEach((item, idx)=>{
        timeVolumeList[idx].push({x : Math.max(Math.ceil(timeVolumeMaxListX[timeVolumeMaxListX.length-1]), 3), y: timeVolumeList[idx][timeVolumeList[idx].length-1].y})
      })
      setVolumeFlow(volumeFlowList);
      setTimeVolume(timeVolumeList);
      setAllTimeVolumeList(timeVolumeList);
      setAllVolumeFlowList(volumeFlowList);
      setTvMax(timeVolumeMaxList);
      graphOption.scales.x.max = parseInt(Math.max(...timeVolumeMaxList));
      setTrigger(0);
    }
  },[totalData])
// timeVolumeList -> meas 최대값 == y축 마지막값(최대값) / 마지막x값들 중 최대값을 각 데이터셋에 적용
// dataset.push({x: 마지막x값들 중 최대값, y:tvMax[index]})




  const click = ()=>{
    console.log(location.state);
    console.log(state.info[0].content);
  }
  
  const updateData = ()=>{
    let patientDate = location.state;
    console.log(location.state)
    patientDate['update'] = true;
    navigator('/memberList/addPatient', {state: patientDate})
  }

  //결과 그래프 목록 요청 FVC
  const[volumeFlow,setVolumeFlow] = useState([]);
  const[timeVolume,setTimeVolume] = useState([]);

  const [trigger, setTrigger] = useState(-1);




  
  //svc그래프
  const[svcGraph,setSvcGraph] = useState([]);
  const[allSvcGraph,setAllSvcGraph] = useState([]);
  //svcY축 최대값
  const[svcMax, setSvcMax] = useState([10]);
  //그래프 선택 온오프
  const[svcGraphOnOff, setSvcGraphOnOff] = useState([]);
  //svc trigger
  const[svcTrigger, setSvcTrigger] = useState(-1);
  //심플카드 모음
  const[svcTrials, setSvcTrials] = useState([1]);

  //그래프 선택
  const selectGraph=(index)=>{
    console.log("HE!!!!");
    let temp;
    //처음 눌렀을때
    if(trigger == 0){
      temp = [...graphOnOff].fill(0); //0으로 바꾸기 (선택효과 끄기)
    }
    else{ //처음 아닐때
      temp = [...graphOnOff];
    }

    if (temp[index] == 1){
      temp[index] = 0;
      setTrigger(trigger-1);
    }
    else if(temp[index] == 0){
      temp[index] = 1;
      setTrigger(trigger+1);
    }
    setGraphOnOff(temp);
  }

  //svc 그래프 선택
  const selectSvcGraph=(index)=>{
    console.log("SVC!!!!");
    let temp;
    //처음 눌렀을때
    if(svcTrigger == 0){
      temp = [...svcGraphOnOff].fill(0); //0으로 바꾸기 (선택효과 끄기)
    }
    else{ //처음 아닐때
      temp = [...svcGraphOnOff];
    }

    if (temp[index] == 1){
      temp[index] = 0;
      setSvcTrigger(svcTrigger-1);
    }
    else if(temp[index] == 0){
      temp[index] = 1;
      setSvcTrigger(svcTrigger+1);
    }
    setSvcGraphOnOff(temp);
  }

  useEffect(()=>{
    /**
     * allTimeVolumeList -> 전체 리스트
     * timeVolume -> 보여줄 리스트
     */
    
    // 누른거 없을떄 onoff[1,1,1, ...]
    console.log("Trigger : "+trigger);
    if(trigger == 0){
      console.log("ALLLLL : ",allTimeVolumeList);
      let temp = [...graphOnOff].fill(0);
      setGraphOnOff(temp);
      setTimeVolume(allTimeVolumeList);
      setVolumeFlow(allVolumeFlowList);
      return;
    }
    // 누른거 있을때
    let temp = [...allTimeVolumeList];
    let temp2 = [...allVolumeFlowList];
    graphOnOff.forEach((item, index)=>{
      if(item == 0){
        temp[index] = [{x: 0, y: 0}];
        temp2[index] = [{x: 0, y: 0}];
      }
      else if(item == 1){
        temp[index] = allTimeVolumeList[index];
        temp2[index] = allVolumeFlowList[index];
      }
    })
    setTimeVolume(temp);
    setVolumeFlow(temp2);
    console.log(temp);

  },[trigger])
  
  useEffect(()=>{
    /**
     * allTimeVolumeList -> 전체 리스트
     * timeVolume -> 보여줄 리스트
     */
    
    // 누른거 없을떄 onoff[1,1,1, ...]
    console.log("SVCTrigger : "+svcTrigger);
    if(svcTrigger == 0){
      console.log("SVCALLLLL : ",allSvcGraph);
      let temp = [...svcGraphOnOff].fill(0);
      setSvcGraphOnOff(temp);
      setSvcGraph(allSvcGraph);
      return;
    }
    // 누른거 있을때
    let temp = [...allSvcGraph];
    svcGraphOnOff.forEach((item, index)=>{
      if(item == 0){
        temp[index] = [{x: 0, y: 0}];
      }
      else if(item == 1){
        temp[index] = allSvcGraph[index];
      }
    })
    setSvcGraph(temp);
    console.log(temp);

    /////////////////////////
  },[svcTrigger])





  useEffect(()=>{
  //   console.log(location.state);
    console.log(123123123);
    //svc의 심플카드
    trials = location.state.svc.trials;
    let svcGraphList = [];
    let svcMaxList = [];

    if(trials){
      console.log(trials.length);
      let temp = new Array(trials.length).fill(0);
      setSvcGraphOnOff(temp);
// 
      // 매 결과에서 데이터 추출
      trials.forEach((item)=>{
        svcGraphList.push(item.graph.timeVolume);

        //현 svc 최대값 찾기
        svcMaxList.push(parseFloat(item.results[0].meas));
      })
      setSvcGraph(svcGraphList);
      setAllSvcGraph(svcGraphList);
      setSvcMax(svcMaxList);
      setSvcTrigger(0);
    }
  },[])

  useEffect(()=>{
    if(FvcSvc=="fvc"){
      graphOnOff.forEach((item, index)=>{
        if(item == 1){
          simpleResultsRef.current[index].classList+=" selected";
          simpleResultsRef.current[index].style+="";
        }
        else{
          if(simpleResultsRef.current[index].classList.contains("selected")){
            simpleResultsRef.current[index].classList.remove("selected");
          }
        }
      })
    }
  },[graphOnOff])
  
  useEffect(()=>{
    if(FvcSvc=="svc"){
      svcGraphOnOff.forEach((item, index)=>{
      if(item == 1){
          svcSimpleResultsRef.current[index].classList+=" selected";
          svcSimpleResultsRef.current[index].style+="";
        }
        else{
          if(svcSimpleResultsRef.current[index].classList.contains("selected")){
            svcSimpleResultsRef.current[index].classList.remove("selected");
          }
        }
      })
    }
  },[svcGraphOnOff])

  const [graphData, setGraphData] = useState({
    labels: ['FVC'],
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
    labels: ['FVC'],
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
    labels: ['SVC'],
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
      datalabels: false,
    },
    responsive: true,
    animation:{
      duration:0
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
        // max: parseInt(Math.max(...tvMax)),
        // suggestedMax: 6.0,
        // max:5.5,
        ticks:{
          autoSkip: false,
          // stepSize : 0.25,
          // precision : 0.1,
          beginAtZero: false,
          max: 12.0,
        },
        grid:{
          color: function(context) {
            if (context.index === 0){
              return '#20a0b3';
            }
            else{
              return '#bbdfe4';
            }
          },
        }
      },
      y: {
        gridLines:{
          zeroLineColor:'rgb(0, 0, 255)',
        },
        axios: 'y',
        // min: -9,
        grace:"5%",
        ticks: {
          major: true,
          beginAtZero: true,
          stepSize : 1,
          fontSize : 10,
          textStrokeColor: 10,
          precision: 1,
        },
        grid:{
          color: function(context) {
            if (context.index === 0){
              return '#20a0b3';
            }
            else if (context.tick.value > 0) {
              return '#bbdfe4';
            } else if (context.tick.value < 0) {
              return '#bbdfe4';
            }
            return '#20a0b3';
          },
        }
      },
    },
  }


  const [graphOption2, setGraphOption2]=useState({

    plugins:{
      afterDraw: function (chart, easing) {
        console.log(chart);
      },
      legend: {
          display: false
      },
      resizeDelay:0,
      datalabels: false,
      
    },
    afterDraw: function (chart, easing) {
      console.log(chart);
    },
    
    responsive: true,
    animation:{
      duration:0
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
        },
        grid:{
          color: function(context) {
            if (context.index === 0){
              return '#20a0b3';
            }
            else{
              return '#bbdfe4';
            }
          },
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
        grid:{
          color: function(context) {
            if (context.index === 0){
              return '#20a0b3';
            }
            else{
              return '#bbdfe4';
            }
          },
        }
      },
    },
  })
  const graphOption3={
    plugins:{
      legend: {
          display: false
      },
      resizeDelay:0,
      datalabels: false,
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
        },
        grid:{
          color: function(context) {
            if (context.index === 0){
              return '#20a0b3';
            }
            else{
              return '#bbdfe4';
            }
          },
        }
      },
      y: {
        gridLines:{
          zeroLineColor:'rgba(0, 0, 255, 1)',
        },
        axios: 'y',
        max: parseFloat(Math.max(...svcMax)),
        min: parseFloat(Math.max(...svcMax))*-1,
        // suggestedMax:0,
        // suggestedMin:-6,
        ticks: {
          major: true,
          beginAtZero: true,
          // stepSize : .5,
          fontSize : 10,
          textStrokeColor: 10,
          precision: 1,
        },
        grid:{
          color: function(context) {
            if (context.index === 0){
              return '#20a0b3';
            }
            else if (context.tick.value > 0) {
              return '#bbdfe4';
            } else if (context.tick.value < 0) {
              return '#bbdfe4';
            }
            return '#20a0b3';
          },
        }
      },
    },
  }

useEffect(()=>{
  console.log(chartRef.current);
},[])

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
      setGraphOption2({...graphOption2})
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
          // chartRef2.current.update();
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
              borderColor: `${colorList[index%10]}`,
              borderWidth: 2.5,
              showLine: true,
              tension: 0.4
            }
          )
        })
        let time3 = setTimeout(() => {
          let data = {
            labels: '',
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
              borderColor: `${colorList[index%10]}`,
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

  // svcGraph 그리기
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
              borderColor: `${colorList[index%10]}`,
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
  // useEffect(()=>[
  //   console.log(state)
  // ],[])



  const graphStyle = {width:"0px" ,height:"0px", transition:"none"}

  const simpleResultsRef = useRef([]);
  const svcSimpleResultsRef = useRef([]);
  const addSimpleResultsRef = (el) => {simpleResultsRef.current.push(el)};
  const detailPage = () => {
    if(FvcSvc == "fvc") navigator('/memberList/detailPage', {state: state.fvc});
    else navigator('/memberList/detailSvcPage', {state: state.svc});
  }

  const FVCBtnRef = useRef();
  const SVCBtnRef = useRef();


  const changeType = (type)=>{
    setFvcSvc(type);
  }
  useEffect(()=>{
    if(FvcSvc === 'fvc'){
      if(SVCBtnRef.current.classList.contains("clickedType")){
        SVCBtnRef.current.classList.remove("clickedType");
      }
      FVCBtnRef.current.classList += " clickedType"
    }
    else{
      if(FVCBtnRef.current.classList.contains("clickedType")){
        FVCBtnRef.current.classList.remove("clickedType");
      }
      SVCBtnRef.current.classList += " clickedType"
    }
  },[FvcSvc])

  const dateSelect = (select) =>{
    console.log(select);
    setInspectionDate(select);
}
useEffect(()=>{console.log(state)},[])
  const [inspectionDate, setInspectionDate] = useState({
    start : "",
    end : ""
  });
  const [date, setDate] = useState([]);
  useEffect(()=>{
    if(totalData.chartNumber !== "" && totalData.fvc !== "" && totalData.fvc!=="Empty resource"){
      axios.get(`/subjects/${totalData.fvc.subject[0].value}/histories?from=${inspectionDate.start === "" ? "2000-01-01" : inspectionDate.start}&to=${inspectionDate.end === "" ? "2099-01-01" : inspectionDate.end}` , {
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

  const [dateSelectorStat, setDateSelectorStat] = useState(false);
  const [goTO, setGoTO] = useState(false)
  // let data1, data2;
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const report = async(date)=>{
    const nDate = [date];
    await axios.get(`/v3/subjects/${state.fvc.subject.chartNumber}/types/fvc/results/${date}` , {
      headers: {
        Authorization: `Bearer ${cookies.get('accessToken')}`
      }
    }).then((res)=>{
      console.log(res.data.response);
      setData1(res.data.response);
      // setDate(nDate)
    }).catch((err)=>{
      console.log(err);
    })
    await axios.get(`/v3/subjects/${state.fvc.subject.chartNumber}/types/svc/results/${date}` , {
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


    axios.get(`/subjects/${state.fvc.subject.chartNumber}/types/fvc/results/${date}/diagnosis` , {
      headers: {
        Authorization: `Bearer ${cookies.get('accessToken')}`
      }
    }).then((res)=>{
      console.log(res.data.response);
      // setDate(nDate)
    }).catch((err)=>{
      console.log(err);
    })

    

    setGoTO(true);
    // let time = setTimeout(()=>{
    //   setGoTO(true);
    // },1000)
  }
  useEffect(()=>{
    console.log("adfas")
    if(goTO){
      // navigator('/memberListCopy/resultPage',{replace:true}, {state: {fvc:data1, svc:data2, date:date, birth:state.birth}});
      setTotalData({
        fvc : data1,
        svc : data2,
        date : date,
        birth : state.birth
      })
      setGoTO(false);
    }
    else{}
  },[goTO])

  // useEffect(()=>{
  //   if(data1.length != 0){
  //     axios.get(`/subjects/${state.fvc.subject[0].value}/types/fvc/measurements/${data1.trials[1].measurementId}` , {
  //       headers: {
  //         Authorization: `Bearer ${cookies.get('accessToken')}`
  //       }
  //     }).then((res)=>{
  //       console.log(res);
        
  //     }).catch((err)=>{
  //       console.log(err);
  //     })
  //   }
    
  // },[data1])
  
useEffect(()=>{
console.log(totalData)
},[totalData])
  const simpleResult = async(id,date)=>{
    await axios.delete(`/measurements/${id}` , {
      headers: {
        Authorization: `Bearer ${cookies.get('accessToken')}`
      }
    }).then((res)=>{
      console.log(res);
    }).catch((err)=>{
      console.log(err);
    })
    console.log(date.split(' ')[0]);
    report(date.split(' ')[0]);

  }
  useEffect(()=>{
    console.log(ChartJS.defaults)
  },[])  
  const [viewer,setViewer] = useState(false);
  return( 
    <div className="result-page-container">
      {dateSelectorStat ? <DateSelector data={inspectionDate} onOff={setDateSelectorStat} select={dateSelect}/> : null}
      {viewer ?
      <PDFViewer style={{width:1000, height:500, opacity:1}}>
        <PdfView data={totalData}/>
      </PDFViewer>  : null}
        <div className="nav">
          <div className="nav-logo" onClick={()=>{
            navigator('./pdfView',{state:totalData})
            // setViewer(!viewer)

            }}>
            <h1>The SpiroKit</h1>
          </div>
          <div className="nav-content-container">
            <div className="nav-left-container">

              <div className='admin'>
                <span>담당자 </span>
                
                <span>{totalData.fvc === '' || totalData.fvc === 'Empty resource' ? '': totalData.fvc.subject.clinicianName}</span>
                
              </div>
              <div className='error'>
                <span>Error Code </span>
                <span>{totalData.fvc === '' || totalData.fvc === 'Empty resource' ? '-': totalData.fvc.diagnosis.errorCode}</span>
              </div>
              <div className='grade'>
                <span>Grade </span>
                <span>{totalData.fvc === '' || totalData.fvc === 'Empty resource' ? '-': totalData.fvc.diagnosis.suitability}</span> 
              </div>
            </div>
            <div className="nav-right-container">
              <div className="select-patient-btn" onClick={()=>{navigator('/memberList')}}>환자 선택</div>
              <div className='setting-btn-container' onClick={()=>{navigator("/setting")}}>
                <FontAwesomeIcon className='cogIcon' icon={faGear}/>
                <p className="setting-btn" >설정</p>
              </div>
            </div>
          </div>
        </div>
        <div className="left-container">
          
          <div className="patient-measure-list">
          <div className="measure-date-container">
            <div className="measure-selected-date-container">
              <div>검사 이력</div>
              <div className='measure-selected-dateC'>
                <div className="measure-selected-date-start">{inspectionDate.start ? inspectionDate.start : "0000-00-00"}</div>
                <div>~</div>
                <div className="measure-selected-date-end">{inspectionDate.end ? inspectionDate.end : "0000-00-00"}</div>
              </div>
            </div>
            <div className="measure-select-date-btn-container" onClick={()=>{
                setDateSelectorStat(!dateSelectorStat)
              }}>
            <FontAwesomeIcon className='calenderIcon' icon={faCalendar} style={{color: "#4b75d6",}} />
            </div>
          </div>
            <div className="measure-item-containerC">
              { state.date ? 
              state.date.map((item, index)=>(
                    // <Link key={item} to={`/ss/${examinee}/${item}`}>
                <div key={item} className="measure-item" onClick={()=>{report(item);}}>
                  <div className='measure-item-date'>{item}</div>

                </div>
              )) : undefined}
            </div>
          </div>
          <div className="patient-info-containerC">
            <span>환자 정보</span>
            <div className="patient-infoC">
              <div className="title">이름</div>
              <div className="content">{totalData.fvc === '' || totalData.fvc === 'Empty resource' ? '': totalData.fvc.subject.name}</div>
              <div className="title">성별</div>
              <div className="content">{totalData.fvc === '' || totalData.fvc === 'Empty resource' ? '': totalData.fvc.subject.gender=="m"?"남자":"여자"}</div>
              <div className="title">신장</div>
              <div className="content">{totalData.fvc === '' || totalData.fvc === 'Empty resource' ? '': totalData.fvc.subject.height}cm</div>
              <div className="title">몸무게</div>
              <div className="content">{totalData.fvc === '' || totalData.fvc === 'Empty resource' ? '': totalData.fvc.subject.weight}kg</div>
              <div className="title">생년월일</div>
              <div className="content">{totalData.fvc === '' || totalData.fvc === 'Empty resource' ? '': totalData.birth}</div>
              <div className="title">연간 흡연량</div>
              <div className="content">{totalData.fvc === '' || totalData.fvc === 'Empty resource' ? '': totalData.fvc.subject.smokingPackYear == '' ? "-":state.fvc.subject.smokingPackYear}</div>
              <div className="title">흡연 여부</div>
              <div className="content">{totalData.fvc === '' || totalData.fvc === 'Empty resource' ? '': totalData.fvc.subject.smoking === "false"||state.fvc.subject.smoking === false ? "아니오" : "예"}</div>


              {/* // 이부분 api 문제있음 */}
              <div className="title">흡연 기간(연)</div> 
              <div className="content">{totalData.fvc === '' || totalData.fvc === 'Empty resource' ? '': totalData.fvc.subject.smokingStartAge == '' ? "-" :parseInt(totalData.fvc.subject.smokingStopAge) - parseInt(totalData.fvc.subject.smokingStartAge)}</div>
              

              {/* <div className="space"></div> */}
            </div>
            {/* <button onClick={updateData}>환자정보 수정</button> */}
             {/* <div className="button-container"></div> */}
          </div>
        </div>
        <div className="right-container">
          <div className="button-container">
            <div className="two-btn-container">
              <button ref={FVCBtnRef} onClick={()=>{changeType("fvc")}} id="clickme" className="FVC-btn">FVC</button>
              <button ref={SVCBtnRef} onClick={()=>{changeType("svc")}} className="SVC-btn">SVC</button>
            </div>
            <button className="detail-btn" onClick={()=>{detailPage()}}>결과 상세보기</button>
          </div>
          {
            FvcSvc == "fvc" ? 
            <div className="fvc-graph-container">
              <div className="graph">
                {temp?<div className="title-y">Flow(l/s)</div>:<></>}
                {temp?<Scatter ref={chartRef} style={graphStyle} data={graphData} options={graphOption}/>:<p className='loadingG'>화면 조정 중..</p>}
                {temp?<div className="title-x">Volume(L)</div>:<></>}
              </div>
              <div className="graph">
                {temp?<div className="title-y">Volume(L)</div>:<></>}
                {temp?<Scatter ref={chartRef2} style={graphStyle} data={graphData2} options={graphOption2}/>:<p className='loadingG'>화면 조정 중..</p>}
                {temp?<div className="title-x">Time(s)</div>:<></>}
              </div>
            </div>
          :
            <div className='svc-graph-container'>
              <div className="graph">
                {temp?<div className="title-y">Volume(L)</div>:<></>}
                {temp?<Scatter ref={chartRef} style={graphStyle} data={graphData3} options={graphOption3}/>:<p className='loadingG'>화면 조정 중..</p>}
                {temp?<div className="title-x">Time(s)</div>:<></>}
              </div>
            </div>
          }
          {/* <div className="fvc-graph-container">
          </div> */}


          <div className="history-container">
            <div className="slider">
            {
              FvcSvc == "fvc" ?
              totalData.fvc === '' || totalData.fvc === 'Empty resource'? '' :
              totalData.fvc.trials.map((item, index)=>(
                <div ref={(el)=>{simpleResultsRef.current[index]=el}} onClick={()=>{console.log(simpleResultsRef.current[index]);console.log(item.measurementId);selectGraph(index)}} key={item.measurementId}  className='simple-result-container'>
                  <div className='simple-result-title-container'>
                    <FontAwesomeIcon className='deleteIcon' icon={faSquareXmark} style={{color: "#ff0000",}} onClick={(e)=>{e.stopPropagation(); simpleResult(item.measurementId, item.date)}}/>
                    <div className='simple-result-title-date'>
                      <div className='simple-result-title'>{item.bronchodilator}</div>
                      <div className='simple-result-date'>({item.date})</div>
                    </div>
                    <div className='simple-result-errorcode'>
                      Error Code : {item.errorCode}
                    </div>
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
                      <p>{item.results[0].meas?item.results[0].meas:"-"}</p>
                      <p>{item.results[0].pred?item.results[0].pred:"-"}</p>
                      <p>{item.results[0].per?item.results[0].per:"-"}</p>
                    </div>
                    <div className='simple-result-table-FEV1'>
                      <p>{item.results[22].title}({item.results[22].unit})</p>
                      <p>{item.results[22].meas?item.results[22].meas:"-"}</p>
                      <p>{item.results[22].pred?item.results[22].pred:"-"}</p>
                      <p>{item.results[22].per?item.results[22].per:"-"}</p>
                    </div>
                    <div className='simple-result-table-FEV1'>
                      <p>{item.results[1].title}({item.results[1].unit})</p>
                      <p>{item.results[1].meas?item.results[1].meas:"-"}</p>
                      <p>{item.results[1].pred?item.results[1].pred:"-"}</p>
                      <p>{item.results[1].per?item.results[1].per:"-"}</p>
                    </div>
                    <div className='simple-result-table-FEV1per'>
                      <p>FEV1%</p>
                      <p>{item.results[2].meas?item.results[2].meas:"-"}</p>
                      <p>{item.results[2].pred?item.results[2].pred:"-"}</p>
                      <p>{item.results[2].per?item.results[2].per:"-"}</p>
                    </div>
                    <div className='simple-result-table-PEF'>
                      <p>PEF(L/s)</p>
                      <p>{item.results[3].meas?item.results[3].meas:"-"}</p>
                      <p>{item.results[3].pred?item.results[3].pred:"-"}</p>
                      <p>{item.results[3].per?item.results[3].per:"-"}</p>
                    </div>
                  </div>
                </div>
                ))
              :
              totalData.svc === "Empty resource" ? <div>비어있음</div>:
              totalData.svc.trials.map((item, index)=>(
                <div ref={(el)=>{svcSimpleResultsRef.current[index]=el}} onClick={()=>{console.log(svcSimpleResultsRef.current[index]);console.log(item.measurementId);selectSvcGraph(index)}} key={item.measurementId}  className='simple-result-container'>
                  <div className='simple-result-title-container'>
                    <FontAwesomeIcon className='deleteIcon' icon={faSquareXmark} style={{color: "#ff0000",}} onClick={(e)=>{e.stopPropagation(); simpleResult(item.measurementId, item.date)}}/>
                    <div className='simple-result-title-date'>
                      <div className='simple-result-title'>{item.bronchodilator}</div>
                      <div className='simple-result-date'>({item.date})</div>
                    </div>
                    <div className='simple-result-errorcode'>
                      Error Code : {item.errorCode}
                    </div>
                  </div>
                  <div className='simple-result-table-container'>
                    <div className='simple-result-table-column'>
                      <p></p>
                      <p>meas</p>
                      <p>pred</p>
                      <p>percent</p>
                    </div>
                    <div className='simple-result-table-vc'>
                      <p>{item.results[0].title}({item.results[0].unit})</p>
                      <p>{item.results[0].meas?item.results[0].meas:"-"}</p>
                      <p>{item.results[0].pred?item.results[0].pred:"-"}</p>
                      <p>{item.results[0].per?item.results[0].per:"-"}</p>
                    </div>
                    <div className='simple-result-table-ic'>
                      <p>{item.results[1].title}({item.results[1].unit})</p>
                      <p>{item.results[1].meas?item.results[1].meas:"-"}</p>
                      <p>{item.results[1].pred?item.results[1].pred:"-"}</p>
                      <p>{item.results[1].per?item.results[1].per:"-"}</p>
                    </div>
                    <div className='simple-result-table-FEV1per'>
                      <p>FEV1%</p>
                      <p>{item.results[2].meas?item.results[2].meas:"-"}</p>
                      <p>{item.results[2].pred?item.results[2].pred:"-"}</p>
                      <p>{item.results[2].per?item.results[2].per:"-"}</p>
                    </div>
                    <div className='simple-result-table-PEF'>
                      <p>PEF(L/s)</p>
                      <p>{item.results[3].meas?item.results[3].meas:"-"}</p>
                      <p>{item.results[3].pred?item.results[3].pred:"-"}</p>
                      <p>{item.results[3].per?item.results[3].per:"-"}</p>
                    </div>
                    <div className='simple-result-table-PEF'>
                      <p>-</p>
                      <p>-</p>
                      <p>-</p>
                      <p>-</p>
                    </div>
                  </div>
                </div>
                ))
                // svcTrials.map((item,index)=>{
                // })
            }
            </div> 
          </div>
        </div>
      </div>
  );
}
export default ResultPageCopy;