import { StyleSheet } from 'react-native';

const HomepageStyles = (isDarkMode: boolean, color: string) => 
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: 10,
      borderRadius: 10,
      backgroundColor: isDarkMode ? '#2a2a2a' : '#f0f0f0',
      alignSelf: 'center',
      width: '70%',
      marginBottom: 15
    },
    optionContainer: {
      alignItems: 'center',
    },
    text: {
      color: isDarkMode ? '#e0e0e0' : 'gray',
      fontSize: 11,
      marginTop: 5,
    },
    selectedText: {
      color: color,
      fontWeight: 'bold',
    },
  });

export default HomepageStyles;