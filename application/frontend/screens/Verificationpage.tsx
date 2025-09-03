import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { useTheme } from '../components/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ServerIP, ServerPort } from '../components/ServerIP';
import { isAndroidStudio } from '../components/locationService';
import { RootStackParamList } from '../App';
import { useTranslation } from 'react-i18next';

// Update the route params type to include an optional email
type VerificationPageRouteParams = {
  verificationType: "L" | "R" | "F"; // L for Login, R for Register, F for Forgot Password
  email: string;
};

type VerificationPageProps = {
  navigation: NavigationProp<RootStackParamList, "VerificationPage">;
  route: RouteProp<RootStackParamList, "VerificationPage">;
};

const Verificationpage: React.FC<VerificationPageProps> = ({ route, navigation }) => {
  // Destructure verificationType and email (default email to empty string if undefined)
  const { verificationType, email = "" } = route.params || {};
  
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const inputsRef: React.RefObject<TextInput>[] = new Array(6)
    .fill(null)
    .map(() => React.createRef());
  
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== '' && index < 5) {
      inputsRef[index + 1].current?.focus();
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputsRef[index - 1].current?.focus();
    }
  };

  const handleVerify = async () => {
    try {
      let response; // Declare response variable outside conditions
  
      if (verificationType === "R") {
        response = await fetch(
          isAndroidStudio
            ? `http://10.0.2.2:${ServerPort}/api/auth/verify`
            : `${ServerIP}:${ServerPort}/api/auth/verify`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ otp: otp.join("") }),
          }
        );
      } else if (verificationType === "L") {
        response = await fetch(
          isAndroidStudio
            ? `http://10.0.2.2:${ServerPort}/api/auth/verifyLoginOTP`
            : `${ServerIP}:${ServerPort}/api/auth/verifyLoginOTP`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ otp: otp.join("") }),
          }
        );
      } else if (verificationType === "F") {
        // For "Forgot Password" scenario, include the email in the request body.
        response = await fetch(
          isAndroidStudio
            ? `http://10.0.2.2:${ServerPort}/api/password/verifyForgotPassword`
            : `${ServerIP}:${ServerPort}/api/password/verifyForgotPassword`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp: otp.join("") }),
          }
        );
      }
  
      if (!response) {
        throw new Error("No response from server");
      }
  
      const result = await response.json();
  
      if (response.ok && verificationType === "L") {
        // Successful OTP verification for login
        Alert.alert(t('VerificationPage.Alerts.VerificationSuccess'));
        const token = result.token;
        console.log(token);
        if (!token) throw new Error("Token is undefined in the response.");
        await AsyncStorage.setItem("authToken", token);
        navigation.navigate("Home");
      } else if (response.ok && verificationType === "R") {
        // Successful OTP verification for registration (or other route)
        Alert.alert(t('VerificationPage.Alerts.VerificationSuccess'));
        navigation.navigate("LoginPage");
      } else if (response.ok && verificationType === "F") {
        // Successful OTP verification for forgot password
        Alert.alert(t('VerificationPage.Alerts.VerificationSuccess'));
        navigation.navigate("ChangePassword", { verificationType: "F", email });
      } else {
        Alert.alert(t(`VerificationPage.BackendMessages.Verify${response.status}`) || "Invalid code.");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      Alert.alert(t('VerificationPage.Alerts.NetworkError'));
    }
  };

  const handleResend = async () => {
    try {
      const response = await fetch(
        isAndroidStudio
        ? `http://10.0.2.2:${ServerPort}/api/auth/resendOTP`
        : `${ServerIP}:${ServerPort}/api/auth/resendOTP`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert(t('VerificationPage.Alerts.ResendSuccess'));
      } else {
        Alert.alert(t(`VerificationPage.BackendMessages.Resend${response.status}`) || "Failed to resend OTP");
      }
    } catch (error) {
      Alert.alert(t('VerificationPage.Alerts.NetworkError'));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="close" size={25} color="#333" style={{ marginLeft: 270 }} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('VerificationPage.Verification')}</Text>
        <Text style={styles.subtitle}>{t('VerificationPage.CodeHeaderText')}</Text>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={inputsRef[index]}
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(value) => handleChange(value, index)}
              onKeyPress={(event) => handleKeyPress(event, index)}
            />
          ))}
        </View>
        <TouchableOpacity onPress={handleResend}>
          <Text style={styles.resend}>{t('VerificationPage.ResendText')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
          <Text style={styles.verifyText}>{t('VerificationPage.VerifyText')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d9d9d9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  otpInput: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    fontSize: 18,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  resend: {
    color: '#007bff',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  verifyButton: {
    backgroundColor: '#00b894',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  verifyText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Verificationpage;
