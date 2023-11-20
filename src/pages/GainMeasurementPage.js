import { useState, useRef, useEffect} from 'react';
import axios from 'axios';
import { Cookies, useCookies } from 'react-cookie';
import Alert from "../components/Alerts.js"
import { Routes, Route, Link,useNavigate,useLocation } from 'react-router-dom'
import {} from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { debounce } from 'lodash'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import {registerables,Chart as ChartJS,RadialLinearScale,LineElement,Tooltip,Legend,} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
const GainMeasurementPage = () =>{
  ChartJS.register(RadialLinearScale, LineElement, Tooltip, Legend, ...registerables,annotationPlugin);
  const cookie = new Cookies();
  const location = useLocation();
  const chartRef = useRef();
  // const graphStyle = {width:"0" ,height:"0", transition:"none"}
  let windowWidth = window.innerWidth*0.6;
  let windowHeight = window.innerHeight-200;
  // const [windowHeight,setWindowHeight] = useState(window.innerHeight-200);
  const graphStyle = {width:"0" ,height:"0", transition:"none", maxHeight:windowHeight}
  let navigatorR = useNavigate();
  const state = location.state;
  let graphConRef = useRef();
  

  const [first, setFirst] = useState({x:window.innerWidth, y: window.innerHeight})
  const [second, setSecond] = useState({x:window.innerWidth, y: window.innerHeight})
  const [temp, setTemp] = useState(false);
  const [maxMin,setMaxMin] = useState(9);

  const handleResize = debounce(()=>{
    setTemp(false);
    setSecond({
      x: window.innerWidth,
      y: window.innerHeight,
    })
  })


 


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


  const [graphData, setGraphData] = useState({
    labels: ['Gain'],
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
      datalabels: false,
      annotation: {
        annotations: {
          box1: {
            type: 'box',
            yMin: 1,
            yMax: 2,
            backgroundColor: 'rgba(255, 99, 132, 0.25)',
            borderColor: 'rgba(0,0,0,0)'
          },
          box2: {
            type: 'box',
            yMin: -2,
            yMax: -1,
            backgroundColor: 'rgba(255, 99, 132, 0.25)',
            borderColor: 'rgba(0,0,0,0)'
          },
          box3: {
            type: 'box',
            yMin: -5,
            yMax: -3,
            backgroundColor: 'rgba(1, 138, 190, 0.25)',
            borderColor: 'rgba(0,0,0,0)'
          },
          box4: {
            type: 'box',
            yMin: 3,
            yMax: 5,
            backgroundColor: 'rgba(1, 138, 190, 0.25)',
            borderColor: 'rgba(0,0,0,0)'
          },
          box5: {
            type: 'box',
            yMin: 6,
            yMax: 9,
            backgroundColor: 'rgba(4, 162, 131, 0.25)',
            borderColor: 'rgba(0,0,0,0)'
          },
          box6: {
            type: 'box',
            yMin: -9,
            yMax: -6,
            backgroundColor: 'rgba(4, 162, 131, 0.25)',
            borderColor: 'rgba(0,0,0,0)'
          },
          line1: {
            type: 'line',
            yMin: 0,
            yMax: 0,
            borderColor: 'rgb(93, 188, 206)',
            borderWidth: 2,
          }
        }
      },
    },
    
    responsive: true,
    //그래프 비율설정!!!!!!!
    aspectRatio: 0.6,
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

        suggestedMax: 6.0,
        ticks:{
          autoSkip: false,
          min: 0.00,
          max: 15.00,
          // stepSize : 1.5,
          // sampleSize:9,

          // precision : 0.1,
          beginAtZero: true,
          max: 12.0,
        },
        grid:{
          color: '#bbdfe4'
        }
      },
      y: {
        gridLines:{
          zeroLineColor:'rgb(0, 0, 255)',
        },
        axios: 'y',

        // grace:"5%",
        tickLength:9,
        ticks: {
          major: true,
          beginAtZero: true,
          
          // sampleSize:9,
          border:60,
          stepSize : maxMin < 10.00 ? 1 : maxMin < 25 ? 2.5 : 3,
          // fontSize : 10,
          textStrokeColor: 10,
          precision: 1,
        },
        grid:{
          tickLength:9,
          color:'#bbdfe4',
        }
      },
    },
  }
//   useEffect(()=>{
    
//     let dataList=[]
    
//     state.result.graph.volumeFlow.forEach((item,index)=>{
//       dataList.push(item)
      
//     })
//     let data = {
//       labels: '',
//       datasets: [{
//         label: "",
//         data: dataList,
//         borderColor: `rgb(5,128,190)`,
//         borderWidth: 2.5,
//         showLine: true,
//         tension: 0.4
//       }],
//     }
//     console.log(data)
//     setGraphData(data);
//   },[])
  useEffect(()=>{
    let time = setTimeout(() => {
      setTemp(true);
    },1000);
    console.log(graphData)
  },[graphData])

  return(
    <div className="gain-measurement-page-container">
      <div className="gain-measurement-page-nav">
        <div className='gain-measurement-page-backBtn' onClick={()=>{navigatorR(-1)}}>
            <FontAwesomeIcon icon={faChevronLeft} style={{color: "#4b75d6",}} />
        </div>
        <p>보정 결과</p>
      </div>
      <div className='gain-measurement-m-page-container'>
        <div className="gain-measurement-page-left-container" ref={graphConRef}>
          {temp?<div className="title-y">Flow(l/s)</div>:<></>}
          {temp?<Scatter ref={chartRef} style={graphStyle} data={graphData} options={graphOption}/>:<p className='loadingG'>화면 조정 중..</p>}
          {temp?<div className="title-x">Volume(L)</div>:<></>}
        </div>

        <div className="gain-measurement-page-right-container">
          <div className='gain-measurement-gain-container'>
            <div>
              <p className='gain-measurement-title'>Gain</p>
            </div>
            <div className='gain-measurement-table-container'>
              <div className='gain-measurement-table-Inhale'>
                <p>Inhale</p>
                <p>-</p>
              </div>
              <div className='gain-measurement-table-Exhale'>
                <p>Exhale</p>
                <p>-</p>
              </div>
            </div>           
          </div>
          <div className='gain-measurement-calivration-container'>
            <div>
              <p className='gain-measurement-title'>Before Calivration</p>
            </div>

            <div className='gain-measurement-calivration-table-container'>
              <div className='gain-measurement-calivration-table-column'>
                <p></p>
                <p>Volume(L)</p>
                <p>Error(%)</p>
              </div>
              <div className='gain-measurement-calivration-table-Inhale'>
                <p>Inhale</p>
                <p>- </p>
                <p>-</p>
              </div>
              <div className='gain-measurement-calivration-table-Exhale'>
                <p>Exhale</p>
                <p>-</p>
                <p>-</p>
              </div>

            </div>
                    
          </div>
          <div className='gain-measurement-calivration-container'>
            <div>
              <p className='gain-measurement-title'>After Calivration</p>
            </div>

            <div className='gain-measurement-calivration-table-container'>
              <div className='gain-measurement-calivration-table-column'>
                <p></p>
                <p>Volume(L)</p>
                <p>Error(%)</p>
              </div>
              <div className='gain-measurement-calivration-table-Inhale'>
                <p>Inhale</p>
                <p>- </p>
                <p>-</p>
              </div>
              <div className='gain-measurement-calivration-table-Exhale'>
                <p>Exhale</p>
                <p>-</p>
                <p>-</p>
              </div>

            </div>
                    
          </div>

        
        </div>
      </div>

      <div className='gain-measure-operation'>

  </div>
      
      
    </div>
  );
}

export default GainMeasurementPage;