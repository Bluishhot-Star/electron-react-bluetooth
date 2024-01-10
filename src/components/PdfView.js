import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
    width:300,
    padding: 20,
    alignItems: 'center',
    opacity:1
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});
const PdfView = (props) => (
  <Document>
      <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Section #1</Text>
      </View>
      <View style={styles.section}>
        <Text>Section #2</Text>
      </View>
    </Page>
  </Document>
);

export default PdfView;