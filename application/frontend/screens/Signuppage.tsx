import React, { useState } from "react";
import { Switch, SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, KeyboardAvoidingView,
  Platform, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProp } from '@react-navigation/native';
import { useTheme } from "../components/ThemeContext";
import { ServerIP, ServerPort } from '../components/ServerIP';
import { isAndroidStudio} from '../components/locationService';
import { useTranslation } from 'react-i18next';

type LandingPageProps = {
  navigation: NavigationProp<any>;
};

const Signuppage: React.FC<LandingPageProps> = ({ navigation }) => {
  const { isDarkMode, toggleTheme, color } = useTheme();
  const { t } = useTranslation();
  const toggleSwitch = () => {
    toggleTheme(); // Update the context when the switch is toggled
  };
  const lightModeColors = {
    background: "#fff",
    text: "#000",
    inputBackground: "#fff",
    iconColor: "#666",
    buttonBackground: color,
    placeholderColor: "#666",
  };

  const darkModeColors = {
    background: "#121212",
    text: "#fff",
    inputBackground: "#333",
    iconColor: "#fff",
    buttonBackground: color,
    placeholderColor: "#666",
  };

  const colors = isDarkMode ? darkModeColors : lightModeColors;

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible1, setPasswordVisible1] = useState(false);

  const onSignUp = async () => {
    if (!email || !username || !password || !confirmPassword) {
      Alert.alert(t('authentication.alerts.AlertErrorMessage'), t('authentication.alerts.FieldRequiredMsg'));
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(t('authentication.alerts.AlertErrorMessage'), t('authentication.alerts.PasswordNoMatch'));
      return;
    }
    // Email validation: must contain "@" and ".com"
    if (!email.includes('@') || !email.includes('.com')) {
      Alert.alert(t('authentication.alerts.AlertErrorMessage'), t('authentication.alerts.EmailWrongFormat'));
      return;
    }
    
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
        Alert.alert(t('authentication.alerts.AlertErrorMessage'), t('authentication.alerts.PasswordRequirement'));
        return;
    }
    
    try {
      const response = await fetch(isAndroidStudio? `http://10.0.2.2:${ServerPort}/api/auth/register`: `${ServerIP}:${ServerPort}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, username, password })
      });
      const result = await response.json();
      
      if (response.ok) {
        // Navigate on successful signup
        navigation.navigate("VerificationSelection", {verificationType: "R"});
      } else {
        Alert.alert(t('authentication.alerts.signupfailed'), t(`authentication.backendmessages.Signup${response.status}`) || "An error occurred.");
      }
    } catch (error) {
      Alert.alert(t('authentication.alerts.AlertErrorMessage'), t('authentication.alerts.networkerror'));
    }
  };

  return (
    <SafeAreaView style={{flex:1}}>
       <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : undefined}
    keyboardVerticalOffset={Platform.OS === "ios" ? 1 : 0} // adjust if needed
  >
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("LandingPage")}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      {/* Toggle Switch */}
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleTheme}
        value={isDarkMode}
        style={styles.switch}
      />
      
      {/* Logo */}
      <Image source={require("../assets/smartcommuteicon.png")} style={styles.logo} />
      
      {/* Title */}
      <Text style={[styles.title, { color: colors.text }]}>{t('authentication.signup')}</Text>

      {/* Email Input */}
      <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground }]}>
        <Ionicons name="mail" size={20} color={colors.iconColor} style={styles.icon} />
        <TextInput
          placeholder={t('authentication.email')}
          style={[styles.input, { color: colors.text }]}
          value={email}
          onChangeText={setEmail}
          placeholderTextColor={colors.placeholderColor}
        />
      </View>
      
      {/* Username Input */}
      <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground }]}>
        <Ionicons name="person" size={20} color={colors.iconColor} style={styles.icon} />
        <TextInput
          placeholder={t('authentication.username')}
          style={[styles.input, { color: colors.text }]}
          value={username}
          onChangeText={setUsername}
          placeholderTextColor={colors.placeholderColor}
        />
      </View>

      {/* Password Input */}
      <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground }]}>
        <Ionicons name="lock-closed" size={20} color={colors.iconColor} style={styles.icon} />
        <TextInput
          placeholder={t('authentication.password')}
          style={[styles.input, { color: colors.text }]}
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor={colors.placeholderColor}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Ionicons name={passwordVisible ? "eye" : "eye-off"} size={20} color={colors.iconColor} />
        </TouchableOpacity>
      </View>

      {/* Confirm Password Input */}
      <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground }]}>
        <Ionicons name="lock-closed" size={20} color={colors.iconColor} style={styles.icon} />
        <TextInput
          placeholder={t('authentication.confirmpassword')}
          style={[styles.input, { color: colors.text }]}
          secureTextEntry={!passwordVisible1}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholderTextColor={colors.placeholderColor}
        />
        <TouchableOpacity onPress={() => setPasswordVisible1(!passwordVisible1)}>
          <Ionicons name={passwordVisible1 ? "eye" : "eye-off"} size={20} color={colors.iconColor} />
        </TouchableOpacity>
      </View>

      {/* Sign Up Button with API fetching */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.buttonBackground, width: "100%", height: 40, padding: 8 }]}
        onPress={onSignUp}
      >
        <Text style={styles.buttonText}>{t('authentication.signup')}</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.buttonBackground, width: "50%", height: 30, padding: 3, marginLeft: 175 }]}
        onPress={() => navigation.navigate("LoginPage")}
      >
        <Text style={styles.loginText}>{t('authentication.login')}</Text>
      </TouchableOpacity>
      
    </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  switch: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  backButton: {
    position: "absolute",
    top: 25,
    left: 20,
  },
  logo: {
    marginTop:-60,
    width: 350,
    height: 350,
    marginBottom: -40,
    resizeMode:"contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
   
    alignSelf:"flex-start",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  button: {
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Signuppage;
