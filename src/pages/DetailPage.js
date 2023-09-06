import { useEffect, useState } from "react";
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
  import { Bar } from 'react-chartjs-2';
function DetailPage(){
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
        labels: ["Scatter"],
        datasets: [{
          label: "quadrant4",
          fill: false,
          pointBackgroundColor: "#FF9191",
          pointRadius: 5,
          pointHitRadius: 10,
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
            color:'#FF9191'
          }
        },
      },
      title: {
  
      }
    }

    

    const fev1CompareBarData = {
      labels: ["FEV1"],
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
      labels: ["FEV1%"],
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
      labels: ["FVC"],
      datasets: [{
        label: "pre",
        fill: false,
        pointBackgroundColor: "#000",
        pointRadius: 5,
        pointHitRadius: 10,
        data: [{ x :preFvc.meas, y : 0.5}],
        tension: 0.4,
      },{
        label: "post",
        fill: false,
        pointBackgroundColor: "#000",
        pointRadius: 5,
        pointHitRadius: 10,
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

    return (
        <div> 
          <div>담당자 {state.subject[7].value}</div>
          <div>검사적합성 : {state.diagnosis.suitability}</div>
            <div onClick={()=>{
              navigator(-1) //탈출용
            }}>
                {preResult.map((item)=>(
                    <table border={1}>
                        <tr>
                            <td></td>
                            <td>측정</td>
                            <td>예측값</td>
                            <td>%</td>
                            <td>정상범위</td>
                        </tr>
                        <tr>
                            <td>{item.title}</td>
                            <td>{item.meas === '' ? '-' : item.meas}</td>
                            <td>{item.pred === '' ? '-' : item.pred}</td>
                            <td>{item.per === '' ? '-' : item.per}</td>
                            <td>{item.min} ~ {item.max}</td>
                        
                        </tr>
                    </table>
                ))}
                pre
            </div>

            <div>
              
                {postResult.map((item)=>(
                    <table border={1}>
                        <tr>
                            <td></td>
                            <td>측정</td>
                            <td>예측값</td>
                            <td>%</td>
                            <td>정상범위</td>
                        </tr>
                        <tr>
                            <td>{item.title}</td>
                            <td>{item.meas === '' ? '-' : item.meas}</td>
                            <td>{item.pred === '' ? '-' : item.pred}</td>
                            <td>{item.per === '' ? '-' : item.per}</td>
                            <td>{item.min} {item.min === '' ? '-' : '~'} {item.max}</td>
                        
                        </tr>
                    </table>
                ))}
                Post
            </div>

            <div>
              4사분면
                <Scatter options={quadrant4Option} data={quadrant4Data} />
            </div>
            <div >
              FVC<Scatter id="fvc" options={fvcCompareBarOption} data={fvcCompareBarData}/>
            </div>
            <div>
              FEV1<Scatter options={fev1CompareBarOption} data={fev1CompareBarData} />
            </div>
            <div>
              FEV1%<Scatter options={fev1PerCompareBarOption} data={fev1PerCompareBarData} />
            </div>
        </div>
    );

}

export default DetailPage;