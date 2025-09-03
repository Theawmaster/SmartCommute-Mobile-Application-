import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import Accordion from 'react-native-collapsible/Accordion';
import * as Progress from 'react-native-progress';
import { ServerIP, ServerPort } from '../components/ServerIP';
import { DEFAULT_COORDINATES, isAndroidStudio } from '../components/locationService';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from '../components/ThemeContext';
import { TrainhomelayoutStyles } from '../styling/Trainhomelayout.styles';
import { useTranslation } from 'react-i18next';
import MapView, { Marker } from 'react-native-maps';

interface TrainStop {
  latitude: any;
  longitude: any;
  station: string;
  crowdLevel: 'l' | 'm' | 'h';
}

interface TrainDataItem {
  title: string;
  content: string;
  latitude: number;
  longitude: number;
}

const Trainhomelayout: React.FC = () => {
  const [trainDataFetched, setTrainDataFetched] = useState(false);
  const [activeSections, setActiveSections] = useState<number[]>([]);
  const [trainData, setTrainData] = useState<TrainDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCoordinates, setCurrentCoordinates] = useState(DEFAULT_COORDINATES);
  const [locationLoading, setLocationLoading] = useState(!isAndroidStudio);
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef<MapView>(null);

  const { t } = useTranslation();
  const { fontsize, color, isDarkMode } = useTheme();
  const styles = TrainhomelayoutStyles(isDarkMode, color, fontsize);

  const API_URL_Train = isAndroidStudio 
    ? `http://10.0.2.2:${ServerPort}/api/train/nearby-train-crowd?lat=${DEFAULT_COORDINATES.latitude}&lon=${DEFAULT_COORDINATES.longitude}&radius=2.5`
    : `${ServerIP}:${ServerPort}/api/train/nearby-train-crowd?lat=${currentCoordinates.latitude}&lon=${currentCoordinates.longitude}&radius=2.5`;

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
        Alert.alert('Unable to Fetch Route', 'Please check your network connection and try again later.', [{ text: 'OK' }]);
      }
    };
    getStoredCoordinates();
  }, []);

  useEffect(() => {
    if (currentCoordinates && !locationLoading) {
      fetchTrainData();
    }
  }, [currentCoordinates, locationLoading]);

  const fetchTrainData = async () => {
    try {
      if (trainDataFetched) return;
      const response = await fetch(API_URL_Train);
      const data: TrainStop[] = await response.json();

      const formattedData: TrainDataItem[] = data.map((trainStop, index) => ({
        title: trainStop.station,
        content: trainStop.crowdLevel,
        latitude: trainStop.latitude,
        longitude: trainStop.longitude,
      }));

      setTrainData(formattedData);
      setTrainDataFetched(true);
    } catch (error) {
      Alert.alert("Unable to Fetch Train Data", "Please check your network connection and try again later.", [{ text: "OK" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSMRTTrainArrival = () => {
    Alert.alert(
      t('farepage.alert.External') || 'Open External Site',
      t('farepage.alert.message') || 'You are about to leave the app and visit an external train arrival site.',
      [
        { text: t('farepage.alert.cancel') || 'Cancel', style: 'cancel' },
        {
          text: t('farepage.alert.continue') || 'Continue',
          onPress: () => Linking.openURL('https://trainarrivalweb.smrt.com.sg/')
        }
      ]
    );
  };
  
  const zoomOutOverview = () => {
    if (mapRef.current && trainData.length > 0) {
      const stationCoords = trainData
        .map(station => ({
          latitude: Number(station.latitude),
          longitude: Number(station.longitude)
        }))
        .filter(coord => !isNaN(coord.latitude) && !isNaN(coord.longitude));
  
      const userCoord = {
        latitude: Number(currentCoordinates.latitude),
        longitude: Number(currentCoordinates.longitude)
      };
  
      if (!isNaN(userCoord.latitude) && !isNaN(userCoord.longitude)) {
        stationCoords.push(userCoord);
      }
  
      if (stationCoords.length > 0) {
        mapRef.current.fitToCoordinates(stationCoords, {
          edgePadding: { top: 60, right: 60, bottom: 60, left: 60 },
          animated: true,
        });
      } else {
        console.warn("No valid coordinates for overview zoom");
      }
    }
  };
  
  const zoomToCurrentLocation = () => {
    if (mapRef.current && currentCoordinates) {
      mapRef.current.animateToRegion({
        latitude: currentCoordinates.latitude,
        longitude: currentCoordinates.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  const getCrowdInitial = (level: string): 'low' | 'medium' | 'high' => {
    switch (level.toLowerCase()) {
      case 'l':
        return 'low';
      case 'm':
        return 'medium';
      case 'h':
        return 'high';
      default:
        return 'low'; // fallback
    }
  };
  

  const setSections = (sections: number[]) => {
    setActiveSections(sections);
  };

  const CrowdLevelIndicator: React.FC<{ load: string }> = ({ load }) => {
    let progress = 0.3;
    let progress2 = 0;
    let progressColor = "green";

    switch (load) {
      case 'low':
        progressColor = "green";
        progress = 0.4;
        break;
      case 'medium':
        progressColor = "orange";
        progress = 0.7;
        progress2 = 0.4;
        break;
      case 'high':
        progressColor = "red";
        progress = 1;
        progress2 = 0.7;
        break;
      default:
        progressColor = "gray";
    }

    return (
      <View style={styles.crowdLevelContainer}>
        <Text style={styles.crowdLevelText}>{t('trainhomelayout.crowdLevel')}</Text>
        <View style={styles.progressBarsContainer}>
          <Progress.Bar progress={progress} height={1} width={80} color={progressColor} style={styles.progressBar} />
          {progress2 > 0 && (
            <Progress.Bar progress={progress2} height={1} width={80} color={progressColor} />
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
        <ActivityIndicator size="large" color={color} />
        <Text style={{ marginTop: 10, fontSize: fontsize, color: color }}>
          {t('trainhomelayout.Loading')}
        </Text>
      </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {showMap ? (
          <>
            <View style={styles.topButtonRow}>
            <TouchableOpacity style={styles.topButton} onPress={zoomToCurrentLocation}>
              <View style={styles.mapButtonContent}>
                <Ionicons name="locate" size={20} color="#fff" />
                <Text style={styles.mapButtonText}>{t('trainhomelayout.CurrentLocation')}</Text>
              </View>
            </TouchableOpacity>
              <TouchableOpacity style={styles.topButton} onPress={zoomOutOverview}>
                <View style={styles.mapButtonContent}>
                  <Ionicons name="eye" size={20} color="#fff" />
                  <Text style={styles.topButtonText}>{t('trainhomelayout.Overview')}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.topButton} onPress={() => setShowMap(false)}>
                <View style={styles.mapButtonContent}>
                  <Ionicons name="list" size={20} color="#fff" />
                  <Text style={styles.topButtonText}>{t('trainhomelayout.ShowList')}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, height: 400 }}>
              <MapView
                ref={mapRef}
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: trainData[0]?.latitude || 1.3521,
                  longitude: trainData[0]?.longitude || 103.8198,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
              >
                {trainData.map((station, index) => (
                  <Marker
                    key={index}
                    coordinate={{ latitude: station.latitude, longitude: station.longitude }}
                    title={station.title}
                    description={`Crowd Level: ${getCrowdInitial(station.content).toUpperCase()}`}
                  />
                ))}
                {currentCoordinates && (
                  <Marker
                    coordinate={{
                      latitude: currentCoordinates.latitude,
                      longitude: currentCoordinates.longitude,
                    }}
                    title="Current Location"
                    pinColor="blue"
                  />
                )}
              </MapView>
            </View>
          </>
        ) : (
          <>
            <Accordion
              sectionContainerStyle={styles.accordionBorder}
              activeSections={activeSections}
              sections={trainData}
              touchableComponent={TouchableOpacity}
              expandMultiple={true}
              renderHeader={(section, _, isActive) => (
                <Animatable.View
                  duration={400}
                  style={[isActive ? styles.active : styles.inactive, styles.accordionHeader]}
                  transition="backgroundColor"
                >
                  <View style={styles.accordionHeaderRow}>
                    <Text style={styles.headerText}>{section.title}</Text>
                    <Ionicons
                      name={isActive ? "chevron-up-outline" : "chevron-down-outline"}
                      size={20}
                      color={styles.chevronIcon.color}
                    />
                  </View>
                </Animatable.View>
              )}
              renderContent={(section, _, isActive) => (
                <Animatable.View
                  duration={400}
                  style={[styles.accordionContent, isActive ? styles.active : styles.inactive]}
                  transition="backgroundColor"
                >
                  <CrowdLevelIndicator load={getCrowdInitial(section.content)} />
                </Animatable.View>
              )}
              duration={1000}
              onChange={setSections}
            />
            <TouchableOpacity style={styles.mapButton} onPress={() => setShowMap(true)}>
              <Ionicons name="map" size={20} color="#fff" />
              <Text style={styles.mapButtonText}>{t('trainhomelayout.ShowMap')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mapButton} onPress={handleOpenSMRTTrainArrival}>
              <Ionicons name="train" size={20} color="#fff" />
              <Text style={styles.mapButtonText}>{t('trainhomelayout.TrainInfo')}</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Trainhomelayout;
