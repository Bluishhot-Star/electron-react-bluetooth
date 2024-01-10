import React, { useState } from 'react';
import PdfView from "../components/PdfView.js";
import { PDFViewer } from '@react-pdf/renderer';

function Pdf() {

  return (
    
      <PDFViewer style={{width:1000, height:500}}>
        <PdfView />
      </PDFViewer> 
  );
}


export default Pdf;