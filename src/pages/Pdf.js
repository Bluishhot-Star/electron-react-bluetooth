import React, { useState,useEffect } from 'react';
import PdfView from "../components/PdfView.js";
import { PDFViewer } from '@react-pdf/renderer';
import { useNavigate,useLocation } from 'react-router-dom'

function Pdf() {
  let navigatorR = useNavigate();
  const location = useLocation();
  const state = location.state;
  useEffect(()=>{
    console.log(state);
  },[])
  return (
      <div>
        <div onClick={()=>{navigatorR(-1)}}>back</div>
      <PDFViewer style={{width:1100, height:700}}>
        <PdfView data={state}/>
      </PDFViewer> 
      </div>
  );
}


export default Pdf;