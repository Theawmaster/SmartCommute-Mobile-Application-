// styling/farePageDynamicStyles.ts
import { StyleSheet } from 'react-native';

interface DynamicStyleParams {
  isDarkMode: boolean;
  color: string;
  fontsize: number;
}

const farePageDynamicStyles = ({ isDarkMode, color, fontsize }: DynamicStyleParams) =>
  StyleSheet.create({
    container: {
      backgroundColor: isDarkMode ? '#333' : '#fff',
    },
    text: {
      color: isDarkMode ? '#fff' : '#000',
    },
    transportTab: {
      padding: 10,
      marginHorizontal: 5,
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: isDarkMode ? '#00e0e0' : '#00b4b4',
    },
    dropdownHeader: {
      padding: 15,
      borderWidth: 1,
      marginHorizontal: 20,
      borderRadius: 5,
      borderColor: isDarkMode ? '#555' : '#ccc',
      backgroundColor: isDarkMode ? '#333' : '#fff',
    },
    fareOptions: {
      marginHorizontal: 20,
    },
    fareOption: {
      padding: 10,
      borderWidth: 1,
      borderColor: isDarkMode ? '#555' : '#ccc',
      backgroundColor: isDarkMode ? '#333' : '#fff',
      borderTopWidth: 0,
    },
    tableContainer: {
      margin: 20,
      borderWidth: 1,
      borderColor: isDarkMode ? '#555' : '#000',
      borderRadius: 5,
      overflow: 'hidden',
    },
    tableRowHeader: {
      flexDirection: 'row',
      backgroundColor: isDarkMode ? '#005c5c' : color,
    },
    tableHeaderCell: {
      flex: 1,
      padding: 10,
      textAlign: 'center',
      fontWeight: 'bold',
      borderRightWidth: 1,
      borderColor: isDarkMode ? '#555' : '#000',
      color: 'white',
      fontSize: fontsize,
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: isDarkMode ? '#555' : '#000',
      backgroundColor: isDarkMode ? '#222' : '#fff',
      fontSize: fontsize,
    },
    tableCell: {
      flex: 1,
      padding: 10,
      textAlign: 'left',
      borderRightWidth: 1,
      borderColor: isDarkMode ? '#555' : '#000',
      color: isDarkMode ? '#fff' : '#000',
      fontSize: fontsize,
    },
    externalLink: {
      margin: 20,
      padding: 15,
      backgroundColor: isDarkMode ? '#005c5c' : '#00b4b4',
      borderRadius: 20,
      alignItems: 'center',
    },
    linkText: {
      color: 'white',
      fontWeight: 'bold',
    },
    infoText: {
      marginHorizontal: 20,
      marginTop: 10,
      marginBottom: 10,
      textAlign: 'left',
      color: isDarkMode ? '#fff' : '#000',
      fontSize: fontsize,
    },
    linkColor: {
      color: isDarkMode ? '#00e0e0' : '#00b4b4',
      fontSize: fontsize,
    },
    tapToZoomText: {
      textAlign: 'center',
      color: isDarkMode ? '#00e0e0' : '#00b4b4',
      marginTop: 8,
      fontStyle: 'italic',
      fontSize: fontsize,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    closeButton: {
      position: 'absolute',
      right: 20,
      top: 40,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      borderRadius: 20,
      padding: 10,
      zIndex: 1000,
    },
    closeButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: fontsize,
    },
    mapButton: {
      padding: 15,
      marginHorizontal: 20,
      backgroundColor: isDarkMode ? '#005c5c' : '#00b4b4',
      borderRadius: 20,
    },
    mapButtonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

export default farePageDynamicStyles;
