import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Modal,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import Accordion from 'react-native-collapsible/Accordion';
import * as Progress from 'react-native-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../components/ThemeContext';
import { BushomelayoutStyles } from '../styling/Bushomelayout.styles';
import { ServerIP, ServerPort } from '../components/ServerIP';
import { DEFAULT_COORDINATES, isAndroidStudio } from '../components/locationService';
import { useTranslation } from 'react-i18next';
import MapView, { Marker, Region, Callout } from 'react-native-maps';

interface BusInfo {
  estimatedArrival: string;
  load: string;
  type?: string;
  latitude: number;
  longitude: number;
}

interface BusService {
  BusNumber: string;
  EstimatedArrivalTime: string[];
  Load: string[];
  type: string[];
  Latitude: number[];
  Longitude: number[];
  serviceNumber: string;
  nextBuses: BusInfo[];
}

interface BusStop {
  busStopCode: string;
  latitude: number;
  longitude: number;
  distance: number;
  description: string;
}

interface Bus {
  Latitude: number;
  Longitude: number;
}

const Bushomelayout = () => {
  const [busCodeFetched, setBusCodeFetched] = useState(false);
  const mapRef = useRef<MapView | null>(null);
  const [activeSections, setActiveSections] = useState<number[]>([]);
  const [busCode, setBusCode] = useState<any[]>([]);
  const [busData, setBusData] = useState<Record<string, BusService[]>>({});
  const [loading, setLoading] = useState(true);
  const [currentCoordinates, setCurrentCoordinates] = useState(DEFAULT_COORDINATES);
  const [currentSearchBusStopCoordinates, setCurrentSearchBusStopCoordinates] = useState(DEFAULT_COORDINATES);
  const [locationLoading, setLocationLoading] = useState(!isAndroidStudio);
  const [modalVisible, setModalVisible] = useState(false);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [selectedBus, setSelectedBus] = useState<BusService | null>(null);

  const { t } = useTranslation();
  const { fontsize, color, isDarkMode } = useTheme();
  const styles = BushomelayoutStyles(isDarkMode, color, fontsize);

  const API_URL_Buslist = isAndroidStudio
    ? `http://10.0.2.2:${ServerPort}/api/bus/nearby-bus-stops?lat=${DEFAULT_COORDINATES.latitude}&lon=${DEFAULT_COORDINATES.longitude}`
    : `${ServerIP}:${ServerPort}/api/bus/nearby-bus-stops?lat=${currentCoordinates.latitude}&lon=${currentCoordinates.longitude}`;

  const API_URL_Busname = isAndroidStudio
    ? `http://10.0.2.2:${ServerPort}/api/bus/`
    : `${ServerIP}:${ServerPort}/api/bus/`;

  const fetchBusData = async (busStopCode: string) => {
    try {
      const API_URL = `${API_URL_Busname}bus-arrival?busStopCode=${busStopCode}`;
      const response = await fetch(API_URL);
      const data = await response.json();
      const formattedData = data.map((bus: BusService) => ({
        BusNumber: bus.serviceNumber,
        EstimatedArrivalTime: bus.nextBuses.map(b => b.estimatedArrival),
        Load: bus.nextBuses.map(b => b.load),
        type: bus.nextBuses.map(b => b.type),
        Latitude: bus.nextBuses.map(b => b.latitude),
        Longitude: bus.nextBuses.map(b => b.longitude),
      }));
      setBusData(prev => ({ ...prev, [busStopCode]: formattedData }));
    } catch (error) {
      Alert.alert('Unable to Fetch Route', 'Please check your network connection and try again later.', [{ text: 'OK' }]);
    }
  };

  const fetchBusCode = async () => {
    try {
      if (busCodeFetched) return;
      const response = await fetch(API_URL_Buslist);
      const data: BusStop[] = await response.json();

      const busStopDetails = data
        .filter(busStop => /^\d{5}$/.test(busStop.busStopCode))
        .sort((a, b) => a.distance - b.distance)
        .map(busStop => ({
          title: busStop.description,
          content: busStop.busStopCode,
          busdistance: Math.round(busStop.distance),
          busstoplatitude: busStop.latitude,
          busstoplongitude: busStop.longitude,
        }));

      setBusCode(busStopDetails);
      setBusCodeFetched(true);
    } catch (error) {
      Alert.alert('Unable to Fetch Bus Data', 'Please check your network connection and try again later.', [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };

  const setSections = (sections: number[]) => {
    sections.forEach(index => {
      const busItem = busCode[index];
      if (busItem) fetchBusData(busItem.content);
    });
    setActiveSections(sections);
  };

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
        console.error("Error retrieving coordinates:", error);
      }
    };
    getStoredCoordinates();
  }, []);

  useEffect(() => {
    if (currentCoordinates && !locationLoading) {
      fetchBusCode();
    }
  }, [currentCoordinates, locationLoading]);

  const initialRegion: Region = {
    latitude: currentCoordinates.latitude,
    longitude: currentCoordinates.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const handlePress = (bus: BusService, busStopLat: number, busStopLng: number) => {
    setSelectedBus(bus);
    const latitude = bus.Latitude.map(Number);
    const longitude = bus.Longitude.map(Number);
    const coordinates: Bus[] = latitude.map((lat: number, index: number) => ({
      Latitude: lat,
      Longitude: longitude[index],
    }));
    setBuses(coordinates);
    setCurrentSearchBusStopCoordinates({ latitude: busStopLat, longitude: busStopLng });
    setModalVisible(true);
  };

  const goToCurrentLocation = () => {
    mapRef.current?.animateToRegion(initialRegion, 1000);
  };

  const isValidCoordinate = (latitude: number, lon: number) => {
    return !isNaN(latitude) && !isNaN(lon) && !(latitude === 0 && lon === 0);
  };
  
  const areAllCoordsClose = (coords: any[], threshold = 0.0001) => {
    if (coords.length === 0) return false;
    const first = coords[0];
    return coords.every((coord: { latitude: number; longitude: number; }) =>
      Math.abs(coord.latitude - first.latitude) < threshold &&
      Math.abs(coord.longitude - first.longitude) < threshold
    );
  };
  
  const zoomOutOverview = () => {
    if (mapRef.current && buses.length > 0) {
      const validCoords = buses
        .map(bus => ({
          latitude: Number(bus.Latitude),
          longitude: Number(bus.Longitude)
        }))
        .filter(coord => isValidCoordinate(coord.latitude, coord.longitude));
  
      if (validCoords.length > 0) {
        // Avoid overly tight zoom if all buses are at the same spot
        if (areAllCoordsClose(validCoords)) {
          const center = validCoords[0];
          mapRef.current.animateToRegion({
            ...center,
            latitudeDelta: 0.01, // Adjust as needed for "overview"
            longitudeDelta: 0.01
          }, 500);
        } else {
          mapRef.current.fitToCoordinates(validCoords, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true
          });
        }
      } else {
        console.warn("No valid bus coordinates for overview zoom");
      }
    }
  };

  const handleMarkerPress = (bus: Bus) => {
    mapRef.current?.animateToRegion(
      {
        latitude: bus.Latitude,
        longitude: bus.Longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      1000
    );
  };

  // Modified handlePress now receives bus stop coordinates from the section
  // Removed duplicate declaration of handlePress

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        {loading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
            <ActivityIndicator size="large" color={color} />
            <Text style={{ marginTop: 10, fontSize: fontsize, color: color }}>
              {t('bushomelayout.Loading')}
            </Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Accordion
              sectionContainerStyle={styles.accordionBorder}
              activeSections={activeSections}
              sections={busCode}
              touchableComponent={TouchableOpacity}
              expandMultiple={true}
              renderHeader={(section, _, isActive) => (
                <Animatable.View
                  duration={400}
                  style={[isActive ? styles.accordionActive : styles.accordionInactive, { padding: 10 }]}
                  transition="backgroundColor"
                >
                  <View style={styles.accordionHeaderRow}>
                    <Text style={styles.accordionHeaderText}>{section.title}</Text>
                    <Ionicons
                      name={isActive ? "chevron-up-outline" : "chevron-down-outline"}
                      size={20}
                      color={styles.chevronIcon.color}
                    />
                  </View>
                  <View style={styles.accordionHeaderRow}>
                    <Text style={styles.accordionSubheaderText}>{section.busdistance}m away</Text>
                  </View>
                </Animatable.View>
              )}
              renderContent={(section, _, isActive) => {
                const busArrivals = busData[section.content];
                if (!busArrivals?.length) {
                  return (
                    <Animatable.View
                      duration={400}
                      style={[styles.accordionContent, isActive ? styles.accordionActive : styles.accordionInactive]}
                      transition="backgroundColor"
                    >
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color={color} />
                        <Text style={styles.loadingText}>Status...</Text>
                      </View>
                      <Text style={styles.errorText}>
                        {t('bushomelayout.errorText')}
                      </Text>
                    </Animatable.View>
                  );
                }
                return (
                  <Animatable.View
                    duration={400}
                    style={[styles.accordionContent, isActive ? styles.accordionActive : styles.accordionInactive]}
                    transition="backgroundColor"
                  >
                    <View>
                      {busArrivals.map((bus, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.busItemContainer}
                          onPress={() => handlePress(bus, section.busstoplatitude, section.busstoplongitude)}
                        >
                          <Text style={styles.busNumberText}>{bus.BusNumber}</Text>
                          <View>
                            <View style={styles.arrivalTimeContainer}>
                              {bus.EstimatedArrivalTime.map((time: any, idx: number) => (
                                <Text key={idx} style={styles.arrivalTimeText}>{time}</Text>
                              ))}
                            </View>
                            <View style={styles.arrivalTimeContainer}>
                              {bus.Load.map((load: string, idx: number) => (
                                <Progress.Bar
                                  key={idx}
                                  progress={load === "SEA" ? 0.3 : load === "SDA" ? 0.5 : 0.8}
                                  height={1}
                                  width={60}
                                  color={load === "SEA" ? 'green' : load === "SDA" ? 'orange' : 'red'}
                                  style={{ marginLeft: idx === 0 ? 0 : 15 }}
                                />
                              ))}
                            </View>
                            <View style={styles.arrivalTimeContainer}>
                              {bus.type.map((type: string, idx: number) => (
                                <Text key={idx} style={styles.busTypeText}>
                                  {type === "SD" ? 'Single' : 'Double'}
                                </Text>
                              ))}
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </Animatable.View>
                );
              }}
              duration={1000}
              onChange={setSections}
            />
          </ScrollView>
        )}
      </View>
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >    
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeader}>Bus Location</Text>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={30} color="black" />
              </TouchableOpacity>
            </View>
            {/* Custom Controls for Current Location and Overview */}
            <View style={styles.customControlsContainer}>
              <TouchableOpacity
                style={styles.customControlButton}
                onPress={goToCurrentLocation}
              >
                <Text style={styles.customControlButtonText}>{t('Current Location')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.customControlButton}
                onPress={zoomOutOverview}
              >
                <Text style={styles.customControlButtonText}>{t('Overview')}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.mapContainer}>
              <MapView ref={mapRef} style={styles.map} initialRegion={initialRegion}>
                {buses.map((bus, index) => (
                  <Marker
                    key={index.toString()}
                    coordinate={{
                      latitude: Number(bus.Latitude),
                      longitude: Number(bus.Longitude),
                    }}
                    title={`Bus ${index + 1}`}
                    onPress={() => handleMarkerPress(bus)}
                  >
                    <View style={{ alignItems: 'center' }}>
                      <Image
                        source={require('../assets/bus_icon.png')}
                        style={{ width: 90, height: 42, resizeMode: 'contain' }}
                      />
                    </View>
                    {selectedBus && selectedBus.EstimatedArrivalTime && selectedBus.EstimatedArrivalTime[index] && (
                      <Callout>
                        <View style={{ padding: 5 }}>
                          <Text>
                            <Text style={{ fontWeight: 'bold' }}>{`Bus ${index + 1}`}</Text>
                          </Text>
                          <Text>{selectedBus.EstimatedArrivalTime[index]}</Text>
                        </View>
                      </Callout>
                    )}
                  </Marker>        
                ))}
                <Marker
                  coordinate={currentSearchBusStopCoordinates}
                  title={isAndroidStudio ? 'Default Location' : 'Current Location'}
                  pinColor="blue"
                />
              </MapView>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Bushomelayout;