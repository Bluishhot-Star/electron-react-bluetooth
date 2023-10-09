import { useState, useRef, useEffect} from 'react';
import axios from 'axios';
import { Cookies, useCookies } from 'react-cookie';
import Alert from "../components/Alerts.js"
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FaBluetoothB } from "react-icons/fa6";
import {} from "@fortawesome/fontawesome-svg-core"

import { debounce } from 'lodash'
import {registerables,Chart as ChartJS,RadialLinearScale,LineElement,Tooltip,Legend,} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { useLocation } from 'react-router-dom';

const MeasurementPage = () =>{

  const cookies = new Cookies();
  const [setCookie] = useCookies();
  let navigatorR = useNavigate();

// function handleCharacteristicValueChanged(event) {
//   const value = event.target.value;
//   // 데이터 처리 및 UART 프로토콜 해석
//   console.log('Received data:', value);
  
//   let measurementData = document.createElement("div");
//   let measurementDataContents = document.createElement("p");

//   let item = document.getElementsByClassName("data");

//   console.log(item);
//   measurementDataContents.appendChild(document.createTextNode(value)) 
//   item[0].appendChild(measurementData);
// }
// 기기 연결 PAST************************************************************************

  const [device, setDevice] = useState(undefined);
  const bleDeviceList = document.getElementById("deviceList");

  ChartJS.register(RadialLinearScale, LineElement, Tooltip, Legend, ...registerables);
  const location = useLocation();
  const navigator = useNavigate();
  const state = location.state;
  const [FvcSvc, setFvcSvc] = useState("fvc"); //fvc, svc
  const [info, setInfo] = useState();
  const [tvMax, setTvMax] = useState([10]);


  let trials;

  // let colorList = ['rgb(5,128,190)','rgb(158,178,243)','rgb(83, 225, 232)','rgb(67,185,162)','rgb(106,219,182)','rgb(255,189,145)','rgb(255,130,130)','rgb(236,144,236)','rgb(175,175,175)','rgb(97,97,97)'];

  const updateData = ()=>{
    let patientDate = location.state;
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

  // //그래프 선택
  // const selectGraph=(index)=>{
  //   console.log("HE!!!!");
  //   let temp;
  //   //처음 눌렀을때
  //   if(trigger == 0){
  //     temp = [...graphOnOff].fill(0); //0으로 바꾸기 (선택효과 끄기)
  //   }
  //   else{ //처음 아닐때
  //     temp = [...graphOnOff];
  //   }

  //   if (temp[index] == 1){
  //     temp[index] = 0;
  //     setTrigger(trigger-1);
  //   }
  //   else if(temp[index] == 0){
  //     temp[index] = 1;
  //     setTrigger(trigger+1);
  //   }
  //   setGraphOnOff(temp);
  // }

  // //svc 그래프 선택
  // const selectSvcGraph=(index)=>{
  //   console.log("SVC!!!!");
  //   let temp;
  //   //처음 눌렀을때
  //   if(svcTrigger == 0){
  //     temp = [...svcGraphOnOff].fill(0); //0으로 바꾸기 (선택효과 끄기)
  //   }
  //   else{ //처음 아닐때
  //     temp = [...svcGraphOnOff];
  //   }

  //   if (temp[index] == 1){
  //     temp[index] = 0;
  //     setSvcTrigger(svcTrigger-1);
  //   }
  //   else if(temp[index] == 0){
  //     temp[index] = 1;
  //     setSvcTrigger(svcTrigger+1);
  //   }
  //   setSvcGraphOnOff(temp);
  // }

  // useEffect(()=>{
  //   /**
  //    * allTimeVolumeList -> 전체 리스트
  //    * timeVolume -> 보여줄 리스트
  //    */
    
  //   // 누른거 없을떄 onoff[1,1,1, ...]
  //   console.log("Trigger : "+trigger);
  //   if(trigger == 0){
  //     console.log("ALLLLL : ",allTimeVolumeList);
  //     let temp = [...graphOnOff].fill(0);
  //     setGraphOnOff(temp);
  //     setTimeVolume(allTimeVolumeList);
  //     setVolumeFlow(allVolumeFlowList);
  //     return;
  //   }
  //   // 누른거 있을때
  //   let temp = [...allTimeVolumeList];
  //   let temp2 = [...allVolumeFlowList];
  //   graphOnOff.forEach((item, index)=>{
  //     if(item == 0){
  //       temp[index] = [{x: 0, y: 0}];
  //       temp2[index] = [{x: 0, y: 0}];
  //     }
  //     else if(item == 1){
  //       temp[index] = allTimeVolumeList[index];
  //       temp2[index] = allVolumeFlowList[index];
  //     }
  //   })
  //   setTimeVolume(temp);
  //   setVolumeFlow(temp2);
  //   console.log(temp);

  //   /////////////////////////
  // },[trigger])

  // useEffect(()=>{
  //   /**
  //    * allTimeVolumeList -> 전체 리스트
  //    * timeVolume -> 보여줄 리스트
  //    */
    
  //   // 누른거 없을떄 onoff[1,1,1, ...]
  //   console.log("SVCTrigger : "+svcTrigger);
  //   if(svcTrigger == 0){
  //     console.log("SVCALLLLL : ",allSvcGraph);
  //     let temp = [...svcGraphOnOff].fill(0);
  //     setSvcGraphOnOff(temp);
  //     setSvcGraph(allSvcGraph);
  //     return;
  //   }
  //   // 누른거 있을때
  //   let temp = [...allSvcGraph];
  //   svcGraphOnOff.forEach((item, index)=>{
  //     if(item == 0){
  //       temp[index] = [{x: 0, y: 0}];
  //     }
  //     else if(item == 1){
  //       temp[index] = allSvcGraph[index];
  //     }
  //   })
  //   setSvcGraph(temp);
  //   console.log(temp);

  //   /////////////////////////
  // },[svcTrigger])

  const report = (date)=>{
    
  }


  // useEffect(()=>{
  // //   console.log(location.state);
  //   console.log(123123123);
  //   //svc의 심플카드
  //   let svcGraphList = [];
  //   let svcMaxList = [];

  //   if(trials){
  //     console.log(trials.length);
  //     let temp = new Array(trials.length).fill(0);
  //     setSvcGraphOnOff(temp);
  // // 
  //     // 매 결과에서 데이터 추출
  //     trials.forEach((item)=>{
  //       svcGraphList.push(item.graph.timeVolume);

  //       //현 svc 최대값 찾기
  //       svcMaxList.push(parseFloat(item.results[0].meas));
  //     })
  //     setSvcGraph(svcGraphList);
  //     setAllSvcGraph(svcGraphList);
  //     setSvcMax(svcMaxList);
  //     setSvcTrigger(0);
  //   }
  // },[])


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
        max: parseInt(Math.max(...tvMax)),
        // suggestedMax: 6.0,
        ticks:{
          autoSkip: false,
          // stepSize : 0.1,
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

  const graphOption2={
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
  }
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
    console.log("VOLVUEEJF : ",volumeFlow)
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
              borderColor: 'rgb(5,128,190)',
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
            console.log(data);
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
              borderColor: 'rgb(5,128,190)',
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


  const graphStyle = {width:"0px" ,height:"0px", transition:"none"}

  const chartRef = useRef();



  class DataCalculateStrategyE {
    constructor() {
        this.FREQUENCY = 80_000_000; // 80MHz
        this.LIMIT_DATA = 100_000_000;
        this.COEFFICIENT = 0.035;
        this.SLOPE_ZOOM = 7;
        this.A = -50.719;
        this.B = 1.823;
    }
    
    analyze(data, inhaleCoefficient, exhaleCoefficient) {
        const useData = this.insertZeroBetweenInversionData(this.convertAll(data));
        const result = [];

        let calibratedLps = 0;

        result.push(new FluidMetrics(0, 0, 0));
        for (let i = 1; i < useData.length; i++) {
            const previous = useData[i - 1];
            const current = useData[i];
            const time = this.getTime(current);
            const lps = this.getCalibratedLPS(
                calibratedLps,
                previous,
                current,
                inhaleCoefficient,
                exhaleCoefficient
            );
            calibratedLps = lps;
            const volume = this.getVolume(lps, time);

            const metrics = new FluidMetrics(time, lps, volume);
            metrics.setExhale(this.isExhale(current));

            result.push(metrics);
        }

        return result;
    }

    getStrategy() {
        return 'E';
    }

    // DONE!
    getTime(value) {
        const body = this.getBody(value);
        const time = body * (1 / this.FREQUENCY);

        if (time === 0) return 0;
        return time;
    }

    // DONE!
    insertZeroBetweenInversionData(data) {
        const result = [];

        result.push(0);
        data.unshift(0);
        for (let i = 1; i < data.length; i++) {
            const current = data[i];
            let inversion = true;

            if (this.getBody(current) !== 0) {
                for (let j = i - 1; j >= 0; j--) {
                    const past = data[j];

                    if (this.isExhale(past) !== this.isExhale(current)) {
                        break;
                    }

                    if (this.getBody(past) !== 0) {
                        inversion = false;
                        break;
                    }
                }
            }

            if (inversion) {
                result.push(this.getZero(this.isExhale(current)));
            } else {
                result.push(current);
            }
        }

        return result;
    }


    getCalibratedLPS(
        calibratedPreLps,
        previous,
        current,
        inhale,
        exhale
    ) {
        const time = this.getTime(current);
        if (time === 0) return 0;

        const previousLps = this.getLps(previous, inhale, exhale);
        const currentLps = this.getLps(current, inhale, exhale);
        let calibratedLps = 0;

        // 기울기
        const slope = (currentLps - previousLps) / time;
        if (slope >= 0) {
            calibratedLps = currentLps;
        } else {
            if (Math.abs(calibratedPreLps) === 0) return 0;
            const predSlope = this.A * Math.pow(currentLps, this.B);
            calibratedLps = currentLps - (currentLps * ((slope / predSlope) * this.SLOPE_ZOOM));
            if (calibratedLps < 0) return 0;
        }

        if (!this.isExhale(current)) return -calibratedLps;
        else return calibratedLps;
    }

    // DONE
    getZero(isExhale) {
        if (isExhale) return 0;
        else return this.LIMIT_DATA;
    }

    // DONE
    getLps(data, inhaleGain, exhaleGain) {
        const time = this.getTime(data);
        if (time === 0) return 0;
        const rps = 1 / time;

        const isExhale = this.isExhale(data);

        if (isExhale) return (rps * this.COEFFICIENT) * exhaleGain;
        else return (rps * this.COEFFICIENT) * inhaleGain;
    }
    
    // DONE
    getVolume(lps, time) {
        return Math.abs(lps) * time;
    }

    // DONE
    isExhale(data) {
        const head = Math.floor(data / this.LIMIT_DATA);
        return !(head === 1);
    }

    // DONE
    convert(data) {
        if (data.length === 10) return parseInt(data.substring(0, 9));
        else if (data.length === 9) return parseInt(data);
        else return 0;
    }

    // DONE
    convertAll(allData) {
        const data = allData.split(" ");
        const result = [];

        for (let i = 0; i < data.length; i++) {
            const value = this.convert(data[i]);
            result.push(value);
        }

        return result;
    }
    
    // DONE
    getHead(data) {
        return Math.floor(data / this.LIMIT_DATA);
    }

    // DONE
    getBody(data) {
        return data % this.LIMIT_DATA;
    }
}

  class FluidMetrics {
    constructor(time, lps, volume) {
        this.time = time;
        this.lps = lps;
        this.volume = volume;
        this.exhale = false;
    }

    setExhale(value) {
        this.exhale = value;
    }
  }

  const dataCalculateStrategyE = new DataCalculateStrategyE();

  const data = `
  051189094 100000000 105156788 103454191 102933040 102739453 102700824 102714417 102744787 102758563 102708975 102657879 102625315 102594377 102563120 102524324 102487741 102452658 102414031 102364680 102303600 102229198 102165904 102128781 102103674 102069091 102045507 102053374 102081678 102125881 102168674 102209604 102259184 102306534 102353163 102383953 102357042 102309097 102266684 102209966 102138998 102073796 102027566 101979363 101916871 101842277 101774152 101727213 101694930 101657644 101616649 101583826 101564872 101554927 101550102 101544306 101541841 101547002 101557000 101572459 101588924 101597934 101609550 101618960 101642664 101672457 101704015 101737768 101762260 101768067 101751864 101717802 101683384 101664621 101659075 101653951 101635416 101609863 101600257 101596890 101589638 101584962 101579792 101596510 101677839 102123326 102694695 103392122 104231436 105246823 106512687 108061659 110080936 112737067 116432118 122225784 134131812 009066170 002339206 001992207 001924457 001976743 002118538 002269155 002264848 002063489 001857111 001740087 001707361 001772400 001910409 002092193 002280590 002434823 002504523 002501889 002448873 002364743 002248037 002107979 001990767 001918648 001866732 001835681 001824968 001832316 001834117 001819031 001812345 001831399 001862389 001887929 001914119 001949350 001982064 002006564 002036715 002070031 002085537 002090612 002106870 002119844 002125997 002143307 002182097 002225925 002263033 002326627 002431527 002521422 002589436 002650777 002660892 002612311 002513820 002366985 002221106 002102416 001986612 001899893 001855295 001832078 001802789 001759393 001734804 001730100 001734135 001733283 001736291 001766051 001824416 001898336 001972016 002050736 002138136 002217042 002287494 002332677 002360655 002381627 002391142 002396727 002444400 002870110 003540227 004333193 005331109 006547103 008113830 010124956 012832594 016688366 126026561 105148819 103127044 102294567 101920977 101733826 101618807 101533770 101444747 101362392 101288839 101230522 101183804 101139857 101099521 101062975 101034327 101006910 100985323 100963610 100946580 100935683 100927630 100919867 100913060 100908928 100909864 100914475 100918016 100920861 100920633 100918620 100915685 100912307 100903545 100894253 100885487 100879260 100874118 100868981 100864759 100862641 100863564 100863123 100860826 100856867 100852443 100850556 100847910 100843057 100838312 100833824 100829943 100826834 100826264 100827288 100825987 100825372 100826289 100826269 100827655 100831860 100840750 100854477 100869467 100882893 100892669 100899827 100910377 100920966 100931484 100938638 100943828 100949775 100957990 100965521 100972489 100979610 100989294 101007529 101036049 101075728 101124918 101184987 101259950 101343127 101427504 101505358 101603524 102194161 102831292 103592808 104494927 105623645 106982359 108656136 110841789 113729562 006611520 001533079 001176185 001029415 000958385 000913153 000879544 000856169 000840491 000826114 000812187 000798438 000784931 000772068 000761109 000750647 000739936 000731593 000723227 000718097 000714697 000712948 000711261 000712100 000715817 000722585 000732204 000744314 000756442 000766919 000775203 000776906 000775249 000769490 000762331 000755343 000749575 000744477 000743915 000745364 000746493 000744775 000742940 000738870 000736716 000736053 000740482 000747584 000757697 000770265 000781543 000790332 000795527 000798595 000799411 000802227 000806273 000811535 000819128 000825962 000832468 000837439 000839723 000838772 000838879 000840576 000847408 000857164 000869529 000884550 000898517 000914331 000927174 000941592 000959908 000981515 001007180 001035281 001064225 001093633 001127252 001163336 001201920 001242736 001290187 001344932 001407323 001477645 001608988 001964613 002403151 002928597 003541927 004310862 005292287 006526519 008097485 010128267 105766011 101643377 101212672 101021464 100892437 100796220 100723797 100668034 100623007 100587155 100557386 100534139 100516142 100500957 100488440 100477731 100468619 100461333 100455035 100449555 100445286 100441375 100438783 100436215 100434897 100433873 100433226 100433301 100433008 100433619 100433702 100434306 100434645 100435098 100436194 100436884 100437155 100438627 100439638 100441079 100442008 100444179 100444876 100445475 100445431 100445527 100444728 100444708 100443223 100443059 100442420 100441342 100441221 100441496 100441373 100442013 100442589 100443188 100443878 100443980 100445326 100447073 100449688 100452523 100455561 100460027 100463626 100467141 100472631 100480842 100491451 100503008 100513785 100524817 100536784 100549260 100559414 100569547 100578381 100584809 100591268 100598238 100604687 100611049 100616375 100623222 100629297 100637362 100652146 100903509 101358392 101936234 102516953 103205714 104009757 104962244 106093109 107578389 109423473 007370769 001118023 000841976 000710714 000632534 000581696 000543535 000516484 000496095 000478280 000461956 000447706 000436628 000427297 000418540 000410501 000404767 000398254 000392242 000387355 000383326 000379404 000375404 000372203 000368312 000364908 000360814 000356931 000353662 000351361 000348911 000346619 000345568 000344650 000344944 000345464 000347319 000349090 000351755 000354403 000357760 000361033 000364702 000368151 000372895 000377944 000383953 000391055 000399069 000408004 000418623 000429790 000442508 000456539 000471691 000488254 000505923 000522580 000538195 000553977 000566185 000576542 000585748 000592536 000599730 000606069 000611708 000616547 000619296 000618861 000616680 000613007 000607330 000603240 000600622 000600642 000602677 000607309 000614439 000622091 000632054 000643069 000655655 000672717 000693464 000718339 000747600 000852980 001084767 001331367 001607417 001945626 002358348 002844274 003438316 004189441 005092141 006249712 007693921 009584402 012096363 015606257 021098855 032346105
  `; // 여기에 분석할 데이터를 넣으세요
  const inhaleCoefficient = 1.0364756559407444; // 흡기 계수
  const exhaleCoefficient = 1.0581318835872322; // 호기 계수

  const dataResult = dataCalculateStrategyE.analyze(data, inhaleCoefficient, exhaleCoefficient);

  const [dataset, setDataset] = useState()
  // 데이터 핸들링 함수
  let b;
  let func = (arr) =>{
    // 결과 arr
      let result = [];
  
      let prefix = 1;
      arr.forEach((item, idx)=>{
        if (idx == 0) result.push(item)
        else{
        let temp = {...item};
        if (result.time !== 0 && temp.exhale !== result[idx-1].exhale) prefix *= -1;
        // 시간 스택
        temp.time += result[idx-1].time;
        // volume 스택
        temp.volume = result[idx-1].volume + (prefix * temp.volume)
        
        result.push(temp);
        }
      })
      
      return result;
    }
  b = func(dataResult)
  console.log(b);
  let c = [
    {
        "time": 0,
        "lps": 0,
        "volume": 0,
        "exhale": false
    },
    {
        "time": 0,
        "lps": 0,
        "volume": 0,
        "exhale": true
    },
    {
        "time": 0,
        "lps": 0,
        "volume": 0,
        "exhale": true
    },
    {
        "time": 0,
        "lps": 0,
        "volume": 0,
        "exhale": true
    },
    {
        "time": 0,
        "lps": 0,
        "volume": 0,
        "exhale": false
    },
    {
        "time": 0,
        "lps": 0,
        "volume": 0,
        "exhale": false
    },
    {
        "time": 0.0431773875,
        "lps": -0.8401770013974573,
        "volume": 0.03627664795792605,
        "exhale": false
    },
    {
        "time": 0.0798403875,
        "lps": -0.9894620723324893,
        "volume": 0.0725532959158521,
        "exhale": false
    },
    {
        "time": 0.11408355,
        "lps": -1.0593836932533922,
        "volume": 0.10882994387377817,
        "exhale": false
    },
    {
        "time": 0.14784385,
        "lps": -1.074535710817915,
        "volume": 0.1451065918317042,
        "exhale": false
    },
    {
        "time": 0.1817740625,
        "lps": -1.0484390347245613,
        "volume": 0.18068035107320346,
        "exhale": false
    },
    {
        "time": 0.2160839,
        "lps": -1.0118720477515364,
        "volume": 0.2153975166023509,
        "exhale": false
    },
    {
        "time": 0.2505659375,
        "lps": -1.031775014105743,
        "volume": 0.25097522133030814,
        "exhale": false
    },
    {
        "time": 0.28442812500000003,
        "lps": -1.0713025541520627,
        "volume": 0.2872518692882342,
        "exhale": false
    },
    {
        "time": 0.3176516125,
        "lps": -1.091897650959312,
        "volume": 0.3235285172461603,
        "exhale": false
    },
    {
        "time": 0.35046805000000003,
        "lps": -1.1054413800378564,
        "volume": 0.35980516520408634,
        "exhale": false
    },
    {
        "time": 0.3828977625,
        "lps": -1.1186237916209112,
        "volume": 0.3960818131620124,
        "exhale": false
    },
    {
        "time": 0.4149367625,
        "lps": -1.1322653003503875,
        "volume": 0.4323584611199385,
        "exhale": false
    },
    {
        "time": 0.4464908125,
        "lps": -1.1496669352405178,
        "volume": 0.46863510907786454,
        "exhale": false
    },
    {
        "time": 0.477587575,
        "lps": -1.1665731427162573,
        "volume": 0.5049117570357906,
        "exhale": false
    },
    {
        "time": 0.5082458,
        "lps": -1.1832598905489817,
        "volume": 0.5411884049937167,
        "exhale": false
    },
    {
        "time": 0.5384211875,
        "lps": -1.2021932761568037,
        "volume": 0.5774650529516427,
        "exhale": false
    },
    {
        "time": 0.5679796875,
        "lps": -1.2272831151082113,
        "volume": 0.6137417009095688,
        "exhale": false
    },
    {
        "time": 0.5967746875000001,
        "lps": -1.2598245514126085,
        "volume": 0.6500183488674949,
        "exhale": false
    },
    {
        "time": 0.6246396625,
        "lps": -1.3018726181497042,
        "volume": 0.6862949968254209,
        "exhale": false
    },
    {
        "time": 0.6517134625000001,
        "lps": -1.3399171138859731,
        "volume": 0.722571644783347,
        "exhale": false
    },
    {
        "time": 0.6783232250000001,
        "lps": -1.3632834174271966,
        "volume": 0.7588482927412731,
        "exhale": false
    },
    {
        "time": 0.7046191500000001,
        "lps": -1.3795539787220288,
        "volume": 0.7951249406991991,
        "exhale": false
    },
    {
        "time": 0.7304827875000001,
        "lps": -1.4026119859561927,
        "volume": 0.8314015886571252,
        "exhale": false
    },
    {
        "time": 0.7560516250000001,
        "lps": -1.4187836251032555,
        "volume": 0.8676782366150513,
        "exhale": false
    },
    {
        "time": 0.7817188000000002,
        "lps": -1.391361633023646,
        "volume": 0.903390559138155,
        "exhale": false
    },
    {
        "time": 0.8077397750000002,
        "lps": -1.3165910938761056,
        "volume": 0.9376495430771278,
        "exhale": false
    },
    {
        "time": 0.8343132875000001,
        "lps": -1.248611683764924,
        "volume": 0.970829541263301,
        "exhale": false
    },
    {
        "time": 0.8614217125000001,
        "lps": -1.2302982237754956,
        "volume": 1.0041809883901522,
        "exhale": false
    },
    {
        "time": 0.8890417625000001,
        "lps": -1.2144462432034517,
        "volume": 1.0377240543497437,
        "exhale": false
    },
    {
        "time": 0.9172815625000001,
        "lps": -1.1699600393076497,
        "volume": 1.0707634918677837,
        "exhale": false
    },
    {
        "time": 0.9461132375000001,
        "lps": -1.1537300398075845,
        "volume": 1.104027461413253,
        "exhale": false
    },
    {
        "time": 0.9755277750000001,
        "lps": -1.1348478361913417,
        "volume": 1.1374084856476971,
        "exhale": false
    },
    {
        "time": 1.0053271875,
        "lps": -1.154613658294104,
        "volume": 1.1718152943293372,
        "exhale": false
    },
    {
        "time": 1.0347902125000001,
        "lps": -1.231260128853913,
        "volume": 1.2080919422872631,
        "exhale": false
    },
    {
        "time": 1.0636539250000001,
        "lps": -1.2568254329004303,
        "volume": 1.244368590245189,
        "exhale": false
    },
    {
        "time": 1.091987475,
        "lps": -1.280342490013643,
        "volume": 1.280645238203115,
        "exhale": false
    },
    {
        "time": 1.11961205,
        "lps": -1.3132020296394085,
        "volume": 1.316921886161041,
        "exhale": false
    },
    {
        "time": 1.146349525,
        "lps": -1.3567716457117234,
        "volume": 1.353198534118967,
        "exhale": false
    },
    {
        "time": 1.172271975,
        "lps": -1.3994297590669886,
        "volume": 1.389475182076893,
        "exhale": false
    },
    {
        "time": 1.19761655,
        "lps": -1.431337789563489,
        "volume": 1.4257518300348189,
        "exhale": false
    },
    {
        "time": 1.2223585875,
        "lps": -1.4661948498754824,
        "volume": 1.4620284779927448,
        "exhale": false
    },
    {
        "time": 1.246319475,
        "lps": -1.5139943358911918,
        "volume": 1.4983051259506708,
        "exhale": false
    },
    {
        "time": 1.2693479374999999,
        "lps": -1.5752961344217427,
        "volume": 1.5345817739085967,
        "exhale": false
    },
    {
        "time": 1.2915248375,
        "lps": -1.6357853423123185,
        "volume": 1.5708584218665227,
        "exhale": false
    },
    {
        "time": 1.3131149999999998,
        "lps": -1.6802396905500854,
        "volume": 1.6071350698244486,
        "exhale": false
    },
    {
        "time": 1.3343016249999997,
        "lps": -1.712242887100992,
        "volume": 1.6434117177823746,
        "exhale": false
    },
    {
        "time": 1.3550221749999998,
        "lps": -1.7507570000760624,
        "volume": 1.6796883657403006,
        "exhale": false
    },
    {
        "time": 1.3752302874999998,
        "lps": -1.7951527119579356,
        "volume": 1.7159650136982265,
        "exhale": false
    },
    {
        "time": 1.3950281124999997,
        "lps": -1.8323552187134728,
        "volume": 1.7522416616561525,
        "exhale": false
    },
    {
        "time": 1.4145890124999998,
        "lps": -1.8545490216670018,
        "volume": 1.7885183096140784,
        "exhale": false
    },
    {
        "time": 1.4340255999999998,
        "lps": -1.8664103437872548,
        "volume": 1.8247949575720044,
        "exhale": false
    },
    {
        "time": 1.4534018749999997,
        "lps": -1.8722199162597588,
        "volume": 1.8610716055299303,
        "exhale": false
    },
    {
        "time": 1.4727056999999997,
        "lps": -1.879246623812952,
        "volume": 1.8973482534878563,
        "exhale": false
    },
    {
        "time": 1.4919787124999997,
        "lps": -1.8822510470496536,
        "volume": 1.9336249014457823,
        "exhale": false
    },
    {
        "time": 1.5113162374999998,
        "lps": -1.8492672763957432,
        "volume": 1.9693851536347668,
        "exhale": false
    },
    {
        "time": 1.5307787374999997,
        "lps": -1.812755225351543,
        "volume": 2.0046659022081714,
        "exhale": false
    },
    {
        "time": 1.5504344749999996,
        "lps": -1.7678980645040583,
        "volume": 2.039415242490821,
        "exhale": false
    },
    {
        "time": 1.5702960249999995,
        "lps": -1.7455288909555826,
        "volume": 2.07408415183498,
        "exhale": false
    },
    {
        "time": 1.5902701999999995,
        "lps": -1.7726312439374095,
        "volume": 2.1094909985118537,
        "exhale": false
    },
    {
        "time": 1.6103895749999995,
        "lps": -1.7477193973051195,
        "volume": 2.1446540204610094,
        "exhale": false
    },
    {
        "time": 1.6306265749999995,
        "lps": -1.7483789821334417,
        "volume": 2.180035965922444,
        "exhale": false
    },
    {
        "time": 1.6511598749999996,
        "lps": -1.657879127611888,
        "volume": 2.214077695413437,
        "exhale": false
    },
    {
        "time": 1.6720655874999997,
        "lps": -1.6032440949134668,
        "volume": 2.2475946555290207,
        "exhale": false
    },
    {
        "time": 1.6933657749999997,
        "lps": -1.5687668315762078,
        "volume": 2.281009683185375,
        "exhale": false
    },
    {
        "time": 1.7150878749999998,
        "lps": -1.5322221535848817,
        "volume": 2.3142927660277612,
        "exhale": false
    },
    {
        "time": 1.7371161249999998,
        "lps": -1.5503685128308478,
        "volume": 2.3484446712205274,
        "exhale": false
    },
    {
        "time": 1.7592169624999998,
        "lps": -1.6189507161432004,
        "volume": 2.384224837918517,
        "exhale": false
    },
    {
        "time": 1.7811152624999997,
        "lps": -1.6565965375360672,
        "volume": 2.420501485876443,
        "exhale": false
    },
    {
        "time": 1.8025877874999998,
        "lps": -1.689444904962321,
        "volume": 2.456778133834369,
        "exhale": false
    },
    {
        "time": 1.8236300874999998,
        "lps": -1.7239868245356287,
        "volume": 2.493054781792295,
        "exhale": false
    },
    {
        "time": 1.8444378499999998,
        "lps": -1.7434189744296658,
        "volume": 2.5293314297502207,
        "exhale": false
    },
    {
        "time": 1.8651762874999998,
        "lps": -1.7492469217088347,
        "volume": 2.5656080777081467,
        "exhale": false
    },
    {
        "time": 1.8858506749999997,
        "lps": -1.7546661519199087,
        "volume": 2.6018847256660727,
        "exhale": false
    },
    {
        "time": 1.9062933749999997,
        "lps": -1.7745526744474096,
        "volume": 2.6381613736239986,
        "exhale": false
    },
    {
        "time": 1.9264166624999997,
        "lps": -1.8027197572924434,
        "volume": 2.6744380215819246,
        "exhale": false
    },
    {
        "time": 1.9464198749999997,
        "lps": -1.8135410978574598,
        "volume": 2.7107146695398505,
        "exhale": false
    },
    {
        "time": 1.9663809999999997,
        "lps": -1.817364900922471,
        "volume": 2.7469913174977765,
        "exhale": false
    },
    {
        "time": 1.9862514749999998,
        "lps": -1.8256558012793385,
        "volume": 2.7832679654557024,
        "exhale": false
    },
    {
        "time": 2.0060634999999998,
        "lps": -1.8310419029819547,
        "volume": 2.8195446134136284,
        "exhale": false
    },
    {
        "time": 2.0258108999999997,
        "lps": -1.8370341390727927,
        "volume": 2.8558212613715543,
        "exhale": false
    },
    {
        "time": 2.0457672749999998,
        "lps": -1.7364452006701772,
        "volume": 2.8904744129630786,
        "exhale": false
    },
    {
        "time": 2.0667402624999998,
        "lps": -1.3603148782110226,
        "volume": 2.9190042798998626,
        "exhale": false
    },
    {
        "time": 2.0932818374999997,
        "lps": 0,
        "volume": 2.9190042798998626,
        "exhale": false
    },
    {
        "time": 2.1269655249999997,
        "lps": 0,
        "volume": 2.9190042798998626,
        "exhale": false
    },
    {
        "time": 2.1693670499999995,
        "lps": 0,
        "volume": 2.9190042798998626,
        "exhale": false
    },
    {
        "time": 2.2222599999999995,
        "lps": 0,
        "volume": 2.9190042798998626,
        "exhale": false
    },
    {
        "time": 2.2878452874999993,
        "lps": 0,
        "volume": 2.9190042798998626,
        "exhale": false
    },
    {
        "time": 2.369253874999999,
        "lps": 0,
        "volume": 2.9190042798998626,
        "exhale": false
    },
    {
        "time": 2.470024612499999,
        "lps": 0,
        "volume": 2.9190042798998626,
        "exhale": false
    },
    {
        "time": 2.596036312499999,
        "lps": 0,
        "volume": 2.9190042798998626,
        "exhale": false
    },
    {
        "time": 2.7552496499999988,
        "lps": 0,
        "volume": 2.9190042798998626,
        "exhale": false
    },
    {
        "time": 2.9606511249999987,
        "lps": 0,
        "volume": 2.9190042798998626,
        "exhale": false
    },
    {
        "time": 3.2384734249999987,
        "lps": 0,
        "volume": 2.9190042798998626,
        "exhale": false
    },
    {
        "time": 3.6651210749999987,
        "lps": 0,
        "volume": 2.9190042798998626,
        "exhale": false
    },
    {
        "time": 3.6651210749999987,
        "lps": 0,
        "volume": 2.9190042798998626,
        "exhale": true
    },
    {
        "time": 3.694361149999999,
        "lps": 1.2665704833367606,
        "volume": 2.8819696639743095,
        "exhale": true
    },
    {
        "time": 3.719263737499999,
        "lps": 1.4871794316776572,
        "volume": 2.8449350480487565,
        "exhale": true
    },
    {
        "time": 3.743319449999999,
        "lps": 1.539535190468922,
        "volume": 2.8079004321232035,
        "exhale": true
    },
    {
        "time": 3.768028737499999,
        "lps": 1.3357895434065785,
        "volume": 2.7748940242556768,
        "exhale": true
    },
    {
        "time": 3.794510462499999,
        "lps": 1.0017864316978349,
        "volume": 2.7483649914627235,
        "exhale": true
    },
    {
        "time": 3.822874899999999,
        "lps": 0.9430158949035675,
        "volume": 2.721616876050225,
        "exhale": true
    },
    {
        "time": 3.8511854999999993,
        "lps": 1.3081536924527608,
        "volume": 2.684582260124672,
        "exhale": true
    },
    {
        "time": 3.876979112499999,
        "lps": 1.435805702886834,
        "volume": 2.647547644199119,
        "exhale": true
    },
    {
        "time": 3.900192999999999,
        "lps": 1.5953646680485176,
        "volume": 2.610513028273566,
        "exhale": true
    },
    {
        "time": 3.921944087499999,
        "lps": 1.702655829302932,
        "volume": 2.573478412348013,
        "exhale": true
    },
    {
        "time": 3.943286099999999,
        "lps": 1.735291642508087,
        "volume": 2.5364437964224598,
        "exhale": true
    },
    {
        "time": 3.965441099999999,
        "lps": 1.4117185928193958,
        "volume": 2.505167170998546,
        "exhale": true
    },
    {
        "time": 3.9893212124999993,
        "lps": 1.064484854653905,
        "volume": 2.479747152914865,
        "exhale": true
    },
    {
        "time": 4.015473624999999,
        "lps": 0.8820484646051403,
        "volume": 2.45667945762352,
        "exhale": true
    },
    {
        "time": 4.043981,
        "lps": 0.8425002494891152,
        "volume": 2.43266198707374,
        "exhale": true
    },
    {
        "time": 4.074416287499999,
        "lps": 0.8993153246142311,
        "volume": 2.40529106661595,
        "exhale": true
    },
    {
        "time": 4.105722824999999,
        "lps": 1.0529583434987557,
        "volume": 2.3723265867492684,
        "exhale": true
    },
    {
        "time": 4.136996437499999,
        "lps": 1.1842129183366052,
        "volume": 2.3352919708237154,
        "exhale": true
    },
    {
        "time": 4.167607349999999,
        "lps": 1.2098501122942065,
        "volume": 2.2982573548981624,
        "exhale": true
    },
    {
        "time": 4.197166637499999,
        "lps": 1.2528927135186574,
        "volume": 2.2612227389726094,
        "exhale": true
    },
    {
        "time": 4.225267099999999,
        "lps": 1.317936170109411,
        "volume": 2.2241881230470564,
        "exhale": true
    },
    {
        "time": 4.251616837499999,
        "lps": 1.4055022721024502,
        "volume": 2.1871535071215034,
        "exhale": true
    },
    {
        "time": 4.276501424999999,
        "lps": 1.4882551670005835,
        "volume": 2.1501188911959503,
        "exhale": true
    },
    {
        "time": 4.300484524999999,
        "lps": 1.5441963685075377,
        "volume": 2.1130842752703973,
        "exhale": true
    },
    {
        "time": 4.323818674999999,
        "lps": 1.58714227540121,
        "volume": 2.0760496593448443,
        "exhale": true
    },
    {
        "time": 4.3467646874999994,
        "lps": 1.613989181150892,
        "volume": 2.0390150434192913,
        "exhale": true
    },
    {
        "time": 4.3695767875,
        "lps": 1.6234636848669406,
        "volume": 2.0019804274937383,
        "exhale": true
    },
    {
        "time": 4.3924807375,
        "lps": 1.5905370314785456,
        "volume": 1.9655508468516052,
        "exhale": true
    },
    {
        "time": 4.4154072,
        "lps": 1.60892426057009,
        "volume": 1.9286639051263048,
        "exhale": true
    },
    {
        "time": 4.4381450875,
        "lps": 1.6287623872513721,
        "volume": 1.8916292892007518,
        "exhale": true
    },
    {
        "time": 4.4607994,
        "lps": 1.634771124727494,
        "volume": 1.8545946732751988,
        "exhale": true
    },
    {
        "time": 4.4836918875,
        "lps": 1.5487456143461154,
        "volume": 1.8191400336581005,
        "exhale": true
    },
    {
        "time": 4.50697175,
        "lps": 1.4819319469007852,
        "volume": 1.784640861699893,
        "exhale": true
    },
    {
        "time": 4.5305708625,
        "lps": 1.4824617200731525,
        "volume": 1.7496560807909431,
        "exhale": true
    },
    {
        "time": 4.55449735,
        "lps": 1.4613970545556711,
        "volume": 1.71468998243258,
        "exhale": true
    },
    {
        "time": 4.578864225,
        "lps": 1.407605521468674,
        "volume": 1.680391034641643,
        "exhale": true
    },
    {
        "time": 4.603640025,
        "lps": 1.39441060753875,
        "volume": 1.6458433963113845,
        "exhale": true
    },
    {
        "time": 4.628722075,
        "lps": 1.403665230636022,
        "volume": 1.6106365948133103,
        "exhale": true
    },
    {
        "time": 4.6541810125,
        "lps": 1.3676349783219686,
        "volume": 1.5758180613773975,
        "exhale": true
    },
    {
        "time": 4.6800564,
        "lps": 1.3383017368959624,
        "volume": 1.5411889853432914,
        "exhale": true
    },
    {
        "time": 4.7061256125,
        "lps": 1.3784266790811979,
        "volume": 1.5052544873306544,
        "exhale": true
    },
    {
        "time": 4.7322582625,
        "lps": 1.4035081085518633,
        "volume": 1.4685771011577065,
        "exhale": true
    },
    {
        "time": 4.7585941375,
        "lps": 1.362952854772816,
        "volume": 1.4326825451435163,
        "exhale": true
    },
    {
        "time": 4.7850921875,
        "lps": 1.363603768153284,
        "volume": 1.3965497043148023,
        "exhale": true
    },
    {
        "time": 4.81166715,
        "lps": 1.3776041625579767,
        "volume": 1.3599399253549802,
        "exhale": true
    },
    {
        "time": 4.8384584875,
        "lps": 1.337917773459231,
        "volume": 1.3240953187389854,
        "exhale": true
    },
    {
        "time": 4.8657347,
        "lps": 1.2610931232312808,
        "volume": 1.2896974747274403,
        "exhale": true
    },
    {
        "time": 4.8935587625,
        "lps": 1.2262273124241392,
        "volume": 1.255578849347344,
        "exhale": true
    },
    {
        "time": 4.921846674999999,
        "lps": 1.2238940837690657,
        "volume": 1.2209574405964172,
        "exhale": true
    },
    {
        "time": 4.950929512499999,
        "lps": 1.134232194417929,
        "volume": 1.187970749998892,
        "exhale": true
    },
    {
        "time": 4.9813236,
        "lps": 1.0064608986488637,
        "volume": 1.1573802893800298,
        "exhale": true
    },
    {
        "time": 5.012841375,
        "lps": 1.0084572532140115,
        "volume": 1.1255959605761126,
        "exhale": true
    },
    {
        "time": 5.045209325,
        "lps": 1.026382880739275,
        "volume": 1.0923740508114876,
        "exhale": true
    },
    {
        "time": 5.0783440375,
        "lps": 1.0170647602456473,
        "volume": 1.0586739023868668,
        "exhale": true
    },
    {
        "time": 5.1116051875,
        "lps": 1.0973118843897445,
        "volume": 1.0221760472033967,
        "exhale": true
    },
    {
        "time": 5.144259075000001,
        "lps": 1.1341564132464514,
        "volume": 0.9851414312778436,
        "exhale": true
    },
    {
        "time": 5.175681825000001,
        "lps": 1.1785924505510539,
        "volume": 0.9481068153522905,
        "exhale": true
    },
    {
        "time": 5.205269137500001,
        "lps": 1.2517059778766026,
        "volume": 0.9110721994267373,
        "exhale": true
    },
    {
        "time": 5.233032962500001,
        "lps": 1.3339161994268849,
        "volume": 0.8740375835011842,
        "exhale": true
    },
    {
        "time": 5.259313162500002,
        "lps": 1.4092212359705456,
        "volume": 0.8370029675756311,
        "exhale": true
    },
    {
        "time": 5.284145812500001,
        "lps": 1.491367853433006,
        "volume": 0.799968351650078,
        "exhale": true
    },
    {
        "time": 5.307894475000001,
        "lps": 1.5594400705956866,
        "volume": 0.7629337357245248,
        "exhale": true
    },
    {
        "time": 5.331085662500001,
        "lps": 1.5969262430202478,
        "volume": 0.7258991197989717,
        "exhale": true
    },
    {
        "time": 5.353986637500001,
        "lps": 1.6171632834651422,
        "volume": 0.6888645038734186,
        "exhale": true
    },
    {
        "time": 5.376521500000001,
        "lps": 1.6434365164443818,
        "volume": 0.6518298879478654,
        "exhale": true
    },
    {
        "time": 5.398513912500001,
        "lps": 1.6839724121013613,
        "volume": 0.6147952720223123,
        "exhale": true
    },
    {
        "time": 5.4201989625000015,
        "lps": 1.707840928453157,
        "volume": 0.5777606560967592,
        "exhale": true
    },
    {
        "time": 5.441825212500001,
        "lps": 1.7124844078632742,
        "volume": 0.5407260401712061,
        "exhale": true
    },
    {
        "time": 5.463501900000002,
        "lps": 1.6921737912524084,
        "volume": 0.5040453177025374,
        "exhale": true
    },
    {
        "time": 5.485167937500002,
        "lps": 1.70933960238706,
        "volume": 0.4670107017769842,
        "exhale": true
    },
    {
        "time": 5.506871575000002,
        "lps": 1.6942477430814178,
        "volume": 0.430239362925952,
        "exhale": true
    },
    {
        "time": 5.528947212500002,
        "lps": 1.5601894137330172,
        "volume": 0.39579718699704436,
        "exhale": true
    },
    {
        "time": 5.551752412500002,
        "lps": 1.4060262423935963,
        "volume": 0.36373247733400993,
        "exhale": true
    },
    {
        "time": 5.575481612500002,
        "lps": 1.3057422163245374,
        "volume": 0.3327482591344017,
        "exhale": true
    },
    {
        "time": 5.600131812500002,
        "lps": 1.2688590262175719,
        "volume": 0.3014706303663333,
        "exhale": true
    },
    {
        "time": 5.6257660125000015,
        "lps": 1.2153497599081657,
        "volume": 0.2703161115508954,
        "exhale": true
    },
    {
        "time": 5.652492712500002,
        "lps": 1.1525164874072449,
        "volume": 0.2395131491469082,
        "exhale": true
    },
    {
        "time": 5.6802057375000015,
        "lps": 1.142894471494626,
        "volume": 0.20784008608601584,
        "exhale": true
    },
    {
        "time": 5.708799412500001,
        "lps": 1.1346344913428394,
        "volume": 0.1753967161967684,
        "exhale": true
    },
    {
        "time": 5.737957875000001,
        "lps": 1.1725810647332715,
        "volume": 0.1412060551925332,
        "exhale": true
    },
    {
        "time": 5.767466062500001,
        "lps": 1.1966626728744414,
        "volume": 0.10589470866710303,
        "exhale": true
    },
    {
        "time": 5.797236400000001,
        "lps": 1.201201645945585,
        "volume": 0.07013453026174746,
        "exhale": true
    },
    {
        "time": 5.827125675000001,
        "lps": 1.2198990883924408,
        "volume": 0.03367263093653649,
        "exhale": true
    },
    {
        "time": 5.857084762500001,
        "lps": 1.225001448078397,
        "volume": -0.0030272946340709136,
        "exhale": true
    },
    {
        "time": 5.887639762500001,
        "lps": 1.119106818914091,
        "volume": -0.03722160348599096,
        "exhale": true
    },
    {
        "time": 5.923516137500001,
        "lps": 0.3585279005152777,
        "volume": -0.05008428489283975,
        "exhale": true
    },
    {
        "time": 5.967768975000001,
        "lps": 0.13130018539671207,
        "volume": -0.05589469066092032,
        "exhale": true
    },
    {
        "time": 6.021933887500001,
        "lps": 0.15014741508482166,
        "volume": -0.06402741226109086,
        "exhale": true
    },
    {
        "time": 6.088572750000001,
        "lps": 0.12588853839577252,
        "volume": -0.07241648126157271,
        "exhale": true
    },
    {
        "time": 6.170411537500001,
        "lps": 0.1182348183754135,
        "volume": -0.08209267543769927,
        "exhale": true
    },
    {
        "time": 6.2718344125000005,
        "lps": 0.09269656261929915,
        "volume": -0.09149422732116612,
        "exhale": true
    },
    {
        "time": 6.398396362500001,
        "lps": 0.0751634020687714,
        "volume": -0.10100705405562387,
        "exhale": true
    },
    {
        "time": 6.5588037875000005,
        "lps": 0.053369918657750565,
        "volume": -0.10956798527997309,
        "exhale": true
    },
    {
        "time": 6.7674083625,
        "lps": 0.031140873602267832,
        "volume": -0.1160641139829029,
        "exhale": true
    },
    {
        "time": 6.7674083625,
        "lps": 0,
        "volume": -0.1160641139829029,
        "exhale": false
    },
    {
        "time": 6.8317686,
        "lps": -0.5636500014147098,
        "volume": -0.07978746602497683,
        "exhale": false
    },
    {
        "time": 6.87085665,
        "lps": -0.9280751523272729,
        "volume": -0.04351081806705077,
        "exhale": false
    },
    {
        "time": 6.8995387375,
        "lps": -1.2647840906951442,
        "volume": -0.007234170109124707,
        "exhale": false
    },
    {
        "time": 6.92355095,
        "lps": -1.510758242620336,
        "volume": 0.02904247784880136,
        "exhale": false
    },
    {
        "time": 6.945223775,
        "lps": -1.6738310745334795,
        "volume": 0.06531912580672741,
        "exhale": false
    },
    {
        "time": 6.965458862499999,
        "lps": -1.792759628932964,
        "volume": 0.10159577376465347,
        "exhale": false
    },
    {
        "time": 6.984630987499999,
        "lps": -1.8921558229943765,
        "volume": 0.13787242172257952,
        "exhale": false
    },
    {
        "time": 7.002690325,
        "lps": -2.008747439263819,
        "volume": 0.17414906968050559,
        "exhale": false
    },
    {
        "time": 7.0197202249999995,
        "lps": -2.1301738681921827,
        "volume": 0.21042571763843165,
        "exhale": false
    },
    {
        "time": 7.035830712499999,
        "lps": -2.251741169094111,
        "volume": 0.24670236559635772,
        "exhale": false
    },
    {
        "time": 7.051212237499999,
        "lps": -2.3584558720885,
        "volume": 0.2829790135542838,
        "exhale": false
    },
    {
        "time": 7.066009787499999,
        "lps": -2.4515306897375617,
        "volume": 0.31925566151220985,
        "exhale": false
    },
    {
        "time": 7.080257999999999,
        "lps": -2.5460490540779106,
        "volume": 0.3555323094701359,
        "exhale": false
    },
    {
        "time": 7.094002012499999,
        "lps": -2.639451030616136,
        "volume": 0.391808957428062,
        "exhale": false
    },
    {
        "time": 7.1072891999999985,
        "lps": -2.7301976402399726,
        "volume": 0.42808560538598806,
        "exhale": false
    },
    {
        "time": 7.120218287499998,
        "lps": -2.805816571194685,
        "volume": 0.4643622533439141,
        "exhale": false
    },
    {
        "time": 7.132804662499998,
        "lps": -2.8822157259676486,
        "volume": 0.5006389013018402,
        "exhale": false
    },
    {
        "time": 7.145121199999998,
        "lps": -2.9453608985419852,
        "volume": 0.5369155492597663,
        "exhale": false
    },
    {
        "time": 7.157166324999999,
        "lps": -3.01172864191331,
        "volume": 0.5731921972176923,
        "exhale": false
    },
    {
        "time": 7.168998574999999,
        "lps": -3.065912903963833,
        "volume": 0.6094688451756184,
        "exhale": false
    },
    {
        "time": 7.180694612499999,
        "lps": -3.1016186428887615,
        "volume": 0.6457454931335445,
        "exhale": false
    },
    {
        "time": 7.192289987499999,
        "lps": -3.128544610064449,
        "volume": 0.6820221410914705,
        "exhale": false
    },
    {
        "time": 7.203788324999999,
        "lps": -3.1549472224072446,
        "volume": 0.7182987890493966,
        "exhale": false
    },
    {
        "time": 7.215201574999999,
        "lps": -3.1784678297527926,
        "volume": 0.7545754370073227,
        "exhale": false
    },
    {
        "time": 7.226563174999999,
        "lps": -3.192917191058131,
        "volume": 0.7908520849652487,
        "exhale": false
    },
    {
        "time": 7.237936474999999,
        "lps": -3.1742881774709453,
        "volume": 0.826954216694079,
        "exhale": false
    },
    {
        "time": 7.249367412499999,
        "lps": -3.098484641748225,
        "volume": 0.8623728009786128,
        "exhale": false
    },
    {
        "time": 7.2608426124999985,
        "lps": -3.104213617152019,
        "volume": 0.8979942730781556,
        "exhale": false
    },
    {
        "time": 7.272353374999999,
        "lps": -3.106012091567768,
        "volume": 0.9337468405863204,
        "exhale": false
    },
    {
        "time": 7.283861287499999,
        "lps": -3.1523221920505615,
        "volume": 0.9700234885442465,
        "exhale": false
    },
    {
        "time": 7.295344037499999,
        "lps": -3.1592299717337795,
        "volume": 1.0063001365021724,
        "exhale": false
    },
    {
        "time": 7.306790099999999,
        "lps": -3.1693560958562004,
        "volume": 1.0425767844600984,
        "exhale": false
    },
    {
        "time": 7.3181939374999985,
        "lps": -3.18109127369853,
        "volume": 1.0788534324180243,
        "exhale": false
    },
    {
        "time": 7.329488249999998,
        "lps": -3.2119394569546453,
        "volume": 1.1151300803759503,
        "exhale": false
    },
    {
        "time": 7.340666412499998,
        "lps": -3.2453140628368984,
        "volume": 1.1514067283338763,
        "exhale": false
    },
    {
        "time": 7.351734999999998,
        "lps": -3.2774414944929564,
        "volume": 1.1876833762918022,
        "exhale": false
    },
    {
        "time": 7.362725749999998,
        "lps": -3.300652635891642,
        "volume": 1.2239600242497282,
        "exhale": false
    },
    {
        "time": 7.373652224999998,
        "lps": -3.3200687282884975,
        "volume": 1.2602366722076541,
        "exhale": false
    },
    {
        "time": 7.384514487499998,
        "lps": -3.3396953864746006,
        "volume": 1.29651332016558,
        "exhale": false
    },
    {
        "time": 7.395323974999998,
        "lps": -3.3560007315727094,
        "volume": 1.332789968123506,
        "exhale": false
    },
    {
        "time": 7.4061069874999985,
        "lps": -3.364240555032841,
        "volume": 1.369066616081432,
        "exhale": false
    },
    {
        "time": 7.4169015374999985,
        "lps": -3.3436908032484616,
        "volume": 1.4051602536416377,
        "exhale": false
    },
    {
        "time": 7.427690574999999,
        "lps": -3.362361837923546,
        "volume": 1.4414369015995636,
        "exhale": false
    },
    {
        "time": 7.4384508999999985,
        "lps": -3.3713338545003113,
        "volume": 1.4777135495574896,
        "exhale": false
    },
    {
        "time": 7.449161737499998,
        "lps": -3.3869104967679755,
        "volume": 1.5139901975154155,
        "exhale": false
    },
    {
        "time": 7.459817274999998,
        "lps": -3.4044878503713263,
        "volume": 1.5502668454733415,
        "exhale": false
    },
    {
        "time": 7.470449224999998,
        "lps": -3.41204087283387,
        "volume": 1.5865434934312674,
        "exhale": false
    },
    {
        "time": 7.481048099999998,
        "lps": -3.422688536087657,
        "volume": 1.6228201413891934,
        "exhale": false
    },
    {
        "time": 7.491586312499998,
        "lps": -3.442391008714814,
        "volume": 1.6590967893471193,
        "exhale": false
    },
    {
        "time": 7.502065212499998,
        "lps": -3.461875574528439,
        "volume": 1.6953734373050453,
        "exhale": false
    },
    {
        "time": 7.512488012499998,
        "lps": -3.480508880332162,
        "volume": 1.7316500852629713,
        "exhale": false
    },
    {
        "time": 7.522862299999998,
        "lps": -3.496784522110657,
        "volume": 1.7679267332208972,
        "exhale": false
    },
    {
        "time": 7.533197724999998,
        "lps": -3.5099328724194763,
        "volume": 1.8042033811788232,
        "exhale": false
    },
    {
        "time": 7.5435260249999985,
        "lps": -3.5123542071711764,
        "volume": 1.8404800291367491,
        "exhale": false
    },
    {
        "time": 7.553867124999998,
        "lps": -3.4873520567751215,
        "volume": 1.8765430854910663,
        "exhale": false
    },
    {
        "time": 7.564191962499998,
        "lps": -3.5135320975197972,
        "volume": 1.9128197334489923,
        "exhale": false
    },
    {
        "time": 7.574509112499998,
        "lps": -3.5161500955133986,
        "volume": 1.9490963814069182,
        "exhale": false
    },
    {
        "time": 7.584837724999998,
        "lps": -3.493705213470823,
        "volume": 1.9851815087460882,
        "exhale": false
    },
    {
        "time": 7.595166087499998,
        "lps": -3.512332952868962,
        "volume": 2.021458156704014,
        "exhale": false
    },
    {
        "time": 7.605511774999998,
        "lps": -3.4785095556634675,
        "volume": 2.0574457295326725,
        "exhale": false
    },
    {
        "time": 7.615910024999998,
        "lps": -3.404599194795452,
        "volume": 2.0928476031099543,
        "exhale": false
    },
    {
        "time": 7.626419399999998,
        "lps": -3.277078928977491,
        "volume": 2.127287654479177,
        "exhale": false
    },
    {
        "time": 7.637100362499998,
        "lps": -3.1344354309209272,
        "volume": 2.1607664417755146,
        "exhale": false
    },
    {
        "time": 7.647968699999998,
        "lps": -3.0620766452178136,
        "volume": 2.1940461242066096,
        "exhale": false
    },
    {
        "time": 7.659004862499998,
        "lps": -3.0486863409257667,
        "volume": 2.227691922076597,
        "exhale": false
    },
    {
        "time": 7.670163224999998,
        "lps": -3.0823363405728377,
        "volume": 2.262085748311632,
        "exhale": false
    },
    {
        "time": 7.681411062499998,
        "lps": -3.104158222605213,
        "volume": 2.297000815573784,
        "exhale": false
    },
    {
        "time": 7.692790774999998,
        "lps": -3.0132496483393862,
        "volume": 2.3312907302626127,
        "exhale": false
    },
    {
        "time": 7.704302849999998,
        "lps": -2.9803236311033143,
        "volume": 2.3656004394281465,
        "exhale": false
    },
    {
        "time": 7.715946399999997,
        "lps": -2.9500658527357335,
        "volume": 2.3999496786877677,
        "exhale": false
    },
    {
        "time": 7.7276793749999975,
        "lps": -2.981532349556545,
        "volume": 2.434931923206806,
        "exhale": false
    },
    {
        "time": 7.739477224999997,
        "lps": -2.995941255072038,
        "volume": 2.4702775887429573,
        "exhale": false
    },
    {
        "time": 7.751349412499997,
        "lps": -2.966337899435077,
        "volume": 2.5054945084734066,
        "exhale": false
    },
    {
        "time": 7.763324287499997,
        "lps": -2.90810169974052,
        "volume": 2.540318662815087,
        "exhale": false
    },
    {
        "time": 7.775393299999997,
        "lps": -2.8965368291788645,
        "volume": 2.575277002013157,
        "exhale": false
    },
    {
        "time": 7.787549412499996,
        "lps": -2.884799420921577,
        "volume": 2.6103449483138146,
        "exhale": false
    },
    {
        "time": 7.799794537499996,
        "lps": -2.862513820313368,
        "volume": 2.6453967878577793,
        "exhale": false
    },
    {
        "time": 7.812160712499996,
        "lps": -2.800056550483023,
        "volume": 2.6800227771709486,
        "exhale": false
    },
    {
        "time": 7.824754824999997,
        "lps": -2.6368521213516876,
        "volume": 2.7132315894331156,
        "exhale": false
    },
    {
        "time": 7.837705437499997,
        "lps": -2.439153848884443,
        "volume": 2.7448201257579017,
        "exhale": false
    },
    {
        "time": 7.851152037499997,
        "lps": -2.2292492944121403,
        "volume": 2.774795949320144,
        "exhale": false
    },
    {
        "time": 7.865213512499997,
        "lps": -2.049070009363637,
        "volume": 2.8036088960300605,
        "exhale": false
    },
    {
        "time": 7.880025849999997,
        "lps": -1.866058610882308,
        "volume": 2.8312495859692306,
        "exhale": false
    },
    {
        "time": 7.895775224999998,
        "lps": -1.660777914813591,
        "volume": 2.857405800141348,
        "exhale": false
    },
    {
        "time": 7.912564312499998,
        "lps": -1.5387506603111123,
        "volume": 2.8832400196179937,
        "exhale": false
    },
    {
        "time": 7.930408112499998,
        "lps": -1.4820923437801534,
        "volume": 2.909686178981938,
        "exhale": false
    },
    {
        "time": 7.949225087499998,
        "lps": -1.4785646765511293,
        "volume": 2.937508293536484,
        "exhale": false
    },
    {
        "time": 7.969269137499998,
        "lps": -1.3111159088873243,
        "volume": 2.9637883663700166,
        "exhale": false
    },
    {
        "time": 7.996696149999997,
        "lps": 0,
        "volume": 2.9637883663700166,
        "exhale": false
    },
    {
        "time": 8.032087299999997,
        "lps": 0,
        "volume": 2.9637883663700166,
        "exhale": false
    },
    {
        "time": 8.076997399999996,
        "lps": 0,
        "volume": 2.9637883663700166,
        "exhale": false
    },
    {
        "time": 8.133183987499995,
        "lps": 0,
        "volume": 2.9637883663700166,
        "exhale": false
    },
    {
        "time": 8.203479549999996,
        "lps": 0,
        "volume": 2.9637883663700166,
        "exhale": false
    },
    {
        "time": 8.290759037499996,
        "lps": 0,
        "volume": 2.9637883663700166,
        "exhale": false
    },
    {
        "time": 8.398960737499996,
        "lps": 0,
        "volume": 2.9637883663700166,
        "exhale": false
    },
    {
        "time": 8.534483099999996,
        "lps": 0,
        "volume": 2.9637883663700166,
        "exhale": false
    },
    {
        "time": 8.706102624999996,
        "lps": 0,
        "volume": 2.9637883663700166,
        "exhale": false
    },
    {
        "time": 8.706102624999996,
        "lps": 0,
        "volume": 2.9637883663700166,
        "exhale": true
    },
    {
        "time": 8.725266112499996,
        "lps": 1.9325613840149467,
        "volume": 2.9267537504444636,
        "exhale": true
    },
    {
        "time": 8.739968424999997,
        "lps": 2.5189653617791845,
        "volume": 2.8897191345189106,
        "exhale": true
    },
    {
        "time": 8.752836112499997,
        "lps": 2.878109677869713,
        "volume": 2.8526845185933576,
        "exhale": true
    },
    {
        "time": 8.764815924999997,
        "lps": 3.091418661648764,
        "volume": 2.8156499026678046,
        "exhale": true
    },
    {
        "time": 8.776230337499998,
        "lps": 3.244548585006292,
        "volume": 2.7786152867422516,
        "exhale": true
    },
    {
        "time": 8.787224637499998,
        "lps": 3.3685287763252894,
        "volume": 2.7415806708166985,
        "exhale": true
    },
    {
        "time": 8.797926749999998,
        "lps": 3.4604958530900447,
        "volume": 2.7045460548911455,
        "exhale": true
    },
    {
        "time": 8.808432887499999,
        "lps": 3.525045805421177,
        "volume": 2.6675114389655925,
        "exhale": true
    },
    {
        "time": 8.8187593125,
        "lps": 3.5863927666693103,
        "volume": 2.6304768230400395,
        "exhale": true
    },
    {
        "time": 8.828911649999998,
        "lps": 3.6478905400409642,
        "volume": 2.5934422071144865,
        "exhale": true
    },
    {
        "time": 8.838892125,
        "lps": 3.710706747479768,
        "volume": 2.5564075911889335,
        "exhale": true
    },
    {
        "time": 8.8487037625,
        "lps": 3.774560151203419,
        "volume": 2.5193729752633804,
        "exhale": true
    },
    {
        "time": 8.8583546125,
        "lps": 3.8374460203560448,
        "volume": 2.4823383593378274,
        "exhale": true
    },
    {
        "time": 8.867868475,
        "lps": 3.8927003544094876,
        "volume": 2.4453037434122744,
        "exhale": true
    },
    {
        "time": 8.8772515625,
        "lps": 3.9469541262993797,
        "volume": 2.4082691274867214,
        "exhale": true
    },
    {
        "time": 8.886500762499999,
        "lps": 4.004088561773249,
        "volume": 2.3712345115611684,
        "exhale": true
    },
    {
        "time": 8.895645674999999,
        "lps": 4.04975071391368,
        "volume": 2.3341998956356154,
        "exhale": true
    },
    {
        "time": 8.9046860125,
        "lps": 4.096596606659112,
        "volume": 2.2971652797100623,
        "exhale": true
    },
    {
        "time": 8.913662225,
        "lps": 4.125862208092014,
        "volume": 2.2601306637845093,
        "exhale": true
    },
    {
        "time": 8.922595937499999,
        "lps": 4.145490010513897,
        "volume": 2.2230960478589563,
        "exhale": true
    },
    {
        "time": 8.9315077875,
        "lps": 4.155659703154018,
        "volume": 2.1860614319334033,
        "exhale": true
    },
    {
        "time": 8.94039855,
        "lps": 4.1655162788965665,
        "volume": 2.1490268160078503,
        "exhale": true
    },
    {
        "time": 8.949299799999999,
        "lps": 4.137068790930948,
        "volume": 2.112201732432576,
        "exhale": true
    },
    {
        "time": 8.958247512499998,
        "lps": 4.0354758711407,
        "volume": 2.076093454536922,
        "exhale": true
    },
    {
        "time": 8.967279824999999,
        "lps": 3.9147747735016902,
        "volume": 2.040733985415538,
        "exhale": true
    },
    {
        "time": 8.976432374999998,
        "lps": 3.7892862553365836,
        "volume": 2.006052353499257,
        "exhale": true
    },
    {
        "time": 8.985736299999997,
        "lps": 3.667235019961575,
        "volume": 1.971932673916161,
        "exhale": true
    },
    {
        "time": 8.995191824999997,
        "lps": 3.613870975314559,
        "volume": 1.9377616265622997,
        "exhale": true
    },
    {
        "time": 9.004778312499997,
        "lps": 3.609919596936075,
        "volume": 1.9031551774702669,
        "exhale": true
    },
    {
        "time": 9.014468349999998,
        "lps": 3.626872272057912,
        "volume": 1.8680106491463155,
        "exhale": true
    },
    {
        "time": 9.024179674999997,
        "lps": 3.7739812913455464,
        "volume": 1.8313602902821393,
        "exhale": true
    },
    {
        "time": 9.033870287499997,
        "lps": 3.8217002202444,
        "volume": 1.794325674356586,
        "exhale": true
    },
    {
        "time": 9.043488912499997,
        "lps": 3.850302504313573,
        "volume": 1.7572910584310328,
        "exhale": true
    },
    {
        "time": 9.053018049999997,
        "lps": 3.8864604404704135,
        "volume": 1.7202564425054796,
        "exhale": true
    },
    {
        "time": 9.062459837499997,
        "lps": 3.9224157423107786,
        "volume": 1.6832218265799264,
        "exhale": true
    },
    {
        "time": 9.071829524999997,
        "lps": 3.9525988380672388,
        "volume": 1.6461872106543733,
        "exhale": true
    },
    {
        "time": 9.081135487499996,
        "lps": 3.9796652872341935,
        "volume": 1.6091525947288203,
        "exhale": true
    },
    {
        "time": 9.090434424999996,
        "lps": 3.982671775732779,
        "volume": 1.5721179788032673,
        "exhale": true
    },
    {
        "time": 9.099751474999996,
        "lps": 3.9380931543840503,
        "volume": 1.5354265679792134,
        "exhale": true
    },
    {
        "time": 9.109082637499997,
        "lps": 3.940323218348224,
        "volume": 1.4986587717262831,
        "exhale": true
    },
    {
        "time": 9.118392324999997,
        "lps": 3.978072940209124,
        "volume": 1.4616241558007301,
        "exhale": true
    },
    {
        "time": 9.127679074999996,
        "lps": 3.9878984494632816,
        "volume": 1.4245895398751771,
        "exhale": true
    },
    {
        "time": 9.136914949999996,
        "lps": 4.009865435116124,
        "volume": 1.387554923949624,
        "exhale": true
    },
    {
        "time": 9.146123899999996,
        "lps": 4.021589423935751,
        "volume": 1.350520308024071,
        "exhale": true
    },
    {
        "time": 9.155324562499995,
        "lps": 4.025211872031294,
        "volume": 1.313485692098518,
        "exhale": true
    },
    {
        "time": 9.164580587499994,
        "lps": 3.8864565930470407,
        "volume": 1.2775125527118598,
        "exhale": true
    },
    {
        "time": 9.173925387499994,
        "lps": 3.782376454767248,
        "volume": 1.242167001217351,
        "exhale": true
    },
    {
        "time": 9.183396599999993,
        "lps": 3.659294448100168,
        "volume": 1.207509045899324,
        "exhale": true
    },
    {
        "time": 9.193024912499993,
        "lps": 3.5446398208870122,
        "volume": 1.17338014600388,
        "exhale": true
    },
    {
        "time": 9.202794199999992,
        "lps": 3.529047796643165,
        "volume": 1.1389038634772313,
        "exhale": true
    },
    {
        "time": 9.212673349999992,
        "lps": 3.5502599026738797,
        "volume": 1.1038303133597307,
        "exhale": true
    },
    {
        "time": 9.222617437499991,
        "lps": 3.6091485070554308,
        "volume": 1.0679406248050771,
        "exhale": true
    },
    {
        "time": 9.232599874999991,
        "lps": 3.642730706905811,
        "volume": 1.031577293194059,
        "exhale": true
    },
    {
        "time": 9.242592512499991,
        "lps": 3.6883947420752814,
        "volume": 0.9947205015795947,
        "exhale": true
    },
    {
        "time": 9.25262034999999,
        "lps": 3.63208473991764,
        "volume": 0.9582985460214708,
        "exhale": true
    },
    {
        "time": 9.26269876249999,
        "lps": 3.58769026717707,
        "volume": 0.9221403235866251,
        "exhale": true
    },
    {
        "time": 9.27284294999999,
        "lps": 3.5391550582832028,
        "volume": 0.8862384710838269,
        "exhale": true
    },
    {
        "time": 9.28308204999999,
        "lps": 3.458636572868421,
        "volume": 0.8508251453505699,
        "exhale": true
    },
    {
        "time": 9.29340657499999,
        "lps": 3.4472328377521158,
        "volume": 0.8152341037363772,
        "exhale": true
    },
    {
        "time": 9.30381242499999,
        "lps": 3.428224384301778,
        "volume": 0.7795605150269905,
        "exhale": true
    },
    {
        "time": 9.31428041249999,
        "lps": 3.439430746581523,
        "volume": 0.7435565969646595,
        "exhale": true
    },
    {
        "time": 9.32477694999999,
        "lps": 3.483442460624594,
        "volume": 0.7069925125476212,
        "exhale": true
    },
    {
        "time": 9.33526159999999,
        "lps": 3.532270121134528,
        "volume": 0.6699578966220681,
        "exhale": true
    },
    {
        "time": 9.34574758749999,
        "lps": 3.5297203769351495,
        "volume": 0.6329452928710309,
        "exhale": true
    },
    {
        "time": 9.356254787499989,
        "lps": 3.491479777566482,
        "volume": 0.5962596165521843,
        "exhale": true
    },
    {
        "time": 9.36684738749999,
        "lps": 3.364108297683532,
        "volume": 0.5606249629981417,
        "exhale": true
    },
    {
        "time": 9.377561937499989,
        "lps": 3.2717772089046084,
        "volume": 0.5255693425044728,
        "exhale": true
    },
    {
        "time": 9.388431049999989,
        "lps": 3.179764074428099,
        "volume": 0.49100812905605545,
        "exhale": true
    },
    {
        "time": 9.399487924999988,
        "lps": 3.0823917620603485,
        "volume": 0.4569265086419244,
        "exhale": true
    },
    {
        "time": 9.410719387499988,
        "lps": 3.057743325251284,
        "volume": 0.4225835791497393,
        "exhale": true
    },
    {
        "time": 9.422148524999988,
        "lps": 2.9786678997326588,
        "volume": 0.38853997415685854,
        "exhale": true
    },
    {
        "time": 9.433738199999988,
        "lps": 2.9900260054191943,
        "volume": 0.35388654451250184,
        "exhale": true
    },
    {
        "time": 9.445508099999987,
        "lps": 2.923188126520234,
        "volume": 0.3194809125821714,
        "exhale": true
    },
    {
        "time": 9.457506949999987,
        "lps": 2.813369898805716,
        "volume": 0.2857237091718864,
        "exhale": true
    },
    {
        "time": 9.469775887499987,
        "lps": 2.7106672578829833,
        "volume": 0.2524667020016237,
        "exhale": true
    },
    {
        "time": 9.482365637499987,
        "lps": 2.5946756720965607,
        "volume": 0.21980038395884602,
        "exhale": true
    },
    {
        "time": 9.495306649999987,
        "lps": 2.5033764619224623,
        "volume": 0.18740415787290166,
        "exhale": true
    },
    {
        "time": 9.508609462499987,
        "lps": 2.4362808040157122,
        "volume": 0.1549947711397314,
        "exhale": true
    },
    {
        "time": 9.522279874999986,
        "lps": 2.3763038208566725,
        "volume": 0.12250971768329458,
        "exhale": true
    },
    {
        "time": 9.536370524999986,
        "lps": 2.27104487926311,
        "volume": 0.09050921915530583,
        "exhale": true
    },
    {
        "time": 9.550912224999987,
        "lps": 2.188305907569571,
        "volume": 0.058687531139201395,
        "exhale": true
    },
    {
        "time": 9.565936224999987,
        "lps": 2.1075958982852137,
        "volume": 0.027023010363364346,
        "exhale": true
    },
    {
        "time": 9.581470424999987,
        "lps": 2.032202513565605,
        "volume": -0.004545629922866473,
        "exhale": true
    },
    {
        "time": 9.597597762499987,
        "lps": 1.9178262203367624,
        "volume": -0.0354750606445868,
        "exhale": true
    },
    {
        "time": 9.614409412499986,
        "lps": 1.8023060323877764,
        "volume": -0.06577479885397877,
        "exhale": true
    },
    {
        "time": 9.632000949999986,
        "lps": 1.6900397021161842,
        "volume": -0.09550519565024446,
        "exhale": true
    },
    {
        "time": 9.650471512499985,
        "lps": 1.5827614326653168,
        "volume": -0.12473968961487873,
        "exhale": true
    },
    {
        "time": 9.670583862499985,
        "lps": 1.161820194823147,
        "volume": -0.14810662401023006,
        "exhale": true
    },
    {
        "time": 9.695141524999984,
        "lps": 0.17220963408747147,
        "volume": -0.15233569008339867,
        "exhale": true
    },
    {
        "time": 9.725180912499985,
        "lps": 0.16858150957161433,
        "volume": -0.15739977537475536,
        "exhale": true
    },
    {
        "time": 9.761788374999984,
        "lps": 0.18563713659577596,
        "volume": -0.1641954798912926,
        "exhale": true
    },
    {
        "time": 9.806062462499984,
        "lps": 0.2039459397768133,
        "volume": -0.17322500027424095,
        "exhale": true
    },
    {
        "time": 9.859948237499983,
        "lps": 0.16695354510583504,
        "volume": -0.18222142144126632,
        "exhale": true
    },
    {
        "time": 9.926101824999984,
        "lps": 0.1312076226442877,
        "volume": -0.1909012763865322,
        "exhale": true
    },
    {
        "time": 10.007683312499983,
        "lps": 0.11088993366102051,
        "volume": -0.19994784212337458,
        "exhale": true
    },
    {
        "time": 10.108901874999983,
        "lps": 0.09118363593751466,
        "volume": -0.20917731867649314,
        "exhale": true
    },
    {
        "time": 10.235505212499984,
        "lps": 0.07258382122363838,
        "volume": -0.2183666726919091,
        "exhale": true
    },
    {
        "time": 10.235505212499984,
        "lps": 0,
        "volume": -0.2183666726919091,
        "exhale": false
    },
    {
        "time": 10.256047424999984,
        "lps": -1.7659562210217645,
        "volume": -0.18209002473398306,
        "exhale": false
    },
    {
        "time": 10.271205824999985,
        "lps": -2.3931713081806825,
        "volume": -0.145813376776057,
        "exhale": false
    },
    {
        "time": 10.283974124999984,
        "lps": -2.841149405788246,
        "volume": -0.10953672881813092,
        "exhale": false
    },
    {
        "time": 10.295129587499984,
        "lps": -3.251917879507556,
        "volume": -0.07326008086020487,
        "exhale": false
    },
    {
        "time": 10.305082337499984,
        "lps": -3.6448868863305175,
        "volume": -0.03698343290227881,
        "exhale": false
    },
    {
        "time": 10.314129799999984,
        "lps": -4.009593624502568,
        "volume": -0.0007067849443527507,
        "exhale": false
    },
    {
        "time": 10.322480224999984,
        "lps": -4.344287621040373,
        "volume": 0.03556986301357331,
        "exhale": false
    },
    {
        "time": 10.330267812499983,
        "lps": -4.658265214731271,
        "volume": 0.07184651097149937,
        "exhale": false
    },
    {
        "time": 10.337607249999984,
        "lps": -4.9427013933868995,
        "volume": 0.10812315892942542,
        "exhale": false
    },
    {
        "time": 10.344574574999983,
        "lps": -5.206682329003751,
        "volume": 0.1443998068873515,
        "exhale": false
    },
    {
        "time": 10.351251312499983,
        "lps": -5.433289530691607,
        "volume": 0.18067645484527756,
        "exhale": false
    },
    {
        "time": 10.357703087499983,
        "lps": -5.62273916215709,
        "volume": 0.21695310280320362,
        "exhale": false
    },
    {
        "time": 10.363965049999983,
        "lps": -5.793175535293617,
        "volume": 0.2532297507611297,
        "exhale": false
    },
    {
        "time": 10.370070549999983,
        "lps": -5.941634257296873,
        "volume": 0.28950639871905576,
        "exhale": false
    },
    {
        "time": 10.376042187499984,
        "lps": -6.074824193184207,
        "volume": 0.3257830466769818,
        "exhale": false
    },
    {
        "time": 10.381899924999983,
        "lps": -6.192945306601065,
        "volume": 0.3620596946349079,
        "exhale": false
    },
    {
        "time": 10.387666587499982,
        "lps": -6.290752746138007,
        "volume": 0.39833634259283396,
        "exhale": false
    },
    {
        "time": 10.393354524999982,
        "lps": -6.377821127240948,
        "volume": 0.43461299055076,
        "exhale": false
    },
    {
        "time": 10.398973962499982,
        "lps": -6.455565696375494,
        "volume": 0.4708896385086861,
        "exhale": false
    },
    {
        "time": 10.404540037499983,
        "lps": -6.51745582981294,
        "volume": 0.5071662864666121,
        "exhale": false
    },
    {
        "time": 10.410057224999983,
        "lps": -6.575206653376573,
        "volume": 0.5434429344245382,
        "exhale": false
    },
    {
        "time": 10.415542012499984,
        "lps": -6.6140480297415465,
        "volume": 0.5797195823824642,
        "exhale": false
    },
    {
        "time": 10.420994699999984,
        "lps": -6.652984965290246,
        "volume": 0.6159962303403903,
        "exhale": false
    },
    {
        "time": 10.426430912499983,
        "lps": -6.673147519146108,
        "volume": 0.6522728782983164,
        "exhale": false
    },
    {
        "time": 10.431854324999984,
        "lps": -6.688897065809776,
        "volume": 0.6885495262562424,
        "exhale": false
    },
    {
        "time": 10.437269649999983,
        "lps": -6.698886577984897,
        "volume": 0.7248261742141685,
        "exhale": false
    },
    {
        "time": 10.442685912499984,
        "lps": -6.691550268470297,
        "volume": 0.7610693670001492,
        "exhale": false
    },
    {
        "time": 10.448098512499984,
        "lps": -6.702259165267351,
        "volume": 0.7973460149580752,
        "exhale": false
    },
    {
        "time": 10.453518749999983,
        "lps": -6.642512992240384,
        "volume": 0.8333500129728537,
        "exhale": false
    },
    {
        "time": 10.458940024999983,
        "lps": -6.684712331645717,
        "volume": 0.8695896768185963,
        "exhale": false
    },
    {
        "time": 10.464368849999982,
        "lps": -6.632674353148536,
        "volume": 0.905597305163828,
        "exhale": false
    },
    {
        "time": 10.469801912499982,
        "lps": -6.649268120876256,
        "volume": 0.9417231944438063,
        "exhale": false
    },
    {
        "time": 10.475240637499981,
        "lps": -6.633059385885789,
        "volume": 0.9777985803523079,
        "exhale": false
    },
    {
        "time": 10.48069306249998,
        "lps": -6.564131160941176,
        "volume": 1.0135890131975027,
        "exhale": false
    },
    {
        "time": 10.48615411249998,
        "lps": -6.586901770781162,
        "volume": 1.049560413112827,
        "exhale": false
    },
    {
        "time": 10.49161854999998,
        "lps": -6.616776780123112,
        "volume": 1.0857173762792611,
        "exhale": false
    },
    {
        "time": 10.497101387499981,
        "lps": -6.4979750768745825,
        "volume": 1.1213447177048144,
        "exhale": false
    },
    {
        "time": 10.502596862499981,
        "lps": -6.520340553393905,
        "volume": 1.1571770862074768,
        "exhale": false
    },
    {
        "time": 10.508110349999981,
        "lps": -6.465096538941154,
        "volume": 1.192822315161222,
        "exhale": false
    },
    {
        "time": 10.513635449999981,
        "lps": -6.4923817951447935,
        "volume": 1.2286933738175765,
        "exhale": false
    },
    {
        "time": 10.519187687499981,
        "lps": -6.363493936623457,
        "volume": 1.2640250034835199,
        "exhale": false
    },
    {
        "time": 10.52474863749998,
        "lps": -6.4691853601445475,
        "volume": 1.2999998198120157,
        "exhale": false
    },
    {
        "time": 10.53031707499998,
        "lps": -6.468191967141665,
        "volume": 1.3360175425190461,
        "exhale": false
    },
    {
        "time": 10.53588496249998,
        "lps": -6.515334219293415,
        "volume": 1.372294190476972,
        "exhale": false
    },
    {
        "time": 10.54145404999998,
        "lps": -6.506488417876158,
        "volume": 1.408529393793861,
        "exhale": false
    },
    {
        "time": 10.547013149999978,
        "lps": -6.525633278395075,
        "volume": 1.444806041751787,
        "exhale": false
    },
    {
        "time": 10.552571999999978,
        "lps": -6.52592675785928,
        "volume": 1.481082689709713,
        "exhale": false
    },
    {
        "time": 10.558112287499979,
        "lps": -6.547791600693296,
        "volume": 1.5173593376676389,
        "exhale": false
    },
    {
        "time": 10.563650524999979,
        "lps": -6.550215291042694,
        "volume": 1.5536359856255648,
        "exhale": false
    },
    {
        "time": 10.569180774999978,
        "lps": -6.559675956408131,
        "volume": 1.5899126335834908,
        "exhale": false
    },
    {
        "time": 10.574697549999978,
        "lps": -6.575698294370545,
        "volume": 1.6261892815414167,
        "exhale": false
    },
    {
        "time": 10.580212812499978,
        "lps": -6.577501607208371,
        "volume": 1.6624659294993427,
        "exhale": false
    },
    {
        "time": 10.585731512499978,
        "lps": -6.5516517575376065,
        "volume": 1.6986225300536655,
        "exhale": false
    },
    {
        "time": 10.591248674999978,
        "lps": -6.575236447707687,
        "volume": 1.7348991780115914,
        "exhale": false
    },
    {
        "time": 10.596773837499978,
        "lps": -6.515178326692575,
        "volume": 1.770896596983046,
        "exhale": false
    },
    {
        "time": 10.602306199999978,
        "lps": -6.511822675748322,
        "volume": 1.8069223605610056,
        "exhale": false
    },
    {
        "time": 10.607846049999978,
        "lps": -6.501285692005638,
        "volume": 1.842938508101863,
        "exhale": false
    },
    {
        "time": 10.613394524999977,
        "lps": -6.484134907464844,
        "volume": 1.878915568532559,
        "exhale": false
    },
    {
        "time": 10.618944274999977,
        "lps": -6.528660164404433,
        "volume": 1.9151480002799623,
        "exhale": false
    },
    {
        "time": 10.624510849999977,
        "lps": -6.412132037089923,
        "volume": 1.950841614174326,
        "exhale": false
    },
    {
        "time": 10.630099262499977,
        "lps": -6.3564968411369795,
        "volume": 1.9863643405775466,
        "exhale": false
    },
    {
        "time": 10.635720362499978,
        "lps": -6.253884250273257,
        "volume": 2.0215180493367577,
        "exhale": false
    },
    {
        "time": 10.641376899999978,
        "lps": -6.19949233584415,
        "volume": 2.0565857102154226,
        "exhale": false
    },
    {
        "time": 10.647071412499978,
        "lps": -6.144640434624716,
        "volume": 2.0915764419783986,
        "exhale": false
    },
    {
        "time": 10.652821749999978,
        "lps": -5.982629313057967,
        "volume": 2.1259785796658752,
        "exhale": false
    },
    {
        "time": 10.658617074999977,
        "lps": -6.001867022873989,
        "volume": 2.1607613496702123,
        "exhale": false
    },
    {
        "time": 10.664456337499978,
        "lps": -5.964947939294232,
        "volume": 2.1955922464865854,
        "exhale": false
    },
    {
        "time": 10.670364224999977,
        "lps": -5.761819664582347,
        "volume": 2.2296324288602256,
        "exhale": false
    },
    {
        "time": 10.676374749999978,
        "lps": -5.48714863800002,
        "volume": 2.262613072927641,
        "exhale": false
    },
    {
        "time": 10.682517887499978,
        "lps": -5.226468397146223,
        "volume": 2.2947199869307147,
        "exhale": false
    },
    {
        "time": 10.688805487499978,
        "lps": -5.065623961942621,
        "volume": 2.326570604153825,
        "exhale": false
    },
    {
        "time": 10.695227799999978,
        "lps": -5.022998714230589,
        "volume": 2.358829871583712,
        "exhale": false
    },
    {
        "time": 10.701788012499978,
        "lps": -4.918374628103768,
        "volume": 2.3910954542986813,
        "exhale": false
    },
    {
        "time": 10.708497812499978,
        "lps": -4.774219346067041,
        "volume": 2.423129511266922,
        "exhale": false
    },
    {
        "time": 10.715363562499977,
        "lps": -4.656412159770294,
        "volume": 2.455099273052865,
        "exhale": false
    },
    {
        "time": 10.722356237499977,
        "lps": -4.699497268486209,
        "volume": 2.4879613301147767,
        "exhale": false
    },
    {
        "time": 10.729475574999977,
        "lps": -4.627057393289152,
        "volume": 2.5209029133294725,
        "exhale": false
    },
    {
        "time": 10.736705337499977,
        "lps": -4.623750791065886,
        "volume": 2.554331533408066,
        "exhale": false
    },
    {
        "time": 10.744015449999978,
        "lps": -4.683914302798519,
        "volume": 2.588571473901882,
        "exhale": false
    },
    {
        "time": 10.751406299999978,
        "lps": -4.634993826213669,
        "volume": 2.6228280180223535,
        "exhale": false
    },
    {
        "time": 10.758884274999978,
        "lps": -4.563401995708943,
        "volume": 2.656953024061215,
        "exhale": false
    },
    {
        "time": 10.766442862499979,
        "lps": -4.539573607738086,
        "volume": 2.691265788387994,
        "exhale": false
    },
    {
        "time": 10.774080974999979,
        "lps": -4.498947588429403,
        "volume": 2.7256292562000217,
        "exhale": false
    },
    {
        "time": 10.78178566249998,
        "lps": -4.502988859752623,
        "volume": 2.760323378180397,
        "exhale": false
    },
    {
        "time": 10.78957593749998,
        "lps": -4.398266211769932,
        "volume": 2.794587081493293,
        "exhale": false
    },
    {
        "time": 10.797442149999979,
        "lps": -4.387539100376039,
        "volume": 2.8291003964089096,
        "exhale": false
    },
    {
        "time": 10.805409174999978,
        "lps": -4.263010937661658,
        "volume": 2.8630639111245335,
        "exhale": false
    },
    {
        "time": 10.813560999999979,
        "lps": -3.9386323594923587,
        "volume": 2.8951709528584524,
        "exhale": false
    },
    {
        "time": 10.82485486249998,
        "lps": 0,
        "volume": 2.8951709528584524,
        "exhale": false
    },
    {
        "time": 10.84183476249998,
        "lps": 0,
        "volume": 2.8951709528584524,
        "exhale": false
    },
    {
        "time": 10.866037687499981,
        "lps": 0,
        "volume": 2.8951709528584524,
        "exhale": false
    },
    {
        "time": 10.89749959999998,
        "lps": 0,
        "volume": 2.8951709528584524,
        "exhale": false
    },
    {
        "time": 10.937571024999981,
        "lps": 0,
        "volume": 2.8951709528584524,
        "exhale": false
    },
    {
        "time": 10.987692987499981,
        "lps": 0,
        "volume": 2.8951709528584524,
        "exhale": false
    },
    {
        "time": 11.049721037499982,
        "lps": 0,
        "volume": 2.8951709528584524,
        "exhale": false
    },
    {
        "time": 11.125884899999981,
        "lps": 0,
        "volume": 2.8951709528584524,
        "exhale": false
    },
    {
        "time": 11.22061476249998,
        "lps": 0,
        "volume": 2.8951709528584524,
        "exhale": false
    },
    {
        "time": 11.33840817499998,
        "lps": 0,
        "volume": 2.8951709528584524,
        "exhale": false
    },
    {
        "time": 11.33840817499998,
        "lps": 0,
        "volume": 2.8951709528584524,
        "exhale": true
    },
    {
        "time": 11.35238346249998,
        "lps": 2.650007445324694,
        "volume": 2.8581363369328994,
        "exhale": true
    },
    {
        "time": 11.362908162499979,
        "lps": 3.5188286531258024,
        "volume": 2.8211017210073464,
        "exhale": true
    },
    {
        "time": 11.371792087499978,
        "lps": 4.168722262463172,
        "volume": 2.7840671050817933,
        "exhale": true
    },
    {
        "time": 11.379698762499977,
        "lps": 4.683968409673236,
        "volume": 2.7470324891562403,
        "exhale": true
    },
    {
        "time": 11.386969962499977,
        "lps": 5.093329288914227,
        "volume": 2.7099978732306873,
        "exhale": true
    },
    {
        "time": 11.393764149999978,
        "lps": 5.450926387526563,
        "volume": 2.6729632573051343,
        "exhale": true
    },
    {
        "time": 11.400220199999978,
        "lps": 5.736420245436936,
        "volume": 2.6359286413795813,
        "exhale": true
    },
    {
        "time": 11.406421387499979,
        "lps": 5.972181283915884,
        "volume": 2.5988940254540283,
        "exhale": true
    },
    {
        "time": 11.412399887499978,
        "lps": 6.19463342402829,
        "volume": 2.5618594095284752,
        "exhale": true
    },
    {
        "time": 11.418174337499979,
        "lps": 6.413531319095868,
        "volume": 2.5248247936029222,
        "exhale": true
    },
    {
        "time": 11.42377066249998,
        "lps": 6.617667116465383,
        "volume": 2.487790177677369,
        "exhale": true
    },
    {
        "time": 11.42922851249998,
        "lps": 6.785568662669941,
        "volume": 2.450755561751816,
        "exhale": true
    },
    {
        "time": 11.43456972499998,
        "lps": 6.933746958308276,
        "volume": 2.413720945826263,
        "exhale": true
    },
    {
        "time": 11.43980147499998,
        "lps": 7.078819883509941,
        "volume": 2.37668632990071,
        "exhale": true
    },
    {
        "time": 11.44493273749998,
        "lps": 7.2174471537079095,
        "volume": 2.339651713975157,
        "exhale": true
    },
    {
        "time": 11.44999232499998,
        "lps": 7.319690770354922,
        "volume": 2.302617098049604,
        "exhale": true
    },
    {
        "time": 11.45497049999998,
        "lps": 7.439396149302332,
        "volume": 2.265582482124051,
        "exhale": true
    },
    {
        "time": 11.459873524999981,
        "lps": 7.553421800939854,
        "volume": 2.228547866198498,
        "exhale": true
    },
    {
        "time": 11.464715462499981,
        "lps": 7.648718292120279,
        "volume": 2.191513250272945,
        "exhale": true
    },
    {
        "time": 11.469507037499982,
        "lps": 7.729111184851146,
        "volume": 2.154478634347392,
        "exhale": true
    },
    {
        "time": 11.474249587499981,
        "lps": 7.809009061697426,
        "volume": 2.117444018421839,
        "exhale": true
    },
    {
        "time": 11.478942137499981,
        "lps": 7.892215517267398,
        "volume": 2.080409402496286,
        "exhale": true
    },
    {
        "time": 11.483594674999981,
        "lps": 7.960089719976064,
        "volume": 2.043374786570733,
        "exhale": true
    },
    {
        "time": 11.48819857499998,
        "lps": 8.044183393547454,
        "volume": 2.00634017064518,
        "exhale": true
    },
    {
        "time": 11.49275992499998,
        "lps": 8.119222582251556,
        "volume": 1.9693055547196268,
        "exhale": true
    },
    {
        "time": 11.49727009999998,
        "lps": 8.211347880193813,
        "volume": 1.9322709387940735,
        "exhale": true
    },
    {
        "time": 11.50173173749998,
        "lps": 8.300677929471664,
        "volume": 1.8952363228685203,
        "exhale": true
    },
    {
        "time": 11.50615251249998,
        "lps": 8.3774034927254,
        "volume": 1.858201706942967,
        "exhale": true
    },
    {
        "time": 11.51054452499998,
        "lps": 8.432265601601348,
        "volume": 1.8211670910174138,
        "exhale": true
    },
    {
        "time": 11.51490591249998,
        "lps": 8.491475688769487,
        "volume": 1.7841324750918606,
        "exhale": true
    },
    {
        "time": 11.51923864999998,
        "lps": 8.547625127428821,
        "volume": 1.7470978591663076,
        "exhale": true
    },
    {
        "time": 11.523558249999981,
        "lps": 8.573621614397892,
        "volume": 1.7100632432407543,
        "exhale": true
    },
    {
        "time": 11.52786637499998,
        "lps": 8.596458070634705,
        "volume": 1.673028627315201,
        "exhale": true
    },
    {
        "time": 11.53217817499998,
        "lps": 8.54917844166906,
        "volume": 1.6361662797104124,
        "exhale": true
    },
    {
        "time": 11.53649647499998,
        "lps": 8.505723203345312,
        "volume": 1.5994360152014064,
        "exhale": true
    },
    {
        "time": 11.54083796249998,
        "lps": 8.280931847571425,
        "volume": 1.5634844530968233,
        "exhale": true
    },
    {
        "time": 11.54520158749998,
        "lps": 8.251638047553664,
        "volume": 1.5274773990215669,
        "exhale": true
    },
    {
        "time": 11.549598524999979,
        "lps": 8.073404583487665,
        "volume": 1.4919791436557581,
        "exhale": true
    },
    {
        "time": 11.55402856249998,
        "lps": 8.018359036732624,
        "volume": 1.4564575124345687,
        "exhale": true
    },
    {
        "time": 11.55850056249998,
        "lps": 7.856448177793024,
        "volume": 1.4213234761834783,
        "exhale": true
    },
    {
        "time": 11.563013474999979,
        "lps": 7.8002703084008145,
        "volume": 1.3861215388053174,
        "exhale": true
    },
    {
        "time": 11.567572249999978,
        "lps": 7.678042132426375,
        "volume": 1.3511190722830653,
        "exhale": true
    },
    {
        "time": 11.572174137499978,
        "lps": 7.637449639435564,
        "volume": 1.3159723882554673,
        "exhale": true
    },
    {
        "time": 11.576835324999978,
        "lps": 7.3946759819221395,
        "volume": 1.2815044170019816,
        "exhale": true
    },
    {
        "time": 11.581559624999977,
        "lps": 7.269674225327173,
        "volume": 1.2471602950592684,
        "exhale": true
    },
    {
        "time": 11.586359037499978,
        "lps": 7.0600611038157615,
        "volume": 1.2132761495468511,
        "exhale": true
    },
    {
        "time": 11.591247224999979,
        "lps": 6.828960604699331,
        "volume": 1.1798949096809674,
        "exhale": true
    },
    {
        "time": 11.59623558749998,
        "lps": 6.615692137480741,
        "volume": 1.1468934391108137,
        "exhale": true
    },
    {
        "time": 11.601335637499979,
        "lps": 6.401016104177053,
        "volume": 1.1142479369287055,
        "exhale": true
    },
    {
        "time": 11.60656842499998,
        "lps": 6.106814132549574,
        "volume": 1.0822922762710767,
        "exhale": true
    },
    {
        "time": 11.61194079999998,
        "lps": 5.929080148670086,
        "volume": 1.0504390343073653,
        "exhale": true
    },
    {
        "time": 11.61747214999998,
        "lps": 5.661639200250831,
        "volume": 1.0191225263170578,
        "exhale": true
    },
    {
        "time": 11.62317888749998,
        "lps": 5.421879419551325,
        "volume": 0.988181283713026,
        "exhale": true
    },
    {
        "time": 11.629075024999981,
        "lps": 5.205679098357679,
        "volume": 0.9574878839682331,
        "exhale": true
    },
    {
        "time": 11.63517819999998,
        "lps": 4.975510351533844,
        "volume": 0.9271214735785106,
        "exhale": true
    },
    {
        "time": 11.641502237499981,
        "lps": 4.776308387535071,
        "volume": 0.8969159202241743,
        "exhale": true
    },
    {
        "time": 11.64803448749998,
        "lps": 4.7238015658663155,
        "volume": 0.8660588674455441,
        "exhale": true
    },
    {
        "time": 11.654761924999981,
        "lps": 4.675960081727437,
        "volume": 0.8346016382432279,
        "exhale": true
    },
    {
        "time": 11.661686637499981,
        "lps": 4.561786509382014,
        "volume": 0.8030125781793789,
        "exhale": true
    },
    {
        "time": 11.668763949999981,
        "lps": 4.656856110442329,
        "volume": 0.770054552218244,
        "exhale": true
    },
    {
        "time": 11.675970724999981,
        "lps": 4.670818459379737,
        "volume": 0.7363930145156476,
        "exhale": true
    },
    {
        "time": 11.683292574999982,
        "lps": 4.657088140436009,
        "volume": 0.7022945137145963,
        "exhale": true
    },
    {
        "time": 11.690699274999982,
        "lps": 4.713037153548724,
        "volume": 0.6673864614294069,
        "exhale": true
    },
    {
        "time": 11.698195899999982,
        "lps": 4.643613892555229,
        "volume": 0.6325750294321301,
        "exhale": true
    },
    {
        "time": 11.705771762499982,
        "lps": 4.633499141326784,
        "volume": 0.5974722770435703,
        "exhale": true
    },
    {
        "time": 11.713418112499982,
        "lps": 4.62140015641938,
        "volume": 0.562135433957533,
        "exhale": true
    },
    {
        "time": 11.721124949999982,
        "lps": 4.6183855415034625,
        "volume": 0.5265422870768163,
        "exhale": true
    },
    {
        "time": 11.728866149999982,
        "lps": 4.679222168010828,
        "volume": 0.4903194924298109,
        "exhale": true
    },
    {
        "time": 11.736601912499982,
        "lps": 4.787455137816489,
        "volume": 0.45328487650425775,
        "exhale": true
    },
    {
        "time": 11.744310412499981,
        "lps": 4.80438683603206,
        "volume": 0.4162502605787046,
        "exhale": true
    },
    {
        "time": 11.751972999999982,
        "lps": 4.833173640829959,
        "volume": 0.3792156446531515,
        "exhale": true
    },
    {
        "time": 11.759564624999982,
        "lps": 4.878351594757794,
        "volume": 0.34218102872759837,
        "exhale": true
    },
    {
        "time": 11.767105124999981,
        "lps": 4.911427083821116,
        "volume": 0.30514641280204524,
        "exhale": true
    },
    {
        "time": 11.774612899999982,
        "lps": 4.932835084369621,
        "volume": 0.2681117968764921,
        "exhale": true
    },
    {
        "time": 11.782120924999981,
        "lps": 4.9318589259192755,
        "volume": 0.23108327676421705,
        "exhale": true
    },
    {
        "time": 11.789654387499981,
        "lps": 4.833734657630168,
        "volume": 0.19466851798600984,
        "exhale": true
    },
    {
        "time": 11.79724574999998,
        "lps": 4.693542930688233,
        "volume": 0.15903813218984308,
        "exhale": true
    },
    {
        "time": 11.80492623749998,
        "lps": 4.543202357018389,
        "volume": 0.1241441232767928,
        "exhale": true
    },
    {
        "time": 11.812702374999981,
        "lps": 4.4712324676871615,
        "volume": 0.08937520481359312,
        "exhale": true
    },
    {
        "time": 11.820603049999981,
        "lps": 4.31977240265122,
        "volume": 0.0552460869862767,
        "exhale": true
    },
    {
        "time": 11.828641412499982,
        "lps": 4.2151138469781175,
        "volume": 0.02136347390549706,
        "exhale": true
    },
    {
        "time": 11.836837099999983,
        "lps": 4.0883545899870555,
        "volume": -0.012143402703227474,
        "exhale": true
    },
    {
        "time": 11.845246062499983,
        "lps": 3.848914415221826,
        "volume": -0.04450877968653724,
        "exhale": true
    },
    {
        "time": 11.853914362499983,
        "lps": 3.6374608333459157,
        "volume": -0.07603938142822964,
        "exhale": true
    },
    {
        "time": 11.862893599999984,
        "lps": 3.4159601518392133,
        "volume": -0.10671209892212999,
        "exhale": true
    },
    {
        "time": 11.872238599999983,
        "lps": 3.1953985969140852,
        "volume": -0.13657309881029212,
        "exhale": true
    },
    {
        "time": 11.882900849999983,
        "lps": 1.198955473511596,
        "volume": -0.14935666180774113,
        "exhale": true
    },
    {
        "time": 11.896460437499982,
        "lps": 0,
        "volume": -0.14935666180774113,
        "exhale": true
    },
    {
        "time": 11.913102524999982,
        "lps": 0,
        "volume": -0.14935666180774113,
        "exhale": true
    },
    {
        "time": 11.933195237499982,
        "lps": 0,
        "volume": -0.14935666180774113,
        "exhale": true
    },
    {
        "time": 11.957515562499982,
        "lps": 0,
        "volume": -0.14935666180774113,
        "exhale": true
    },
    {
        "time": 11.986994912499982,
        "lps": 0,
        "volume": -0.14935666180774113,
        "exhale": true
    },
    {
        "time": 12.022548337499982,
        "lps": 0,
        "volume": -0.14935666180774113,
        "exhale": true
    },
    {
        "time": 12.065527287499982,
        "lps": 0,
        "volume": -0.14935666180774113,
        "exhale": true
    },
    {
        "time": 12.117895299999983,
        "lps": 0,
        "volume": -0.14935666180774113,
        "exhale": true
    },
    {
        "time": 12.181547062499982,
        "lps": 0,
        "volume": -0.14935666180774113,
        "exhale": true
    },
    {
        "time": 12.259668462499983,
        "lps": 0,
        "volume": -0.14935666180774113,
        "exhale": true
    },
    {
        "time": 12.355842474999983,
        "lps": 0,
        "volume": -0.14935666180774113,
        "exhale": true
    },
    {
        "time": 12.475647499999983,
        "lps": 0,
        "volume": -0.14935666180774113,
        "exhale": true
    },
    {
        "time": 12.626852037499983,
        "lps": 0,
        "volume": -0.14935666180774113,
        "exhale": true
    },
    {
        "time": 12.821930249999983,
        "lps": 0,
        "volume": -0.14935666180774113,
        "exhale": true
    },
    {
        "time": 13.085665937499984,
        "lps": 0,
        "volume": -0.14935666180774113,
        "exhale": true
    },
    {
        "time": 13.489992249999984,
        "lps": 0,
        "volume": -0.14935666180774113,
        "exhale": true
    },
    {
        "time": 13.489992249999984,
        "lps": 0,
        "volume": -0.14935666180774113,
        "exhale": true
    },
    {
        "time": 13.489992249999984,
        "lps": 0,
        "volume": -0.14935666180774113,
        "exhale": true
    }
  ];
  useEffect(()=>{
    let volumeFlowListTemp = [];
    let timeVolumeListTemp = [];
    c.forEach((item)=>{
      let temp = {...item};
      volumeFlowListTemp.push({x:temp.volume, y:temp.lps});
      timeVolumeListTemp.push({x:temp.time, y:temp.volume});
    })
    setVolumeFlow(volumeFlowListTemp);
    setTimeVolume(timeVolumeListTemp);
  },[])


  



  return(
    <div className="result-page-container measurement-page-container">
        <div className="measurement-page-nav" onClick={()=>{console.log()}}>
          <div className='measurement-page-backBtn' onClick={()=>{navigatorR(-1)}}>
            <FontAwesomeIcon icon={faChevronLeft} style={{color: "#4b75d6",}} />
          </div>
          <p onClick={()=>{chartRef.current.update()}}>검사</p>
        </div>


        <div className="left-container measurement-page-left-container">
          <div className="patient-info-container">
            <span>검사</span>
            <div className="patient-info">              

            </div>
            <button onClick={()=>{}}>환자정보 수정</button>
            {/* <div className="button-container"></div> */}
          </div>
        </div>
        <div className="measurement-page-right-container">
          <div className="fvc-graph-container">
            <div className="graph">
              {temp?<div className="title-y">Flow(l/s)</div>:<></>}
              {temp?<Scatter ref={chartRef} style={graphStyle} data={graphData} options={graphOption}/>:<p className='loadingG'>화면 조정 중..</p>}
              {temp?<div className="title-x">Volume(L)</div>:<></>}
            </div>
            <div className="graph">
              {temp?<div className="title-y">Volume(L)</div>:<></>}
              {temp?<Scatter style={graphStyle} data={graphData2} options={graphOption2}/>:<p className='loadingG'>화면 조정 중..</p>}
              {temp?<div className="title-x">Time(s)</div>:<></>}
            </div>
          </div>

          <div className="button-container">
            <div className="two-btn-container">

            </div>
          </div>

          <div className="history-container">
            <div className="data">

            </div>
          </div>
        </div>
      </div>
  );
}

export default MeasurementPage;

