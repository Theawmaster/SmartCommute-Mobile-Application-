import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const TaxihomelayoutStyles = (isDarkMode: boolean, color: string, fontsize: number) => {
  // Common colors
  const textColor = isDarkMode ? '#fff' : '#000';
  const backgroundColor = isDarkMode ? '#121212' : '#fff';
  const cardBackground = isDarkMode ? '#333' : '#fff';
  const modalBackground = isDarkMode ? '#333' : '#fff';

  return StyleSheet.create({
    // Loading styles
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor,
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: textColor,
    },

    // Map styles
    mapContainer: {
      flex: 1,
      width: '100%',
      borderRadius: 8,
      overflow: 'hidden',
    },
    map: {
      flex: 1,
    },
    coordinatesContainer: {
      position: 'absolute',
      bottom: 10,
      left: 10,
      backgroundColor: isDarkMode ? 'rgba(51,51,51,0.8)' : 'rgba(255,255,255,0.8)',
      padding: 8,
      borderRadius: 8,
    },
    coordinatesText: {
      fontSize: fontsize,
      color: textColor,
    },
    warningText: {
      fontSize: 12,
      color: '#ff3333',
      marginTop: 4,
    },

    // Control styles
    customControlsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#444' : '#fff',
      paddingVertical: 10,
      marginHorizontal: 1,
      borderRadius: 10,
      marginBottom: 10,
    },
    customControlButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: color,
      borderRadius: 20,
      marginHorizontal: 5,
    },
    customControlButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },

    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '80%',
      backgroundColor: modalBackground,
      borderRadius: 10,
      padding: 20,
      maxHeight: '70%',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: textColor,
    },
    hotlineItem: {
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#555' : '#ccc',
    },
    hotlineText: {
      fontSize: 16,
      color: textColor,
    },
    closeModalButton: {
      marginTop: 10,
      alignSelf: 'flex-end',
      padding: 10,
    },
    closeModalText: {
      fontSize: 16,
      color: color,
    },

    // Environment indicator
    environmentIndicator: {
      backgroundColor: isDarkMode ? 'rgba(255, 165, 0, 0.6)' : 'rgba(255, 165, 0, 0.8)',
      paddingVertical: 5,
      paddingHorizontal: 10,
      alignItems: 'center',
      marginBottom: 10,
      marginHorizontal: 20,
      borderRadius: 5,
    },
    environmentText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: textColor,
    },
  });
};