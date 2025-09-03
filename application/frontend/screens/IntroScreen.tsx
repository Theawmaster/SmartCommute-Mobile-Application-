// IntroScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Switch,
  ScrollView,
  Modal
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import your theme context
import { useTheme } from "../components/ThemeContext";
// Import your server details and location service functions
import { ServerIP, ServerPort } from "../components/ServerIP";
import { DEFAULT_COORDINATES, getLocation, isAndroidStudio } from "../components/locationService";

// Import styles
import styles from "../styling/IntroScreen.styles";

type IntroScreenProps = {
  navigation: NavigationProp<any>;
};

interface WeatherData {
  weather: string;
  temperature: number;
  weatherIcon: string;
}

const logo = require("../assets/SmartCommute_Logo.png"); // Adjust if necessary

const IntroScreen: React.FC<IntroScreenProps> = ({ navigation }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [weather, setWeather] = useState<string | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [weatherIcon, setWeatherIcon] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [location, setLocation] = useState(DEFAULT_COORDINATES);
  const [locationLoading, setLocationLoading] = useState<boolean>(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [weatherModalVisible, setWeatherModalVisible] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const coords = await getLocation();
        setLocation({ latitude: coords.latitude, longitude: coords.longitude });
        await AsyncStorage.setItem(
          "coordinates",
          JSON.stringify({ latitude: coords.latitude, longitude: coords.longitude })
        );
      } catch (error) {
        setLocationError("Could not get location");
      } finally {
        setLocationLoading(false);
      }
    };
    fetchLocation();
  }, []);

  const handleSunClick = async () => {
    if (location && !locationLoading) {
      try {
        setLoading(true);
        const requestUrl = isAndroidStudio
          ? `http://10.0.2.2:${ServerPort}/api/weather/currentweather?lat=${location.latitude}&lon=${location.longitude}`
          : `${ServerIP}:${ServerPort}/api/weather/currentweather?lat=${location.latitude}&lon=${location.longitude}`;
        const response = await axios.get<WeatherData>(requestUrl);
        const { weather: weatherDescription, temperature, weatherIcon: iconCode } = response.data;
        setWeather(weatherDescription);
        setTemperature(temperature);
        setWeatherIcon(iconCode);
        setWeatherModalVisible(true);
      } catch (error) {
        console.error("Error fetching weather:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getWeatherIconUrl = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  if (locationLoading) {
    return <ActivityIndicator size="large" color={isDarkMode ? "#fff" : "#000"} />;
  }

  if (locationError) {
    return <Text>{locationError}</Text>;
  }

  return (
    <View style={[styles.screen, { backgroundColor: isDarkMode ? "#121212" : "#fff" }]}>      
      <View style={[styles.header, { backgroundColor: isDarkMode ? "#444" : "#5abdb2" }]}>       
        <View style={styles.rightRow}>         
          <TouchableOpacity onPress={handleSunClick} style={styles.sunIcon} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color={isDarkMode ? "#fff" : "#000"} />
            ) : (
              <Text style={[styles.sunText, { color: isDarkMode ? "#fff" : "#000" }]}>☀️</Text>
            )}
          </TouchableOpacity>

          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
            style={styles.themeSwitch}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.content}>
          <View
            style={[
              styles.box,
              {
                backgroundColor: isDarkMode ? "#1E1E1E" : "#fff",
                borderColor: isDarkMode ? "#2C3E50" : "#BDC3C7"
              }
            ]}
          >
            <Icon name="exclamation-triangle" size={24} color="#F1C40F" style={styles.icon} />
            <Text style={[styles.title, { color: isDarkMode ? "#E0E0E0" : "#34495E" }]}>Introductory Guide</Text>
            {step === 1 ? (
              <>
                <Text style={[styles.text, { color: isDarkMode ? "#E0E0E0" : "#34495E" }]}>Welcome to SmartCommute!</Text>
                <Text style={[styles.text, { color: isDarkMode ? "#E0E0E0" : "#34495E" }]}>Your one-stop app for real-time public transport updates.</Text>
              </>
            ) : (
              <>
                <Icon name="home" size={24} color={isDarkMode ? "#3498DB" : "#0000FF"} style={styles.icon} />
                <View style={styles.listItem}>
                  <Icon name="taxi" size={18} color={isDarkMode ? "#fff" : "#000"} style={styles.listIcon} />
                  <Text style={[styles.listText, { color: isDarkMode ? "#E0E0E0" : "#34495E" }]}>See nearby taxis within 3km</Text>
                </View>
                <View style={styles.listItem}>
                  <Icon name="bus" size={18} color={isDarkMode ? "#fff" : "#000"} style={styles.listIcon} />
                  <Text style={[styles.listText, { color: isDarkMode ? "#E0E0E0" : "#34495E" }]}>See bus stop and arrivals within 1km</Text>
                </View>
                <View style={styles.listItem}>
                  <Icon name="subway" size={18} color={isDarkMode ? "#fff" : "#000"} style={styles.listIcon} />
                  <Text style={[styles.listText, { color: isDarkMode ? "#E0E0E0" : "#34495E" }]}>See MRT stations crowd levels within 2km</Text>
                </View>
                <Icon name="dollar-sign" size={24} color="#F1C40F" style={styles.icon} />
                <View style={styles.listItem}>
                  <Text style={[styles.listText, { color: isDarkMode ? "#E0E0E0" : "#34495E" }]}>Estimate fares for Taxi, Bus, or MRT</Text>
                </View>
                <Icon name="comment-dots" size={24} color={isDarkMode ? "#fff" : "#000"} style={styles.icon} />
                <View style={styles.listItem}>
                  <Text style={[styles.listText, { color: isDarkMode ? "#E0E0E0" : "#34495E" }]}>Get all the help you need with your prompt</Text>
                </View>
                <Icon name="wrench" size={24} color={isDarkMode ? "#fff" : "#000"} style={styles.icon} />
                <View style={styles.listItem}>
                  <Text style={[styles.listText, { color: isDarkMode ? "#E0E0E0" : "#34495E" }]}>Personalise your app settings and logging in to your account to submit feedback!</Text>
                </View>
              </>
            )}
            <TouchableOpacity style={styles.button} onPress={() => (step === 1 ? setStep(2) : navigation.navigate("Home"))}>
              <Text style={styles.buttonText}>{step === 1 ? "Get Started" : "Complete"}</Text>
            </TouchableOpacity>
          </View>

          <Modal
            visible={weatherModalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setWeatherModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? "#1E1E1E" : "#fff" }]}>
                <TouchableOpacity style={styles.closeButton} onPress={() => setWeatherModalVisible(false)}>
                  <Text style={styles.closeButtonText}>x</Text>
                </TouchableOpacity>
                <Text style={[{ fontSize: 20, fontWeight: "bold", marginBottom: 10, marginTop: 5 }, {color: isDarkMode ? "#fff" : "#000"}]}>Current Weather</Text>
                {weather && temperature ? (
                  <View style={styles.weatherContent}>
                    {weatherIcon && (
                      <Image source={{ uri: getWeatherIconUrl(weatherIcon) }} style={styles.weatherIcon} />
                    )}
                    <Text style={[styles.weatherText, {color: isDarkMode ? "#fff" : "#000"}]}>{weather.charAt(0).toUpperCase() + weather.slice(1)}</Text>
                    <Text style={[styles.weatherText, {color: isDarkMode ? "#fff" : "#000"}]}>{temperature.toFixed(1)}°C</Text>
                  </View>
                ) : (
                  <ActivityIndicator size="large" color="#000" />
                )}
              </View>
            </View>
          </Modal>

        </View>
      </ScrollView>
    </View>
  );
};

export default IntroScreen;