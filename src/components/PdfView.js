import { useRef, useEffect} from 'react';
import { Page, Text, View, Document, StyleSheet,Font } from '@react-pdf/renderer';
Font.register({
  family: 'SpoqaHanSans',
  src:
    'https://cdn.jsdelivr.net/gh/spoqa/spoqa-han-sans@01ff0283e4f36e159ffbf744b36e16ef742da6d8/Subset/SpoqaHanSans/SpoqaHanSansLight.ttf',
});
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
    width:50,
    padding: 20,
    alignItems: 'center',
    opacity:1
  },
  section: {
    width: 100,
    '@media max-width: 400': {
      width: 300,
    },
    margin: 10,
    padding: 100,
    flexGrow: 1
  },
  korean: {
    fontFamily: 'SpoqaHanSans',
  },
});
function PdfView(props){
useEffect(()=>{
  console.log(props)
})
  return(
    
  <Document>
        <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Section #1</Text>
          <Text style={styles.korean}>{props.data.birth}</Text>
        </View>
        <View style={styles.section}>
          <Text>Section #2</Text>
        </View>
      </Page>
    </Document>
  );
  
};

export default PdfView;