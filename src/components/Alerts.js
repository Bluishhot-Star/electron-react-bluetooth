function Alert(props){
  return(
    <>
      <div className="alert-container" ref={props.inputRef}>
        <div className="alert-title">The Spirokit</div>
        <div className="alert-contents">
          <p>{props.contents}</p>
        </div>
      </div>
    </>
  )
}
export default Alert;