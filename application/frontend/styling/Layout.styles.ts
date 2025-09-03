import { StyleSheet } from 'react-native';

const LayoutStyles = (isDarkMode: boolean, color: string) =>
  StyleSheet.create({
    safeArea: { flex: 1 },
    container: { flex: 1 },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: 20,
      paddingHorizontal: 20,
      paddingTop: 50,
    },
    searchContainer: {
      flex: 1,
      position: 'relative',
    },
    searchBar: {
      height: 40,
      paddingHorizontal: 10,
      borderRadius: 20,
      marginRight: 10,
    },
    suggestionList: {
      position: 'absolute',
      top: 45,
      left: 0,
      right: 10,
      backgroundColor: '#fff',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#ccc',
      zIndex: 10,
      maxHeight: 150,
    },
    suggestionItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    suggestionText: {
      fontSize: 14,
      color: '#333',
    },
    sunSwitchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sunIcon: {
      width: 30,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    sunText: { fontSize: 24 },
    mainWrapper: {
      flex: 1,
      justifyContent: 'space-between',
    },
    mainContent: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 5, // ensures space for fixed footer
    },    
    navBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 15,
      borderTopWidth: 0,
      borderBottomWidth: 2,
      borderColor: '#ccc',
      backgroundColor: '#fff',
    },
    navItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
    },
    navItemText: { fontSize: 16, fontWeight: 'bold' },
    navItemTextActive: {
      padding: 5,
      marginVertical: -15,
      borderRadius: 5,
      backgroundColor: '#5abdb2',
      color: '#fff',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '80%',
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: '#5abdb2',
      padding: 10,
      borderRadius: 5,
    },
    closeButtonText: { color: '#fff', fontWeight: 'bold' },
    weatherContent: { flexDirection: 'row', alignItems: 'center' },
    weatherIcon: { width: 50, height: 50 },
    weatherText: { marginLeft: 10 },
    // Additional styles as needed...
  });

export default LayoutStyles;
