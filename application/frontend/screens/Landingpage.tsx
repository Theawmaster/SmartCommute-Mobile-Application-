import React, { useState, useEffect} from "react";
import { Switch, SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { useTheme } from "../components/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from 'react-i18next';

type LandingPageProps = {
  navigation: NavigationProp<any>;
};

const LandingPage: React.FC<LandingPageProps> = ({ navigation }) => {
  const { isDarkMode, toggleTheme, color } = useTheme();

  const lightMode = {
    background: "#fff",
    text: "#000",
    buttonPrimary: color,
    buttonSecondary: "#E0E0E0",
    buttonTextSecondary: "#000",
  };

  const darkMode = {
    background: "#121212",
    text: "#fff",
    buttonPrimary: color,
    buttonSecondary: "#333",
    buttonTextSecondary: "#fff",
  };

  const colors = isDarkMode ? darkMode : lightMode;
  const { t } = useTranslation();
  return (
    <SafeAreaView style={{flex:1}}>
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Switch
        trackColor={{ false: "#767577", true: "#4a90e2" }}
        thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleTheme}
        value={isDarkMode}
        style={styles.switch}
      />
      <Image source={require("../assets/smartcommuteicon.png")} style={styles.logo} />
      <Text style={[styles.title, { color: colors.text }]}>SmartCommute</Text>

      <TouchableOpacity
        style={[styles.buttonPrimary, { backgroundColor: colors.buttonPrimary }]}
        onPress={() => navigation.navigate("LoginPage")}
      >
        <Text style={styles.buttonText}>{t('authentication.login')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.buttonSecondary, { backgroundColor: colors.buttonSecondary }]}
        onPress={() => navigation.navigate("SignUpPage")}
      >
        <Text style={styles.buttonTextSecondary}>
        {t('authentication.signup')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Text style={[{ textDecorationLine: 'underline', marginTop: 20 }, { color: isDarkMode ? "#fff" : "#000" }]}>
        {t('authentication.continueasguest')}
        </Text>
      </TouchableOpacity>

    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  switch: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  logo: {
    width: 350,
    height: 350,
    marginTop:-90,
    
    resizeMode:"contain",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
  },
  buttonPrimary: {
    paddingVertical: 12,
    paddingHorizontal: 155,
    borderRadius: 25,
    marginBottom: 10,
  },
  buttonSecondary: {
    paddingVertical: 12,
    paddingHorizontal: 150,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonTextSecondary: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LandingPage;
