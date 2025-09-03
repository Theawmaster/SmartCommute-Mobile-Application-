import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  FlatList,
  Linking,
} from 'react-native';
import MapView, { Callout, Marker, Region } from 'react-native-maps';
import { useTheme } from '../components/ThemeContext';
import { ServerIP, ServerPort } from '../components/ServerIP';
import { DEFAULT_COORDINATES, isAndroidStudio } from '../components/locationService';  
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaxihomelayoutStyles } from '../styling/Taxihomelayout.styles';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Taxi {
  latitude: number;
  longitude: number;
  etaMinutes: number;
}

interface Hotline {
  operator: string;
  phoneNumber: string;
}

const bookingHotlines: Hotline[] = [
    { operator: 'Comfort and CityCab', phoneNumber: '+65 6552 1111' },
    { operator: 'SMRT Taxis', phoneNumber: '+65 6555 8888' },
    { operator: 'Trans-Cab Services', phoneNumber: '+65 6555 3333' },
    { operator: 'Premier Taxis', phoneNumber: '+65 6363 6888' },
    { operator: 'Prime Taxi', phoneNumber: '+65 6778 0808' },
    { operator: 'HDT Electric Taxi', phoneNumber: '+65 6258 8888' },
    { operator: 'Yellow-Top Taxi', phoneNumber: '+65 6293 5545' },
    { operator: 'Common Hotline 6-DIAL-CAB', phoneNumber: '+65 6342 5222' },
    // Limousine services
    { operator: 'Limousine Cab', phoneNumber: '+65 6535 3534' },
    { operator: 'Limo Taxi Cab', phoneNumber: '+65 6600 9920' },
    { operator: 'Prime Limousine', phoneNumber: '+65 6778 0808' },
    { operator: 'Maxi Cab', phoneNumber: '+65 6589 8551' },
    { operator: 'Mercedes Taxi', phoneNumber: '+65 6589 8779' },
    // Additional services
    { operator: 'Strides Taxi', phoneNumber: '+65 6555 1188' },
    { operator: 'Blue Flash Taxi', phoneNumber: '+65 6848 4848' },
    { operator: 'Silver Cab', phoneNumber: '+65 6363 6888' },
    { operator: 'Borneo Taxi', phoneNumber: '+65 6738 9898' },
    { operator: 'Smart Cab', phoneNumber: '+65 6485 7777' },
    { operator: 'Shuttle Taxi', phoneNumber: '+65 6742 1133' },
    // 24-hour services
    { operator: '24H Taxi Booking', phoneNumber: '+65 6535 3534' },
    { operator: 'Night Owl Taxi', phoneNumber: '+65 6536 3636' },
    // Special needs
    { operator: 'Wheelchair Taxi', phoneNumber: '+65 6589 8888' },
    { operator: 'Pet-Friendly Taxi', phoneNumber: '+65 6589 9999' }
];

const Taxihomelayout: React.FC = () => {
  // State management
  const [taxis, setTaxis] = useState<Taxi[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(!isAndroidStudio);
  const { color, isDarkMode, fontsize } = useTheme();
  const mapRef = useRef<MapView | null>(null);
  const [currentCoordinates, setCurrentCoordinates] = useState(DEFAULT_COORDINATES);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hotlinesModalVisible, setHotlinesModalVisible] = useState(false);

  // For translation
  const { t } = useTranslation();

  // Styles
  const styles = TaxihomelayoutStyles(isDarkMode, color, fontsize);

  // API URL
  const API_URL = isAndroidStudio 
    ? `http://10.0.2.2:${ServerPort}/api/taxi/taxi-availability` 
    : `${ServerIP}:${ServerPort}/api/taxi/taxi-availability`;

  // Location handling
  useEffect(() => {
    const getStoredCoordinates = async () => {
      try {
        if (isAndroidStudio) return;
        const jsonValue = await AsyncStorage.getItem("coordinates");
        const coords = jsonValue ? JSON.parse(jsonValue) : null;
        if (coords) {
          setCurrentCoordinates(coords);
          setLocationLoading(false);
        }
      } catch (error) {
        Alert.alert('Unable to Fetch coordinates', 'Please check your network connection and try again later.', [{ text: 'OK' }]);
      }
    };
    getStoredCoordinates();
  }, []);

  // Taxi data fetching
  useEffect(() => {
    if (locationLoading) return;
    
    const fetchTaxis = async () => {
      try {
        const endpoint = isAndroidStudio 
          ? API_URL
          : `${API_URL}?lat=${currentCoordinates.latitude}&lon=${currentCoordinates.longitude}`;
          
        const response = await fetch(endpoint);
        const data: Taxi[] = await response.json();
        setTaxis(data);
      } catch (err) {
        Alert.alert('Unable to Fetch Taxi Data', 'Please check your network connection and try again later.', [{ text: 'OK' }]);
      } finally {
        setLoading(false);
      }
    };
    fetchTaxis();
  }, [currentCoordinates, locationLoading]);

  // Map control functions
  const goToCurrentLocation = () => {
    mapRef.current?.animateToRegion(
      {
        latitude: currentCoordinates.latitude,
        longitude: currentCoordinates.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      1000
    );
  };

  const handleMarkerPress = (taxi: Taxi) => {
    mapRef.current?.animateToRegion(
      {
        latitude: taxi.latitude,
        longitude: taxi.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      1000
    );
  };  

  const zoomOutOverview = () => {
    if (taxis.length > 0) {
      const taxiCoordinates = taxis.map(taxi => ({
        latitude: taxi.latitude,
        longitude: taxi.longitude,
      }));
      mapRef.current?.fitToCoordinates(taxiCoordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };

  // Hotline functions
  const handleHotlinePress = (phoneNumber: string) => {
    Alert.alert(
      t('taxihomelayout.makingCall'),
      t('taxihomelayout.callConfirm', { phone: phoneNumber }),
      [
        { text: t('taxihomelayout.cancel'), style: "cancel" },
        { 
          text: t('taxihomelayout.continue'), 
          onPress: () => Linking.openURL(`tel:${phoneNumber}`) 
        },
      ]
    );
  };

  const renderHotlineItem = ({ item }: { item: Hotline }) => (
    <TouchableOpacity
      style={styles.hotlineItem}
      onPress={() => handleHotlinePress(item.phoneNumber)}
    >
      <Text style={styles.hotlineText}>{item.operator}: {item.phoneNumber}</Text>
    </TouchableOpacity>
  );

  // Loading state
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={color} />
        <Text style={styles.loadingText}>
          {t('taxihomelayout.Loading')}
        </Text>
      </View>
    );
  }

  const initialRegion: Region = {
    latitude: currentCoordinates.latitude,
    longitude: currentCoordinates.longitude,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  return (
    <>
      <View style={styles.customControlsContainer}>
        <TouchableOpacity
          style={styles.customControlButton}
          onPress={goToCurrentLocation}
        >
          <Text style={styles.customControlButtonText}>{t('taxihomelayout.currentLocation')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.customControlButton}
          onPress={zoomOutOverview}
        >
          <Text style={styles.customControlButtonText}>{t('taxihomelayout.overview')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.customControlButton}
          onPress={() => setHotlinesModalVisible(true)}
        >
          <Text style={styles.customControlButtonText}>{t('taxihomelayout.callTaxi')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        <MapView ref={mapRef} style={styles.map} initialRegion={initialRegion}>
          {taxis.map((taxi, index) => (
            <Marker
              key={index.toString()}
              coordinate={{
                latitude: taxi.latitude,
                longitude: taxi.longitude,
              }}
              onPress={() => handleMarkerPress(taxi)}
            >
              <Image
                source={require('../assets/taxi-icon.png')}
                style={{ width: 32, height: 32, resizeMode: 'contain' }}
              />
              <Callout tooltip={false}>
                <View style={{ width: 100, padding: 8, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontWeight: 'bold' }}>Taxi {index + 1}</Text>
                  <Text>{taxi.etaMinutes} mins away</Text>
                </View>
              </Callout>
            </Marker>                   
          ))}
          <Marker
            coordinate={currentCoordinates}
            title={isAndroidStudio ? 'Default Location' : 'Current Location'}
            pinColor="blue"
          />
        </MapView>

        <View style={styles.coordinatesContainer}>
          <Text style={styles.coordinatesText}>
            {t('taxihomelayout.taxisAvailable', { count: taxis.length })}
          </Text>
          {errorMsg && <Text style={styles.warningText}>{errorMsg}</Text>}
          {isAndroidStudio && (
            
            <Text style={styles.coordinatesText}>
              {t('taxihomelayout.usingCurrentLocation')}
            </Text>
          )}
        </View>
      </View>

      <Modal
        visible={hotlinesModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setHotlinesModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{t('taxihomelayout.bookingHotlines')}</Text>
            <FlatList
              data={bookingHotlines}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderHotlineItem}
            />
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setHotlinesModalVisible(false)}
            >
              <Text style={styles.closeModalText}>{t('taxihomelayout.close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Taxihomelayout;