import { useState, useRef, useEffect, useMemo} from 'react';
import axios from 'axios';
import { Cookies, useCookies } from 'react-cookie';
import Alert from "../components/Alerts.js"
import Confirm from "../components/Confirm.js"
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FaBluetoothB } from "react-icons/fa6";
import {} from "@fortawesome/fontawesome-svg-core"
import styled from 'styled-components';
import { debounce } from 'lodash'
import {registerables,Chart as ChartJS,RadialLinearScale,LineElement,Tooltip,Legend,} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux"
import { changeDeviceInfo, reset } from "./../deviceInfo.js"
import { da } from 'date-fns/locale';
import Gauge from "../components/Gauge.js"
import Timer from "../components/Timer.js"


const MeasurementPage = () =>{
  let deviceInfo = useSelector((state) => state.deviceInfo ) 
  const cookies = new Cookies();
  const [setCookie] = useCookies();
  let navigatorR = useNavigate();
  let dispatch = useDispatch();
  let secondBtnRef = useRef();
  // let dataResult = [];
  
  // 노력성 호기 전 호흡 횟수 등 쿠키에서 받아오기
  let breathCount = 3;
  let strongTime = 6;
  let stopTime = 15;

  
  const [measureDone, setMeasureDone] = useState(false);


  // 게이지 UI 전처리
  let setGaugeUI = (strongTime, stopTime)=>{
    switch (strongTime) {
      case 3:
        itemRef.current[30].classList += " endColor";
        setTimerTick(10.0);
        break;
      
      case 10:
        itemRef.current[30].classList += " endColor";
        setTimerTick(33.3)
        break;
      
      case 15:
        itemRef.current[36].classList += " endColor";
        setTimerTick(41.7)
        break;
      
      case 20:
        itemRef.current[40].classList += " endColor";
        setTimerTick(50.0)
        break;
      
      case 30:
        itemRef.current[30].classList += " endColor";
        setTimerTick(100.0)
        break;
      
      default: //default 6
        itemRef.current[24].classList += " endColor";
        setTimerTick(25.0)
        break;
    }
  }

  useEffect(()=>{
    setGaugeUI(strongTime, stopTime);
  },[])
  
   // 세션 가이드 컨텐츠
  const [gaugeContent, setGaugeContent] = useState()

   //흡기 선?
  const [inF, setInF] = useState(-1);
   //세션 세팅 완료
  const [inFDone, setInFDone] = useState(false);

   // 첫 가이드 컨텐츠 세팅 후 전체 세션 진행 수 설정 (흡기 선 breath*2, 호기 breathC *2 -1)
  const [sessionVol, setSessionVol] = useState(0);

   // 호/흡 세션 완료 후 timer로 전환 여부
  const [timerReady, setTimerReady] = useState(false);
  
   //첫 가이드 컨텐츠 세팅
  useEffect(()=>{
    if(inF !== -1){
      if(inF && timerReady===false){//흡기 선
        setGaugeContent({r11:"1", r12:breathCount, r2:"IN"})
        setSessionVol(breathCount*2);
      }
      else if(!inF && timerReady===false){//호기 선
        setGaugeContent({r11:"1", r12:breathCount, r2:"OUT"})
        setSessionVol(breathCount*2-1);
      }
      setSessionCount(1);
    }
  },[inF, timerReady])
  
  // 세션 카운트
  const [sessionCount, setSessionCount] = useState(0);

  // in<->out flip
  let inOutFlip = (val) =>{
    if(val == "IN"){
      return "OUT"
    }
    else{
      return "IN"
    }
  }

  // 호<->흡 바뀌면서 컨텐츠 바꾸기
  let sessionFlip = () => {
    if(sessionCount > sessionVol){
      setTimerReady(true);
      return;
    }
    if(sessionCount !== 0 && sessionCount%2 == 0){ //짝수면 카운트업
      let tgC = parseInt(gaugeContent.r11) + 1
      setGaugeContent({r11:tgC, r12: breathCount, r2: inOutFlip(gaugeContent.r2)});
    }
    else{
      setGaugeContent({...gaugeContent, r2: inOutFlip(gaugeContent.r2)});
    }
  }
  useEffect(()=>{
    if(sessionCount !== 1 && sessionCount !== 0){
      sessionFlip();
    }
  },[sessionCount])
  
  const [timerTick, setTimerTick] = useState(250); //default 250 (6/15)
  const [timerRunStat, setTimerRunStat] = useState(false);
  useEffect(()=>{
    if(timerRunStat){
      let i =1;
      setInterval(() => {
        if(i>60)return;
        itemRef.current[i++].classList += " tickColor";
      }, timerTick);
    }
  },[timerRunStat])
  


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

        return result[result.length-1];
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

  const inhaleCoefficient = 1.0364756559407444; // 흡기 계수 (API에서 가져올 예정)
  const exhaleCoefficient = 1.0581318835872322; // 호기 계수


  const [dataResult, setDataResult] = useState([]);
  // 기기 없음 메세지
  const [noneDevice, setNoneDevice] = useState(false);
  // 시작확인 메세지
  const [startMsg, setStartMsg] = useState(false);
  // 검사 시작 전 구독상태
  const [notifyStart, setNotifyStart] = useState(false);
  // 구독 완료
  const [notifyDone, setNotifyDone] = useState(false);
  // 검사버튼 먼저 누르고 온 경우 notify 확인 후 구독 완료
  const [alNotifyDone, setAlNotifyDone] = useState(false);
  // 검사 시작 전 준비완료 상태(구독완)
  const [meaPreStart, setMeaPreStart] = useState(false);

  // 검사 활성화위한 호기 감지
  const [blow, setBlow] = useState(false);
  // 호기 감지 후 검사 활성화
  const [blowF, setBlowF] = useState(false);

  // 검사 시작 상태
  const [meaStart, setMeaStart] = useState(false);
  // 데이터 리스트
  const [dataList, setDataList] = useState([]);
  // real데이터 리스트
  const [realDataList, setRealDataList] = useState([]);
  // 검사시작 flag, 이 이후로 realData
  const [flag, setFlag] = useState(-1)

  // volume-flow 그래프 좌표
  const [volumeFlowList, setVolumeFlowList] = useState([]);
  const [timeVolumeList, setTimeVolumeList] = useState([]);
  // let TvolumeFlowList = [];
  // time-volume 그래프 좌표
  // const [timeVolumeList, setTimeVolumeList] = useState([]);

//----------------------------------------------------------------------------------------------- 111111

  // 기기 연결 여부 검사
  useEffect(()=>{
    if(deviceInfo.gatt){ //리스트에 있으면
      setNoneDevice(false);
      if(!deviceInfo.gatt.connected){ //연결여부
        //디바이스 연결X
        setNoneDevice(true);
        setDisconnectStat(true);
        window.api.send("getConnectedDevice", "");
      }
      else{
        // 연결 O
        setNotifyStart(true);
      }
    }
    else{ //기기없으면
      setNoneDevice(true);
      setDisconnectStat(true);
    }
  })
  
  //기기 없음 메세지 띄우기
  useEffect(()=>{
    if(noneDevice){
      console.log("기기없음 메세지")
    }
  },[noneDevice])
//----------------------------------------------------------------------------------------------- 222222
  
  // 연결 확인 & 구독 시작
  useEffect(()=>{
    if(notifyStart){
      console.log("연결확인 및 구독")
      testIt()
    }
  },[notifyStart])

//----------------------------------------------------------------------------------------------- 

  // 준비완료 알림창
  const [readyAlert, setReadyAlert] = useState(false);
  useEffect(()=>{
    if(notifyDone){
      setReadyAlert(true);
      let time = setTimeout(() => {
        setMeaPreStart(true);
      }, 1000);
    }
  },[notifyDone])
  useEffect(()=>{
    if(meaPreStart){ //구독 완료시
      // setDataList([])
    }
    else{
      secondBtnRef.current.classList += " disabled";
    }
  },[meaPreStart])

//----------------------------------------------------------------------------------------------- 44444
  // 구독 완료 후 처리

  useEffect(()=>{
    if(alNotifyDone){
      if(dataList.length == 0){
        // setNotifyDone(true);
        setBlow(true);
      }
    }
  },[alNotifyDone])

  useEffect(()=>{ 
    if(dataList[0] == '2'){
      setNotifyDone(true);
    }
    if(dataList[0] == '2' && dataList[1] == '2' && dataList[2] == '2'){
      setBlow(true);
    }
    if(blow==true&&blowF==false){
      console.log(dataList[dataList.length-1].slice(0,1))
      if(dataList[dataList.length-1].slice(0,1) == "0"){
        //css 변화로 검사 활성화
        if(secondBtnRef.current.classList.contains("disabled")){
          secondBtnRef.current.classList.remove("disabled");
        }
      }
    }
  },[dataList])
//-----------------------------------------------------------------------------------------------
  // 시작 확인 시 flag 세우기 -> 처리할 데이터 슬라이싱
  useEffect(()=>{
    if(meaStart){

      let time = setTimeout(() => {
        setFlag({idx: dataList.length, rIdx: 1}); // idx : dataList에서의 인덱스, rIdx : realData에서의 인덱스
      }, 1000);
    }
  },[meaStart])
  
//-----------------------------------------------------------------------------------------------

  const [rawDataList, setRawDataList] = useState([0]); // raw data 처리 전 (0만 뗀거)
  const [calDataList, setCalDataList] = useState([]); // raw data 처리 -> time/volume/lps/exhale
  const [calFlag, setCalFlag] = useState(0); // calDataList에서 그래프 좌표로 처리할 index=>현재 처리된 index

  // 그래프 좌표 생성 시작
  useEffect(()=>{
    if(calDataList[calFlag]){
      let item = calDataList[calFlag];
      setVFGraphData(item.volume, item.lps);
      setTVGraphData(item.time, item.volume, item.exhale);
      setCalFlag(calFlag+1);
    }
  },[flag, calDataList])

  // raw데이터 들어오면 -> rawDataList에 넣기
  useEffect(()=>{
    if(flag.idx>0 && dataList[flag.idx]){

      // let data = [...dataList.slice(parseInt(flag))];

      let currItemR = dataList[flag.idx]; //현재 다룰 raw 데이터
      let currItem = dataCalculateStrategyE.convert(currItemR); // 데이터 전처리 후
      let preItem = rawDataList[flag.rIdx-1]; //그 이전 데이터


      let TrawDataList = [...rawDataList];
      
      // 호 <-> 흡 바뀔 때 0 넣기 주석
      // let currItemR = data[data.length-1]; //방금 들어온 raw 데이터
      // let currItem = dataCalculateStrategyE.convert(currItemR); // 데이터 전처리 후
      // if(dataCalculateStrategyE.isExhale(preItem) !== dataCalculateStrategyE.isExhale(currItem)){
      //   TrawDataList.push(dataCalculateStrategyE.getZero(dataCalculateStrategyE.isExhale(currItem)));
      // }

      TrawDataList.push(currItem);
      setRawDataList(TrawDataList);
      setFlag({idx : flag.idx+1, rIdx: flag.rIdx+1})
      
      // console.log(123);
      // setVolumeFlowList(setVFGraphData(item.volume, item.lps));
    }
  },[dataList, flag])


//-----------------------------------------------------------------------------------------------
  // raw 데이터 입력 시 처리 process

  // calibratedLps -> api에서 추출
  const [calibratedLps, setCalibratedLps] = useState(-10);
  const [cTime, setCTime] = useState();
  const [cVolume, setCVolume] = useState(-999);
  const [cExhale, setCExhale] = useState();
  useEffect(()=>{
    let previous = rawDataList[rawDataList.length-2];
    let current = rawDataList[rawDataList.length-1];
    let time = dataCalculateStrategyE.getTime(current);
    let lps = dataCalculateStrategyE.getCalibratedLPS(calibratedLps, previous, current, inhaleCoefficient, exhaleCoefficient);
    let exhale = dataCalculateStrategyE.isExhale(current);
    

    if(cExhale !== exhale){
      if(sessionVol !== 0 ){
        let tempSesCnt = sessionCount + 1
        setSessionCount(tempSesCnt); 
      }
    }
    if(cExhale && timerReady && !timerStart && !measureDone){
      setTimerStart(true);
    }

    setCExhale(exhale);
    setCTime(time);
    setCalibratedLps(lps)
  },[rawDataList])

  useEffect(()=>{
    if(calibratedLps !== -10){
      let volume = dataCalculateStrategyE.getVolume(calibratedLps, cTime);
      setCVolume(volume);
    }
  },[calibratedLps]);
  useEffect(()=>{
    if(cVolume !== -999){
      let metrics = new FluidMetrics(cTime, calibratedLps, cVolume);
      metrics.setExhale(cExhale);
      calDataList.push(metrics);
      setCalDataList(calDataList);

    }
  },[cVolume])
  
//-----------------------------------------------------------------------------------------------
  // 시작 메세지 띄우기
  useEffect(()=>{
    if(blowF){
      console.log("메세지 띄우려면")
      setStartMsg(true);
    }
  },[blowF])

  useEffect(()=>{
    if(startMsg){
      //시작 메세지 띄우기
      console.log("시작 메세지 띄우기")
      setConfirmStat(true);
      // setDataList([])
      // setMeaStart(true);
    }
  },[startMsg])

//-----------------------------------------------------------------------------------------------

  // volume-flow 그래프 좌표 함수
  let setVFGraphData = ( rawV, rawF )=>{
    try{
      let x, y;
      let preXY; //이전값
      // preXY 값 할당
      // let TvolumeFlowList = [...volumeFlowList];
      //초기값 세팅
      if(volumeFlowList.length == 0){
        preXY = {x:0, y:0}
      }
      else{
        preXY = volumeFlowList[calFlag-1]
      }
  
      // 흡기 시
      if (rawF < 0){
        if(!inFDone && meaStart && rawV!==0){ //흡기선?
          setInF(true);
          setInFDone(true);
        }
        
        // if(preXY['y']<=0 && sessionVol !== 0 ){
        //   let tempSesCnt = sessionCount + 1
        //   setSessionCount(tempSesCnt); 
        // }

        //x값 처리
        // x값 최저
        if (preXY['x'] == 0){
          // 현재 x값 오른쪽 밀기
          // TvolumeFlowList.forEach((item, idx) =>{
          //     let itemTemp = {...item};
          //     itemTemp['x'] += rawV;
          //     TvolumeFlowList[idx] = itemTemp; //setState로 변경사항 setState(temp);
          // })
          setVolumeFlowList(volumeFlowList.map((item)=>{
            item['x'] += rawV;
          }))
          x = 0;
        }
        else{
          let vTemp = preXY['x']-rawV;
          if(vTemp<0){
              // 현재 x값 오른쪽 밀기
              // TvolumeFlowList.forEach(item =>{
              //     let itemTemp = {...item};
              //     itemTemp['x'] += Math.abs(vTemp);
              //     item = itemTemp; //setState로 변경사항 setState(temp);
              // })
              setVolumeFlowList(volumeFlowList.map((item)=>{
                item['x'] += Math.abs(vTemp);
              }))
              x = 0;
          }
          else{
            x = vTemp;
          }
        }
      }
      //호기 시
      else{
        if(!inFDone && meaStart && rawV!==0){ //호기선?
          setInF(false);
          // console.log("hererer")
          setInFDone(true);
        }
        // if(preXY['y']<=0 && sessionVol !== 0 ){
        //   let tempSesCnt = sessionCount + 1
        //   setSessionCount(tempSesCnt); 
        // }
        x = preXY['x'] + rawV;
      }
      
      volumeFlowList.push({x: x, y:rawF});
      console.log(volumeFlowList);
      setVolumeFlowList(volumeFlowList);
      if(timerReady && timerStart){
        if(rawF == 0){
          setTimerStart(false);
          setMeasureDone(true);
        }
      }
      // return {x: x, y:rawF};
    }
    catch(err){
      console.log(err)
    }
    
  }
//-----------------------------------------------------------------------------------------------
  // timeVolume flag(흡기 시 설정)
  const [calFlagTV,setCalFlagTV] = useState(0);
  // timeVolume 그래프 좌표 생성 함수
  let setTVGraphData = (rawT, rawV, exhale)=>{
    let x, y;
    let preXY;
    let prefix = 1;

    if (timeVolumeList.length==0){
      x = 0;
      y = 0;
    }
    else{
      if (exhale !== calDataList[calFlag-1].exhale) prefix *= -1;
      x = rawT+timeVolumeList[calFlagTV-1].x;
      y = timeVolumeList[calFlagTV-1].y + (prefix * rawV)
    }
    if(volumeFlowList[volumeFlowList.length-1].y < 0){
      setTimeVolumeList([]);
      setCalFlagTV(0);
    }else{
      timeVolumeList.push({x:x, y:y});

      setTimeVolumeList(timeVolumeList);
      setCalFlagTV(calFlagTV+1);
    }
  }

//----------------------------------------------------------------------------------------------- 333333
  let txCharRef = useRef();
  // 검사 구독 함수
  async function testIt() {
    let options = {
      acceptAllDevices: true, // show all
      optionalServices: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e'],
    };
    try{
      // GATT 서버 연결
      const server = await deviceInfo.gatt.connect();
      // Nordic UART Service 가져오기
      const service = await server.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e');
    
      // 수신 특성 가져오기
      const rxCharacteristic = await service.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e');
      
      // 송신 특성 가져오기
      // const txCharacteristic = await service.getCharacteristic('6e400003-b5a3-f393-e0a9-e50e24dcca9e');
      txCharRef.current = await service.getCharacteristic('6e400003-b5a3-f393-e0a9-e50e24dcca9e');

      // 검사하기 버튼 누르고 쓸 부분
      // Notify(구독) 활성화
      // await txCharacteristic.startNotifications();
      await txCharRef.current.startNotifications();
      if(txCharRef.current.properties['notify'] === true){
        setAlNotifyDone(true);
      }
      // Notify(구독) 이벤트 핸들러 등록
      txCharRef.current.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
      console.log('Connected to BLE device');
      
    }
    catch(error){
      console.log(error);
      //     console.error('Failed to select device:', error);
      //     console.log('Failed to select device. Please try again.');
    }
  }
  function onDisconnected(event) {
    // Object event.target is Bluetooth Device getting disconnected.
    console.log('> Bluetooth Device disconnected');
  }
  
  // rawData 문자열
  let [result, setResult] = useState();
  //데이터 문자로 바꾸기
  let arrayToString = (temp)=>{
    let buffer = temp.buffer;
    let rawData = String.fromCharCode.apply(null, Array.from(new Uint8Array(buffer))).trim()
    dataList.push(rawData);
    setDataList([...dataList]);
    return String.fromCharCode.apply(null, Array.from(new Uint8Array(buffer))).trim()
  }
  //데이터 핸들링
  let deviceDataHandling = (arr)=>{
    let tempArr = [];
    arr.forEach((item)=>{
        tempArr.push(arrayToString(item))                                                                                                                                                                                                       
    })
    setResult(tempArr.join(' '));
  }
  // 데이터 출력
  function handleCharacteristicValueChanged(event) {
    const value = event.target.value;
    // 데이터 처리 및 UART 프로토콜 해석

    console.log('Received data:', value);
    arrayToString(value)
  }




//-----------------------------------------------------------------------------------------------
  // 그래프 설정
  ChartJS.register(RadialLinearScale, LineElement, Tooltip, Legend, ...registerables);
  const location = useLocation();

  //결과 그래프 목록 요청 FVC

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
        // min: 0,
        // max: 5,
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
  }


  
//-----------------------------------------------------------------------------------------------

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
        setTemp(true);
        if(chartRef.current){
          chartRef.current.resize();
        };
      }
      else{
        setTemp(false)

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


//-----------------------------------------------------------------------------------------------
  // 그래프 그리기

  const graphStyle = {width:"0px" ,height:"0px", transition:"none"}

  const chartRef = useRef();

  const measurementEnd = ()=>{
    axios.post(`/subjects/1234/types/fvc/measurements`, 
    {
      serialNumber:"970222",
      bronchodilator: "pre",
      data:"000000000 000000000 126924999 105047761 103838213 103320572 103075786 102943239 102866735 102849851 102870002 102891412 102899555 102918380 102961015 103014671 103070532 103136921 103204506 103263671 103317158 103365782 103415871 103480419 103550957 103626483 103721017 103834866 103984180 104211153 104499493 104904872 105338869 105955816 106746424 107745517 109086141 113451132 119519839 120138454 030052011 004842118 002453991 001980650 001726161 001548197 001424058 001344006 001292535 001256386 001229456 001204358 001182884 001169258 001156269 001149000 001145803 001147655 001156232 001158712 001155712 001154499 001149522 001149780 001164072 001172014 001173465 001175152 001177922 001178485 001174321 001171871 001168485 001171650 001162639 001161795 001164926 001175002 001166350 001172705 001179700 001185469 001180635 001193177 001199091 001198823 001190205 001207255 001221689 001240795 001249712 001246816 001240284 001233813 001231849 001242631 001249665 001250247 001260521 001270026 001266723 001267207 001269873 001270530 001277364 001284371 001306779 001307426 001304650 001307101 001309329 001307473 001325509 001343393 001355753 001358059 001357510 001363585 001358634 001371314 001374710 001376778 001384640 001387011 001386841 001381364 001385161 001387877 001393890 001399288 001414767 001428969 001447796 001462064 001458235 001466061 001473629 001474056 001481474 001496375 001507764 001502277 001509324 001499681 001503103 001506491 001513018 001517993 001516706 001524027 001531436 001530926 001535886 001535572 001541895 001540489 001533595 001542174 001548565 001559930 001558649 001566502 001562860 001559356 001573239 001571072 001579215 001592789 001607743 001620722 001635084 001639286 001644397 001634762 001633607 001632202 001632479 001622104 001626892 001623572 001622531 001618556 001638254 001636676 001628179 001634083 001644276 001644565 001661064 001674290 001688056 001708525 001698041 001711679 001734100 001743333 001740591 001747938 001743753 001730991 001733607 001733342 001747259 001759596 001772005 001761434 001769562 001785885 001788733 001785835 001785187 001787319 001791187 001798476 001800512 001808660 001813525 001826618 001841157 001869921 001864649 001843237 001828476 001812025 001804606 001810500 001798395 001789413 001786484 001790402 001810067 001838073 001846257 001850456 001874823 001871260 001885873 001897203 001909556 001906264 001912781 001923458 001943286 001947394 001948761 001944631 001953137 001956566 001953267 001946480 001953437 001958192 001965968 001956443 001954438 001933395 001915698 001922851 001943698 001932690 001939024 001944745 001968801 001988469 001997283 002015517 002027303 002016538 002025139 002039674 002067500 002091555 002138376 002143663 002147625 002180289 002192757 002213541 002235082 002237870 002236548 002217140 002205874 002213491 002221305 002241636 002281259 002335190 002353488 002368103 002415183 002445377 002510056 002589690 002656087 002711677 002749819 002776846 002832386 002879495 002903907 002932131 002950502 002978106 003003006 003016268 003064441 003156719 003235294 003369913 003516804 003668921 003862248 004069411 004268124 004461844 004749987 005088580 005583262 005925423 006561897 007469709 008681521 011158058 119678463 109415346 106145923 105226592 104758710 104297766 103828540 103533963 103351548 103239957 103188476 103176524 103189304 103214505 103250217 103281722 103298956 103302194 103298053 103306458 103315802 103309779 103304213 103305835 103316418 103331716 103344156 103361401 103387108 103420618 103462411 103506188 103559575 103623438 103692884 103772742 103846546 103911708 103969921 104032268 104091738 104141497 104194800 104242480 104297365 104341412 104367300 104421686 104537831 104699619 104889206 105037510 105179897 105377112 105638661 105860598 105929321 106019935 106216283 106405653 106707794 107353198 108294536 109599354 111725725 019359874 004359485 002497781 001950276 001664349 001526452 001453275 001395829 001376321 001358323 001353099 001353354 001359418 001360377 001371277 001383532 001389380 001399639 001415303 001436559 001460396 001467896 001469713 001461040 001451852 001448634 001453402 001458402 001463401 001459103 001452471 001463265 001468443 001482529 001499094 001510820 001507538 001523650 001538308 001541499 001542563 001548539 001562319 001594301 001627149 001661136 001686072 001691216 001697087 001711944 001720326 001733734 001728265 001726654 001733863 001737238 001742126 001758757 001781143 001796516 001810975 001825429 001851975 001867251 001875293 001873578 001882213 001879337 001882197 001891197 001898154 001910095 001920881 001924127 001923809 001923561 001944942 001971389 001974018 001953800 001945123 001904210 001889073 001879852 001856705 001857500 001860376 001860997 001876172 001898269 001923042 001920974 001908356 001897976 001911789 001926698 001920672 001924575 001932174 001938875 001944836 001937838 001929826 001918058 001919437 001910479 001882600 001865334 001863585 001844355 001831409 001819344 001806216 001816751 001814314 001824161 001825823 001842788 001866585 001863481 001855910 001864057 001866488 001848832 001823207 001813373 001828159 001853332 001862594 001865234 001874990 001890737 001903086 001920481 001925604 001915225 001923159 001925231 001924342 001930475 001932279 001933097 001934618 001920018 001912621 001913869 001922051 001951030 001947556 001958241 001976588 001988733 001981465 001978420 002003137 002036159 002054802 002063250 002072184 002087191 002102580 002120232 002116041 002129529 002144498 002149937 002164574 002187006 002209136 002228575 002243378 002245328 002268165 002304363 002332218 002367896 002431707 002487216 002532181 002570232 002606592 002618235 002665602 002737396 002820356 002876536 002910237 002928823 002950978 003007517 003054832 003085611 003148488 003238850 003298086 003375595 003421994 003470176 003574881 003692479 003877810 004037828 004201675 004377860 004466172 004455592 004463434 004641775 004860501 004959290 004962113 005029409 005050004 004999951 005007312 005059302 005090349 005221328 005271303 005396135 005584131 005720327 006020713 006328612 006633580 007154554 008069330 009280556 010956214 012846188 015098351 020065758 052303707",
      date:"2023-11-6"
    },{
      headers: {
        Authorization: `Bearer ${cookies.get('accessToken')}`
    }},
    {withCredentials : true})
    .then((res)=>{
      console.log(res);
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  // volumeFlow 그래프 그리기
  useEffect(()=>{
    console.log(rawDataList)
    // let dataList1=[]
    // console.log(volumeFlowList);
    // volumeFlowList.forEach((item,index)=>{
    //   dataList1.push(item)

      
    // })
    // console.log(dataList1)
    let data = {
      labels: '',
      datasets: [{
        label: "",
            data: volumeFlowList,
            borderColor: `red`,
            borderWidth: 2.5,
            showLine: true,
            tension: 0.4
      }],
    }
    console.log(data)
    setGraphData(data);
  },[calFlag])
  
  let initGraphData = ()=>{
    let data = {
      labels: '',
      datasets: [{
        label: "",
            data: [],
            borderColor: `red`,
            borderWidth: 2.5,
            showLine: true,
            tension: 0.4
      }],
    }
    console.log(data)
    setGraphData(data);
  }

  useEffect(()=>{
    let time = setTimeout(() => {
      setTemp(true);
    },1000);
    console.log(graphData)
  },[graphData])


  // timeVolume 그래프 그리기
  useEffect(()=>{
    // console.log(dataList[dataList.length-1]);
    // let dataList1=[]
    // if(dataList.length !==0 &&dataList[dataList.length-1].toString().substring(0,1) === '0'){
    //   console.log(timeVolumeList);
    //   timeVolumeList.forEach((item,index)=>{
    //     dataList1.push(item)
        
    //   })
    // }
    
    // console.log(timeVolumeList)
    let data = {
      labels: '',
      datasets: [{
        label: "",
            data: timeVolumeList,
            borderColor: `red`,
            borderWidth: 2.5,
            showLine: true,
            tension: 0.4
      }],
    }
    console.log(data)
    setGraphData2(data);
  },[calFlag])

  useEffect(()=>{
    
    let time = setTimeout(() => {
      setTemp(true);
    },1000);
    console.log(graphData2)
  },[graphData2])


//-----------------------------------------------------------------------------------------------
  // 확인창 
  const [confirmStat, setConfirmStat] = useState(false);
  let confirmFunc = (val)=>{
    if(val=="confirm"){
      setMeaStart(true);
    }
  }
//-----------------------------------------------------------------------------------------------
  // 확인창 
  const [disconnectStat, setDisconnectStat] = useState(false);
  let disconnectConfirmFunc = (val)=>{
    if(val=="confirm"){
      navigatorR("/setting");
    }
  }
//-----------------------------------------------------------------------------------------------
  // 게이지

  //게이지 틱 ref
  let itemRef = useRef([]);

  // 런타임 시간
  const [runTime, setRunTime] = useState(0);
  // 타이머 시작 여부
  const [timerStart, setTimerStart] = useState(false);
  // 틱 색 변화 인덱스
  const [tickColorIdx, setTickColorIdx] = useState(0);
  
  // 런타임 중 틱 인덱스 설정
  useEffect(()=>{
    if(runTime%timerTick == 0 && runTime != 0){
      setTickColorIdx(tickColorIdx+1);
    }
  },[runTime])

  // 틱 인덱스 설정 시 틱 색깔 설정
  useEffect(()=>{
    if(tickColorIdx > 0 && tickColorIdx <= 59){
      console.log(tickColorIdx)
      itemRef.current[tickColorIdx].classList += " tickColor"
    }
  },[tickColorIdx])

//-----------------------------------------------------------------------------------------------
  
  return(
    <div className="measurement-page-container">
      {confirmStat ? <Confirm content="검사를 시작하시겠습니까?" btn={true} onOff={setConfirmStat} select={confirmFunc}/> : null}
      {disconnectStat ? <Confirm content={"연결된 Spirokit기기가 없습니다.\n설정 페이지로 이동해서 Spirokit을 연결해주세요."} btn={true} onOff={setDisconnectStat} select={disconnectConfirmFunc}/> : null}
      {readyAlert ? <Confirm content="준비 중입니다..." btn={false} onOff={setReadyAlert} select={confirmFunc}/> : null}
        <div className="measurement-page-nav" onClick={()=>{console.log()}}>
          <div className='measurement-page-backBtn' onClick={()=>{navigatorR(-1)}}>
            <FontAwesomeIcon icon={faChevronLeft} style={{color: "#4b75d6"}} />
          </div>
          <p onClick={()=>{
            console.log(txCharRef.current);
          }}>검사</p>
        </div>


        <div className="measurement-page-left-container">
          <div className="measure-gauge-container">
              <div className="gauge-container">
                <div className="gaugeItem" ref={el=>itemRef.current[1]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[2]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[3]=el} ><p></p></div>       
                <div className="gaugeItem" ref={el=>itemRef.current[4]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[5]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[6]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[7]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[8]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[9]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[10]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[11]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[12]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[13]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[14]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[15]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[16]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[17]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[18]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[19]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[20]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[21]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[22]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[23]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[24]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[25]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[26]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[27]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[28]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[29]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[30]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[31]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[32]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[33]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[34]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[35]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[36]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[37]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[38]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[39]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[40]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[41]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[42]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[43]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[44]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[45]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[46]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[47]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[48]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[49]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[50]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[51]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[52]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[53]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[54]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[55]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[56]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[57]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[58]=el} ><p></p></div>
                <div className="gaugeItem" ref={el=>itemRef.current[59]=el} ><p></p></div>
                <div className='gaugeItem startColor' ref={el=>itemRef.current[60]=el} ><p></p></div>
                <div className='gauge-status'>
                  {
                    inFDone?
                      timerReady ?
                      <Timer setRunTime={setRunTime} runTime={runTime} start={timerStart} stop={stopTime}/>
                      :
                      sessionVol !== 0 ? 
                      <div className='gauge-status-content'>
                        <div>{gaugeContent.r11}/{gaugeContent.r12}</div>
                        <p>{gaugeContent.r2}</p>
                      </div>
                      :
                      <p>준비</p>  
                    :
                    <p>준비</p>
                  }
                </div>
              </div>
          </div>
          <div className="measure-msg-container">
            <div>
              {/* <Timer setRunTime={setRunTime} runTime={runTime} start={timerStart} stop={stopTime}/> */}
            </div>
            {
            meaPreStart?
              meaStart? 
              <p className='measure-msg'>{"편하게 호흡을 시작해주세요."}</p>
              :
              <p className='measure-msg'>{"바람을 불어서 활성화해주세요."}</p>
            :
              notifyDone?
              // <p className="measure-msg">준비중입니다...</p>
              null
              :
              <p className='measure-msg'>{noneDevice==false?"SpiroKit 연동이 완료되었습니다.\nSpiroKit 동작버튼을 켜주시고, 마우스피스 입구에 살짝 입김을 불어 검사 시작 버튼을 활성화 해주세요.":"SpiroKit 연동이 필요합니다."}</p>
            }
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

          <div className="three-btn-container">
            <div onClick={()=>{
              // console.log({"nonDevice":noneDevice,"notifyStart":notifyStart,"notifyDone":notifyDone,"meaPreStart":meaPreStart, "blow":blow, "blowF":blowF, "meaStart":meaStart})
              setInF(-1);
              setInFDone(false);
              setVolumeFlowList([{x:0, y:0}]);
              setTimeVolumeList([{x:0, y:0}]);
              setCalDataList([calDataList[0]]);
              setCalFlagTV(1);
              setCalFlag(1);
              setTimerReady(false);
              setRunTime(0);
              setMeasureDone(false);
            }}>재검사</div>
            <div ref={secondBtnRef} onClick={()=>{
              if(!(secondBtnRef.current.classList.contains("disabled"))){
                setBlowF(true);
              }
            }}>검사시작</div>
            <div onClick={()=>{
              console.log(volumeFlowList, timeVolumeList);

              // measurementEnd();
            }}>버튼3</div>
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

