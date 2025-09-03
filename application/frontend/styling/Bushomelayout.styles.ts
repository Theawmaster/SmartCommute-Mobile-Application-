import { StyleSheet } from 'react-native';

export const BushomelayoutStyles = (isDarkMode: boolean, color: string, fontsize: number) => {
  // Common colors
  const textColor = isDarkMode ? '#fff' : '#000';
  const secondaryTextColor = isDarkMode ? '#a0a0a0' : '#666';
  const backgroundColor = isDarkMode ? '#121212' : '#fff';
  const cardBackground = isDarkMode ? '#1e1e1e' : '#F5FCFF';
  const borderColor = isDarkMode ? '#333' : '#D3D3D3';

  return StyleSheet.create({
    // Container styles
    safeArea: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000' : '#fff',
    },
    mainContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: 10,
      borderRadius: 10,
      flex: 1,
      backgroundColor,
    },

    // Accordion styles
    accordionBorder: {
      borderWidth: 2,
      borderColor,
      borderRadius: 10,
      marginBottom: 10,
      overflow: 'hidden',
    },
    accordionHeader: {
      backgroundColor: cardBackground,
      padding: 10,
      borderWidth: 1,
      borderColor,
      borderRadius: 10,
    },
    accordionHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    accordionHeaderText: {
      fontSize: fontsize,
      fontWeight: '500',
      color: textColor,
    },
    accordionSubheaderText: {
      fontSize: fontsize - 3,
      fontWeight: '300',
      color: secondaryTextColor,
    },
    accordionContent: {
      alignItems: 'flex-start',
      backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
      padding: 10,
      marginTop: 10,
    },
    accordionActive: {
      backgroundColor: isDarkMode ? '#2a2a2a' : 'rgba(255,255,255,1)',
    },
    accordionInactive: {
      backgroundColor: isDarkMode ? '#1e1e1e' : '#F5F5F5',
    },

    // Bus item styles
    busItemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: 200,
      marginBottom: 20,
    },
    busNumberText: {
      fontSize: fontsize,
      color: textColor,
      marginTop: 2,
    },
    arrivalTimeContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: 120,
      marginRight: 20,
    },
    arrivalTimeText: {
      fontSize: fontsize,
      textAlign: 'center',
      width: 65,
      marginRight: 8,
      color: textColor,
    },
    busTypeText: {
      fontSize: fontsize - 3,
      textAlign: 'center',
      width: 60,
      marginRight: 15,
      color: secondaryTextColor,
    },

    // Loading and error states
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
    },
    loadingText: {
      color: textColor,
    },
    errorText: {
      padding: 20,
      lineHeight: 20,
      fontSize: fontsize,
      color: textColor,
    },

    // Icons
    chevronIcon: {
      color: isDarkMode ? '#666' : 'gray',
    },

    // Modal and Map styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '100%',
      height: '90%',
      backgroundColor: isDarkMode ? '#333' : '#fff',
      borderRadius: 10,
      alignItems: 'center',
      paddingTop: 20,
    },
    modalHeaderRow: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 10,
      marginBottom: 10,
    },
    modalHeader: {
      fontSize: fontsize + 6,
      fontWeight: 'bold',
      marginTop: 15,
      marginBottom: 30,
      color: isDarkMode ? '#fff' : '#000',
    },
    closeButton: {
      position: 'absolute',
      top: 15,
      right: 15,
      zIndex: 1,
    },
    mapContainer: {
      width: '100%',
      height: '90%',
      alignSelf: 'center',
      backgroundColor: 'white',
      borderRadius: 10,
      overflow: 'hidden',
    },
    map: {
      width: '100%',
      height: '100%',
    },

    // Custom control buttons (e.g., current location & overview)
    customControlsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      paddingHorizontal: 10,
      marginBottom: 10,
    },
    customControlButton: {
      backgroundColor: color,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
    },
    customControlButtonText: {
      fontSize: fontsize,
      color: "#fff",
      textAlign: 'center',
    },
  });
};