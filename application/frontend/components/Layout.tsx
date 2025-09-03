import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator,
  Image,
  Modal,
  FlatList,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp, useNavigationState } from '@react-navigation/native';
import axios from 'axios';
import { ServerIP, ServerPort } from './ServerIP';
import { DEFAULT_COORDINATES, isAndroidStudio, getLocation } from './locationService';
import { useTheme } from '../components/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import LayoutStyles from '../styling/Layout.styles';

export type RootStackParamList = {
  Home: undefined;
  Fare: undefined;
  Settings: undefined;
  ChatBotPage: undefined;
  TaxiMap: undefined;
  Profile: undefined;
  ProfilepageforAdmin: undefined;
  SendFeedback: undefined;
  Bus: undefined;
  MRT: undefined;
};

interface LayoutProps {
  children: React.ReactNode;
}

interface WeatherData {
  weather: string;
  temperature: number;
  weatherIcon: string;
}

const screenMappings: { name: keyof RootStackParamList; keywords: string[] }[] = [
  { name: 'Home', keywords: ['home'] },
  { name: 'Fare', keywords: ['fare'] },
  { name: 'Settings', keywords: ['setting', 'settings'] },
  { name: 'ChatBotPage', keywords: ['chat', 'chatbot'] },
  { name: 'Profile', keywords: ['profile'] },
  { name: 'ProfilepageforAdmin', keywords: ['admin'] },
  { name: 'SendFeedback', keywords: ['feedback', 'sendfeedback'] },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { isDarkMode, color, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const styles = LayoutStyles(isDarkMode, color);

  // States for search, weather, and location
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [weather, setWeather] = useState<string | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [weatherIcon, setWeatherIcon] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [location, setLocation] = useState(DEFAULT_COORDINATES);
  const [locationLoading, setLocationLoading] = useState<boolean>(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [weatherModalVisible, setWeatherModalVisible] = useState(false);

  // Get current route for footer highlighting
  const currentRoute = useNavigationState((state) => state.routes[state.index].name);

  // Navigation items with translation keys
  const navItems = [
    { name: 'Home', label: t('layout.home') },
    { name: 'Fare', label: t('layout.fare') },
    { name: 'ChatBotPage', label: t('layout.chatbot') },
    { name: 'Settings', label: t('layout.settings') },
  ];

  // On mount, fetch or set location
  // On mount, fetch or set location
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // Remove existing location data
        await AsyncStorage.removeItem('coordinates');
        const coords = await getLocation();
        setLocation({ latitude: coords.latitude, longitude: coords.longitude });
        await AsyncStorage.setItem(
          'coordinates',
          JSON.stringify({ latitude: coords.latitude, longitude: coords.longitude })
        );     
      } catch (error) {
        setLocationError('Could not get location');
      } finally {
        setLocationLoading(false);
      }
    };
    if (isAndroidStudio) {
      setLocationLoading(false);
      return;
    }
    fetchLocation();
  }, []);

  // Fetch weather data when sun icon is pressed
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
        console.error('Error fetching weather:', error);
        if (axios.isAxiosError(error)) {
          console.log('Request URL:', error.config?.url);
          console.log('Response status:', error.response?.status);
          console.log('Response data:', error.response?.data);
        }
        Alert.alert('Error', t('layout.weatherLoadingError'));
      } finally {
        setLoading(false);
      }
    }
  };

  const getWeatherIconUrl = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const updateSuggestions = (text: string) => {
    setQuery(text);
    if (text.trim().length > 0) {
      const lowerText = text.toLowerCase();
      let newSuggestions: string[] = [];
      screenMappings.forEach((mapping) => {
        mapping.keywords.forEach((keyword) => {
          if (keyword.includes(lowerText) && !newSuggestions.includes(keyword)) {
            newSuggestions.push(keyword);
          }
        });
      });
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]);
  };

  const handleSearch = () => {
    const searchKey = query.trim().toLowerCase();
    if (!searchKey) return;
    let target: keyof RootStackParamList | null = null;
    for (const mapping of screenMappings) {
      for (const keyword of mapping.keywords) {
        if (searchKey.includes(keyword)) {
          target = mapping.name;
          break;
        }
      }
      if (target) break;
    }
    if (target) {
      navigation.navigate(target);
    } else {
      Alert.alert('Not Found', `No screen found for "${query}"`);
    }
  };

  const renderSuggestion = ({ item }: { item: string }) => (
    <TouchableOpacity onPress={() => handleSuggestionPress(item)} style={styles.suggestionItem}>
      <Text style={styles.suggestionText}>{item}</Text>
    </TouchableOpacity>
  );

  if (locationLoading) {
    return (
      <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.safeArea}>
        <ActivityIndicator
          size="large"
          color={isDarkMode ? '#fff' : '#000'}
          style={styles.loader}
        />
      </SafeAreaView>
    );
  }

  if (locationError) {
    return (
      <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.safeArea}>
        <Text>{locationError}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['left', 'right']}
      style={[styles.safeArea, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}
    >
      {/* Full screen flex wrapper */}
      <View style={styles.mainWrapper}>
        
        {/* Header */}
        <View style={[styles.header, { backgroundColor: isDarkMode ? '#444' : color }]}>
          <View style={styles.searchContainer}>
            <TextInput
              style={[styles.searchBar, { backgroundColor: isDarkMode ? '#555' : '#fff' }]}
              placeholder={t('layout.searchPlaceholder')}
              placeholderTextColor={isDarkMode ? '#ccc' : '#666'}
              value={query}
              onChangeText={updateSuggestions}
              onSubmitEditing={handleSearch}
            />
            {suggestions.length > 0 && (
              <FlatList
                data={suggestions}
                keyExtractor={(item, index) => `${item}-${index}`}
                renderItem={renderSuggestion}
                style={styles.suggestionList}
              />
            )}
          </View>
          <View style={styles.sunSwitchContainer}>
            <TouchableOpacity onPress={handleSunClick} style={styles.sunIcon} disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color={isDarkMode ? '#fff' : '#000'} />
              ) : (
                <Text style={[styles.sunText, { color: isDarkMode ? '#fff' : '#000' }]}>☀️</Text>
              )}
            </TouchableOpacity>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
        </View>
  
        {/* Main Content */}
        <View style={styles.mainContent}>
          {children}
        </View>
  
        {/* Footer */}
        <View style={[styles.navBar, { backgroundColor: isDarkMode ? '#444' : 'white' }]}>
          {navItems.map((item) => {
            const isActive =
              item.name === 'Settings'
                ? currentRoute === 'Settings' ||
                  currentRoute === 'Profile' ||
                  currentRoute === 'ProfilepageforAdmin' ||
                  currentRoute === 'SendFeedback'
                : item.name === 'Fare'
                ? currentRoute === 'Fare' || currentRoute === 'FareRouteMap'
                : currentRoute === item.name;
            return (
              <TouchableOpacity
                key={item.name}
                onPress={() => navigation.navigate(item.name as keyof RootStackParamList)}
                style={[styles.navItem, isActive && [styles.navItemTextActive, { backgroundColor: color }]]}
              >
                <Text style={[
                  styles.navItemText,
                  isActive && [styles.navItemTextActive, { backgroundColor: color }],
                  { color: isDarkMode ? '#fff' : '#000' }
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
  
      {/* Weather Modal */}
      <Modal
        visible={weatherModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setWeatherModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: color }]}
              onPress={() => setWeatherModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, marginTop: 5 }}>
              {t('layout.currentWeather')}
            </Text>
            {weather && temperature ? (
              <View style={styles.weatherContent}>
                {weatherIcon && (
                  <Image
                    source={{ uri: getWeatherIconUrl(weatherIcon) }}
                    style={styles.weatherIcon}
                  />
                )}
                <View style={styles.weatherText}>
                  <Text style={{ color: '#000', fontWeight: 'bold' }}>
                    {weather.charAt(0).toUpperCase() + weather.slice(1)}
                  </Text>
                  <Text style={{ color: '#000' }}>
                    {temperature?.toFixed(1)}°C
                  </Text>
                </View>
              </View>
            ) : (
              <ActivityIndicator size="large" color="#000" />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );   
}
export default Layout;