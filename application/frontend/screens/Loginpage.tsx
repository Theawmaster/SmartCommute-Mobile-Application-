import React, { useState, useEffect } from 'react';
import {
  Switch,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  TextInput,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationProp } from '@react-navigation/native';
import { useTheme } from "../components/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { isAndroidStudio } from '../components/locationService';
import { ServerIP, ServerPort } from '../components/ServerIP';
import { useTranslation } from 'react-i18next';

type LandingPageProps = {
  navigation: NavigationProp<any>;
};

const Loginpage: React.FC<LandingPageProps> = ({ navigation }) => {
  const { isDarkMode, toggleTheme, color } = useTheme();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { t } = useTranslation();
  const toggleSwitch = () => {
    toggleTheme();
  };

  const lightModeColors = {
    background: "#fff",
    text: "#000",
    inputBackground: "#fff",
    iconColor: "#888",
    buttonPrimaryBackground: color,
    buttonSecondaryBackground: "#FF0000",
    placeholderColor: "#888",
  };

  const darkModeColors = {
    background: "#121212",
    text: "#fff",
    inputBackground: "#333",
    iconColor: "#fff",
    buttonPrimaryBackground: color,
    buttonSecondaryBackground: "#FF0000",
    placeholderColor: "#bbb",
  };

  const colors = isDarkMode ? darkModeColors : lightModeColors;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(
        isAndroidStudio
          ? `http://10.0.2.2:${ServerPort}/api/auth/login`
          : `${ServerIP}:${ServerPort}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        }
      );

      const result = await response.json();

      if (response.ok) {
        navigation.navigate("VerificationPage", { verificationType: "L" });
      } else {
        Alert.alert(t('authentication.alerts.LoginAlertMessage'), t(`authentication.backendmessages.Login${response.status}`) || "Unknown error");
      }
    } catch (error) {
      Alert.alert(t('authentication.alerts.AlertErrorMessage'), t('authentication.alerts.networkerror'));
    }
  };

  return (
    <SafeAreaView style={{flex:1}}>
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("LandingPage")}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>
      {/* Dark Mode Switch */}
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isDarkMode}
        style={styles.switch}
      />

      {/* Logo */}
      <Image source={require('../assets/smartcommuteicon.png')} style={styles.logo} />
      <Text style={[styles.title, { color: colors.text }]}>{t('authentication.login')}</Text>

      {/* Username Input */}
      <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground }]}>
        <Icon name="user" size={20} color={colors.iconColor} style={styles.icon} />
        <TextInput
          style={[styles.input, { color: colors.text, flex: 1 }]}
          onChangeText={setUsername}
          value={username}
          placeholder={t('authentication.username')}
          placeholderTextColor={colors.placeholderColor}
        />
      </View>

      {/* Password Input */}
      <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground }]}>
        <Icon name="key" size={20} color={colors.iconColor} style={styles.icon} />
        <TextInput
          style={[styles.input, { color: colors.text, flex: 1 }]}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible}
          value={password}
          placeholder={t('authentication.password')}
          placeholderTextColor={colors.placeholderColor}
        />
        <TouchableOpacity
          onPress={() => setPasswordVisible(!passwordVisible)}
          style={styles.eyeButton}
        >
          <Ionicons
            name={passwordVisible ? "eye" : "eye-off"}
            size={20}
            color={colors.iconColor}
          />
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        style={[styles.buttonPrimary, { backgroundColor: colors.buttonPrimaryBackground }]}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>{t('authentication.login')}</Text>
      </TouchableOpacity>

      {/* Forget Password Button */}
      <TouchableOpacity
        style={[styles.buttonSecondary, { backgroundColor: colors.buttonSecondaryBackground }]}
        onPress={() => navigation.navigate("ForgetPasswordPage")}
      >
        <Text style={styles.buttonTextSecondary}>{t('authentication.forgetpassword')}?</Text>
      </TouchableOpacity>

      {/* Sign Up Button */}
      <TouchableOpacity
        style={[styles.buttonSecondary, { backgroundColor: colors.buttonPrimaryBackground }]}
        onPress={() => navigation.navigate("SignUpPage")}
      >
        <Text style={styles.buttonTextSecondary}>{t('authentication.signup')}</Text>
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
    position: 'relative',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 15,
    width: 350,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  eyeButton: {
    marginLeft: 10,
  },
  input: {
    height: 40,
    borderWidth: 0,
    borderRadius: 25,
    padding: 5,
    textAlignVertical: 'center',
  },
  logo: {
    width: 350,
    height: 350,
    marginTop: -110,
    resizeMode:"contain",
  },
  title: {
    marginRight: 270,
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  buttonPrimary: {
    paddingVertical: 10,
    paddingHorizontal: 155,
    borderRadius: 25,
    marginBottom: 15,
  },
  buttonSecondary: {
    paddingVertical: 6,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 15,
    marginLeft: 120,
    width: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextSecondary: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Loginpage;
