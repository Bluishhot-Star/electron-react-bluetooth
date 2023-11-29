import { useState, useRef, useEffect} from 'react';
function Timer(props){
  let startTime = ()=>{}
  let stopTime = ()=>{}

  const [run, setRun] = useState();
  const [time, setTime] = useState(0);
  const intervalRef = useRef();
  const secondRef = useRef();
  const milliSec10Ref = useRef();
  const milliSec1Ref = useRef();

  
  useEffect(()=>{
    if(props.start){
      setRun(true);
    }
    else{
      clearInterval(intervalRef.current)
      setRun(false);
    }
  },[props.start])
  
  useEffect(()=>{
    let tempTime = 0;
    if(run){
      intervalRef.current = setInterval(() => {
        tempTime += 1;
        timeInterval(tempTime);
      }, 10);
    }
  },[run])
  let timeInterval = (tempTime)=>{

    if(tempTime == props.stop*100+1){
      clearInterval(intervalRef.current)
      setRun(false);
    }
    else{
      setTime(tempTime)
      props.setRunTime(tempTime)
    }
  }

  useEffect(()=>{
    milliSec1Ref.current.innerHTML = time%10; //1의 자리
    milliSec10Ref.current.innerHTML = parseInt((time/10)%10); //10의 자리
    secondRef.current.innerHTML = parseInt(time/100);
  },[time])

  return(
    <>
      <div className="timer-container">
        <p ref={secondRef} className="timer-second">0</p>
        <p>초</p>
        <p ref={milliSec10Ref} className="timer-millisecond">0</p>
        <p ref={milliSec1Ref} className="timer-millisecond">0</p>

      </div>
    </>
  )
}
export default Timer;