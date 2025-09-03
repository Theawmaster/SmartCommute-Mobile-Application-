import { StyleSheet } from 'react-native';

const createStyles = (isDarkMode: boolean, color: string, fontsize: number) =>
  StyleSheet.create({
    container: {
      backgroundColor: isDarkMode ? '#333' : '#fff',
    },
    imageContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    image: {
      width: 350,
      height: 350,
      color: isDarkMode ? '#000' : '#fff',
      resizeMode: 'contain',
    },
    settingsContainer: {
      backgroundColor: isDarkMode ? '#333' : '#fff',
      padding: 16,
      borderRadius: 10,
      marginBottom: 16,
    },
    button: {
      marginBottom: 10,
      backgroundColor: color,
    },
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '84%',
      maxHeight: '50%',
      backgroundColor: isDarkMode ? '#333' : '#fff',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
    },
    modalHeader: {
      fontSize: fontsize + 6,
      fontWeight: 'bold',
      marginBottom: 10,
      color: isDarkMode ? '#fff' : '#000',
    },
    modalBody: {
      fontSize: fontsize,
      color: isDarkMode ? '#ccc' : '#333',
      marginBottom: 20,
      textAlign: 'center',
    },
    modalCloseButton: {
      backgroundColor: color,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    modalCloseButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    modalContent: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    modalSubHeader: {
      fontWeight: 'bold',
      fontSize: 14,
      marginTop: 10,
    },
    // Font Modal Styles
    fontModalContainer: {
      width: '84%',
      backgroundColor: isDarkMode ? '#333' : '#fff',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
      gap:10,
    },
    fontItem: {
      paddingVertical: 12,
      width: '100%',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      alignItems: 'center',
    },
    fontText: {
      fontSize: fontsize,
      color: isDarkMode ? '#fff' : '#000',
    },
    selectedFontItem: {
      backgroundColor: color,
      borderRadius: 5,
    },
    selectedFontText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: fontsize,
    },

    sectionContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.63)',
      paddingHorizontal: 24,
    },
    colormodalCloseButton: {
      position: 'absolute',
      top: 25,
      right: 10,
      backgroundColor: '#5abdb2',
      padding: 10,
      borderRadius: 5,
    },
    colormodalCloseButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    // Language modal styles
    langModalContainer: {
      width: '84%',
      backgroundColor: isDarkMode ? '#333' : '#fff',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
    },
    langItem: {
      paddingVertical: 12,
      width: '100%',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      alignItems: 'center',
    },
    langText: {
      fontSize: fontsize,
      color: isDarkMode ? '#fff' : '#000',
    },
    selectedLangItem: {
      backgroundColor: color,
      borderRadius: 5,
    },
    selectedLangText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    colorPickerWrapper: {
      width: 300,
      height: 300,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    centeredModal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    buttonLabel: {
      color: 'white',
    },
  });

export default createStyles;
