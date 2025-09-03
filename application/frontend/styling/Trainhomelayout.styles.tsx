import { StyleSheet } from 'react-native';

export const TrainhomelayoutStyles = (isDarkMode: boolean, color: string, fontsize: number) => {
  // Common colors
  const textColor = isDarkMode ? '#fff' : '#000';
  const backgroundColor = isDarkMode ? '#121212' : '#fff';
  const cardBackground = isDarkMode ? '#333' : '#fff';
  const modalBackground = isDarkMode ? '#333' : '#fff';

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#fff',
    },
    accordionBorder: {
      borderWidth: 2,
      borderColor: isDarkMode ? '#333' : '#D3D3D3',
      borderRadius: 10,
      marginBottom: 10,
      overflow: 'hidden',
    },
    accordionHeader: {
      padding: 10,
      backgroundColor: isDarkMode ? '#1e1e1e' : '#F5FCFF',
      borderWidth: 1,
      borderColor: isDarkMode ? '#333' : '#ddd',
      borderRadius: 10,
    },
    accordionHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    headerText: {
      fontSize: fontsize,
      fontWeight: '500',
      color: isDarkMode ? '#fff' : '#000',
    },
    accordionContent: {
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
      padding: 10,
      marginTop: 10,
    },
    active: {
      backgroundColor: isDarkMode ? '#2a2a2a' : 'rgba(255,255,255,1)',
    },
    inactive: {
      backgroundColor: isDarkMode ? '#1e1e1e' : '#F5F5F5',
    },
    crowdLevelContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: 200,
      marginBottom: 20,
    },
    crowdLevelText: {
      fontSize: fontsize,
      color: isDarkMode ? '#fff' : '#000',
    },
    progressBarsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginTop: 10,
    },
    progressBar: {
      marginLeft: 40,
      marginRight: 10,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
    },
    errorText: {
      fontSize: fontsize,
      padding: 20,
      lineHeight: 20,
      color: isDarkMode ? '#fff' : '#000',
    },
    chevronIcon: {
      color: isDarkMode ? '#666' : 'gray',
    },
    // Added styles for modal and map view:
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '90%',
      backgroundColor: isDarkMode ? '#121212' : '#fff',
      borderRadius: 10,
      padding: 20,
    },
    modalHeader: {
      fontSize: fontsize + 2,
      fontWeight: 'bold',
      marginBottom: 10,
      color: isDarkMode ? '#fff' : '#333',
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 1,
    },
    mapContainer: {
      height: 300,
      width: '100%',
      borderRadius: 10,
      overflow: 'hidden',
      marginTop: 20,
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    mapButton: {
      backgroundColor: color,
      padding: 12,
      margin: 16,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    mapButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    mapButtonText: {
      color: '#fff',
      marginLeft: 8,
      fontWeight: '600',
    },
    overviewButton: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      backgroundColor: color,
      padding: 10,
      borderRadius: 20,
    },
    overviewButtonText: {
      color: '#fff',
      fontWeight: '600',
    },
    mapActionButton: {
      backgroundColor: '#5abdb2',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 25,
    },
    mapActionButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 14,
    },
    topButtonRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 10,
      paddingHorizontal: 10,
      gap: 10,
    },
    topButton: {
      flex: 1.5,
      width: '100%',
      height: 38,
      marginHorizontal: 5,
      paddingHorizontal: 15, // Slightly wider spacing inside
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color,
      flexDirection: 'row',
    },    
    topButtonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: fontsize,
      marginLeft: 5,
    }            
  });
};
