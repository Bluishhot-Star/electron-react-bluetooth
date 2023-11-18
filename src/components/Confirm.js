import { useEffect } from "react";
function Confirm(props){
  const click = (e, num) => {
    console.log(e);
    if(num === 0){ //확인
      props.select("confirm");
    }
    // else if(num === 1){
      
    // }
    props.onOff(false);
  }

  useEffect(()=>{
    if(props.btn == false){
      setTimeout(() => {
        props.onOff(false);
      }, 3000);
    }
  },[])
  return(
    <>
      <div className="confirm-bg">
        <div className="confirm-container" onClick={(e)=>{e.stopPropagation(); return;}}>
          <div className="confirm-logo"><p>The SpiroKit</p></div>
          <div className="confirm-msg-container">
            <p>{props.content}</p>
          </div>
            {
              props.btn ?
              <div className="confirm-Btn-container">
                <input className="confirm-Btn confirm-enter" type="button" value="확인" onClick={(e)=>{e.preventDefault();click(e, 0)}}/>
                <input className="confirm-Btn confirm-cancel" type="button" value="취소" onClick={(e)=>{e.preventDefault();click(e, 1)}}/>
              </div>
              :
              <div className="loader-1 center"><span></span></div>
            }
        </div>
      </div>
    </>
  )
}
export default Confirm;