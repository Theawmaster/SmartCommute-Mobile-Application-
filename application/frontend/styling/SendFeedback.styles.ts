import { StyleSheet } from 'react-native';

const SendFeedbackStyles = (isDarkMode: boolean, color: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: isDarkMode ? '#FFF' : 'white',
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    input: {
      width: '100%',
      height: 100,
      borderColor: 'gray',
      borderWidth: 1,
      padding: 10,
      marginBottom: 20,
      textAlignVertical: 'top',
    },
    ratingContainer: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    ratingText: {
      marginRight: 10,
      fontSize: 18,
    },
    imageContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    image: {
      width: 350,
      height: 350,
      resizeMode: 'contain',
    },
    backButton: {
      position: 'absolute',
      padding: 10,
      backgroundColor: color,
      borderRadius: 20,
      top: 20,
      left: 20,
    },
    backButtonText: {
      color: '#fff',
      fontSize: 16,
    },
  });

export default SendFeedbackStyles;
