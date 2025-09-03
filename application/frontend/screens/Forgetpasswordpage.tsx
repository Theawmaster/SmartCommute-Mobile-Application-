import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
  Switch,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationProp } from '@react-navigation/native';
import { useTheme } from "../components/ThemeContext";
import { isAndroidStudio } from '../components/locationService';
import { ServerIP, ServerPort } from '../components/ServerIP';
import { useTranslation } from 'react-i18next';

type LandingPageProps = {
  navigation: NavigationProp<any>;
};

const Forgetpasswordpage: React.FC<LandingPageProps> = ({ navigation }) => {
  const { isDarkMode, toggleTheme, color } = useTheme();
  const [email, setEmail] = useState('');
  const { t } = useTranslation();
  const toggleSwitch = () => toggleTheme();

  const lightModeColors = {
    background: "#fff",
    text: "#000",
    inputBackground: "#fff",
    iconColor: "#888",
    buttonPrimaryBackground: color,
    buttonSecondaryBackground: "#0E9285",
    placeholderColor: "#888",
    borderColor: "#ccc",
  };

  const darkModeColors = {
    background: "#121212",
    text: "#fff",
    inputBackground: "#333",
    iconColor: "#fff",
    buttonPrimaryBackground: color,
    buttonSecondaryBackground: "#166E69",
    placeholderColor: "#bbb",
    borderColor: "#bbb",
  };

  const colors = isDarkMode ? darkModeColors : lightModeColors;

  // Function to send the OTP to the user's email via the forgotPassword endpoint
  const handleSendOTP = async () => {
    if (!email) {
      Alert.alert(t('authentication.Alerts.AlertErrorMessage'), t('authentication.EmptyEmail'));
      return;
    }

    // Email validation: must contain "@" and ".com"
    if (!email.includes('@') || !email.includes('.com')) {
      Alert.alert(t('authentication.Alerts.AlertErrorMessage'), t('authentication.EmailWrongFormat'));
      return;
    }

    try {
      const response = await fetch(isAndroidStudio? `http://10.0.2.2:${ServerPort}/api/password/forgotPassword`: `${ServerIP}:${ServerPort}/api/password/forgotPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert(t(`authentication.backendmessages.ForgetPassword${response.status}`));
        // Navigate to VerificationSelection with verificationType "F" and pass the email along.
        navigation.navigate("VerificationSelection", { verificationType: "F", email });
      } else {
        Alert.alert(t('authentication.Alerts.AlertErrorMessage'), t(`authentication.backendmessages.ForgetPassword${response.status}`));
      }
    } catch (error) {
      Alert.alert(t('authentication.Alerts.AlertErrorMessage'), t('authentication.Alerts.networkerror'));
    }
  };

  return (
    <SafeAreaView style={{flex:1}}>
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("LoginPage")}>
        <Icon name="arrow-left" size={24} color={colors.text} />
      </TouchableOpacity>
      {/* Dark Mode Toggle */}
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isDarkMode}
        style={styles.switch}
      />



      {/* Logo */}
      <Image source={require('../assets/smartcommuteicon.png')} style={styles.image} />

      {/* Title */}
      <Text style={[styles.title, { color: colors.text }]}>{t('authentication.forgetpassword')}</Text>

      {/* Email Input */}
      <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground, borderColor: colors.borderColor }]}>
        <Icon name="email" size={20} color={colors.iconColor} style={styles.icon} />
        <TextInput
          placeholder={t('authentication.email')}
          placeholderTextColor={colors.placeholderColor}
          style={[styles.input, { color: colors.text }]}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Verify Email Button */}
      <TouchableOpacity
        style={[styles.button, { borderRadius: 20, paddingVertical: 8, width:"100%", height:40, backgroundColor: colors.buttonPrimaryBackground }]}
        onPress={handleSendOTP}
      >
        <Text style={styles.buttonText}>{t('authentication.verifyemail')}</Text>
      </TouchableOpacity>

      {/* Sign Up Button */}
      <TouchableOpacity
        style={[styles.button, { borderRadius: 20, paddingVertical: 2, alignSelf:'flex-end', width:"60%", height:27, backgroundColor: colors.buttonPrimaryBackground }]}
        onPress={() => navigation.navigate("SignUpPage")}
      >
        <Text style={styles.buttonText}>{t('authentication.signup')}</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  switch: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  backButton: {
    position: 'absolute',
    top: 25,
    left: 20,
  },
  image: {
    marginTop: -170,
    width: 350,
    height: 350,
    marginBottom: -40,
    resizeMode:"contain",
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 10,
    marginBottom: 15,
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  button: {
    elevation: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Forgetpasswordpage;
