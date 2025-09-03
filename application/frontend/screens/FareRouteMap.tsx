import React, { useState, useRef } from 'react';
import {
  View,
  Alert,
  TextInput,
  Text,
  Platform,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import polyline from '@mapbox/polyline';
import Layout from '../components/Layout';
import { ServerIP, ServerPort } from '../components/ServerIP';
import { useTheme } from '../components/ThemeContext';
import fareData from '../data/fares.json';
import fareRouteMap from  '../styling/FareRouteMap.styles'
import { useTranslation } from 'react-i18next';

const FareRouteMap: React.FC = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [routeData, setRouteData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedItineraryIndex, setSelectedItineraryIndex] = useState<number>(0);
  const [highlightedLegIndex, setHighlightedLegIndex] = useState<number | null>(null);
  const [expandedLegIndices, setExpandedLegIndices] = useState<number[]>([]);
  const { color, isDarkMode, fontsize } = useTheme();
  const [routeMode, setRouteMode] = useState<'pt' | 'drive'>('pt');
  
  const dynamicStyles = fareRouteMap({ isDarkMode, color, fontsize });
  // For translation
  const { t } = useTranslation();

  const mapRef = useRef<MapView>(null);
  const scrollRef = useRef<ScrollView>(null);
  const { width } = Dimensions.get('window');

  const getCurrentDateFormatted = (): string => {
    const date = new Date();
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}-${date.getFullYear()}`;
  };

  const getCurrentTimeFormatted = (): string => {
    const date = new Date();
    return `${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  };

  const backendBaseURL =
    Platform.OS === 'android' && Platform.constants.Brand?.toLowerCase().includes('google')
      ? `http://10.0.2.2:${ServerPort}`
      : `${ServerIP}:${ServerPort}`;

  const MODE_COLORS: Record<string, string> = {
    WALK: '#000000',
    BUS: '#00CFAF',
    SUBWAY: '#888888',
    CAR: '#FFA500',
  };

  const MRT_LINE_COLORS: Record<string, string> = {
    NS: '#D32F2F', EW: '#388E3C', NE: '#8E24AA', CC: '#FFA000', DT: '#1976D2',
    TE: '#A1887F', CG: '#388E3C', BP: '#006400', PE: '#006400', SE: '#006400',
    SW: '#006400', SS: '#006400', PW: '#006400',
  };

  const MRT_LINE_NAMES: Record<string, string> = {
    NS: 'NSL', EW: 'EWL', NE: 'NEL', CC: 'CCL', DT: 'DTL', TE: 'TEL',
    CG: 'CGL', BP: 'BPLRT', PE: 'PELRT', SE: 'SELRT', SW: 'SWLRT',
    SS: 'SSLRT', PW: 'PWLRT',
  };
  
  const toggleLegExpansion = (index: number) => {
    setExpandedLegIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  
  const fetchRouteData = async () => {
    try {
      setLoading(true);
      const date = getCurrentDateFormatted();
      const time = getCurrentTimeFormatted();
  
      const url = `${backendBaseURL}/api/fare-route?start=${encodeURIComponent(origin)}&end=${encodeURIComponent(destination)}&routeType=${routeMode}${
        routeMode === 'pt'
          ? `&date=${date}&time=${encodeURIComponent(time)}&mode=TRANSIT&maxWalkDistance=50&numItineraries=6`
          : `&date=${date}&time=${encodeURIComponent(time)}&mode=CAR`
      }`;
  
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      const data = await response.json();
  
      // Validation
      if (!data?.plan?.itineraries?.length) {
        throw new Error('Invalid route data');
      }
  
      setRouteData(data);
      setSelectedItineraryIndex(0);
      setExpandedLegIndices([0]);
    } catch (error: any) {
      Alert.alert(t('fareroute.AlertTitle'), t('fareroute.AlertMessage'), [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };  
  
  const zoomToLeg = (legIndex: number) => {
    if (!routeData || !mapRef.current) return;
    const leg = routeData.plan.itineraries[selectedItineraryIndex].legs[legIndex];
    const decoded = polyline.decode(leg.legGeometry.points).map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
    if (decoded.length > 0) {
      mapRef.current.fitToCoordinates(decoded, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  const renderLegDetails = (leg: any, index: number) => {
    const { mode, from, to, intermediateStops = [], routeShortName } = leg;
    const isExpanded = expandedLegIndices.includes(index);
    let description = '';
  
    if (mode === 'WALK') description = `Walk from ${from.name} to ${to.name}`;
    else if (mode === 'BUS')
      description = `Take Bus ${routeShortName} from ${from.name} to ${to.name} (${intermediateStops.length+1} stops)`;
    else if (mode === 'SUBWAY') {
      const routeCode = leg.route || 'Unknown Line';
      const lineCode = MRT_LINE_NAMES[routeCode] || routeCode;
      description = `Take MRT (${lineCode}) from ${from.name} to ${to.name} (${intermediateStops.length+1} stops)`;
    } else if (mode === 'CAR') {
      const steps = leg.steps || [];
      if (steps.length > 0) {
        description = `Drive: ${steps[0][9] || 'Start driving'}`;
      } else {
        description = `Drive from ${from.name} to ${to.name}`;
      }
    } else description = `${mode} from ${from.name} to ${to.name}`;
  
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          toggleLegExpansion(index);
          setHighlightedLegIndex(index);
          zoomToLeg(index);
        }}
        style={{
          backgroundColor: highlightedLegIndex === index ? '#e0f7fa' : 'transparent',
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: '#ccc',
        }}
      >
        <Text style={[dynamicStyles.legTitle, { color: getModeColor(mode, leg.route) }]}>
          {index + 1}. {description}
        </Text>
        {isExpanded && intermediateStops.length > 0 && (
          <View style={dynamicStyles.stopListContainer}>
            {intermediateStops.map((stop: any, i: number) => (
              <Text key={i} style={dynamicStyles.stopText}>• {stop.name}</Text>
            ))}
          </View>
        )}
        {isExpanded && leg.instructions && (
          <View style={dynamicStyles.stopListContainer}>
            {leg.instructions.map((line: string, i: number) => (
              <Text key={i} style={dynamicStyles.stopText}>• {line}</Text>
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };  

  const getModeColor = (mode: string, route?: string) => {
    if (mode === 'SUBWAY' && route) {
      return MRT_LINE_COLORS[route] || MODE_COLORS.SUBWAY;
    }
    return MODE_COLORS[mode] || (isDarkMode ? '#fff' : '#000');
  };

  const renderMap = () => {
    if (!routeData?.plan?.itineraries?.length) return null;
    const itinerary = routeData.plan.itineraries[selectedItineraryIndex];
  
    const polylines = itinerary.legs.map((leg: any, idx: number) => {
      const decoded = polyline.decode(leg.legGeometry.points).map(([lat, lng]) => ({
        latitude: lat,
        longitude: lng,
      }));
      return (
        <Polyline
          key={`polyline-${idx}`}
          coordinates={decoded}
          strokeColor={getModeColor(leg.mode, leg.route)}
          strokeWidth={4}
        />
      );
    });

    const originCoord = itinerary.legs[0].from;
  const destinationCoord = itinerary.legs.at(-1).to;
  const initialRegion = {
    latitude: originCoord.lat,
    longitude: originCoord.lon,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };


  return (
      <MapView ref={mapRef} style={dynamicStyles.map} initialRegion={initialRegion}>
        {polylines}
        <Marker
          coordinate={{ latitude: originCoord.lat, longitude: originCoord.lon }}
          title="Origin"
          pinColor="blue"
        />
        <Marker
          coordinate={{ latitude: destinationCoord.lat, longitude: destinationCoord.lon }}
          title="Destination"
        />
      </MapView>
    );
  };

  const zoomToFullRoute = () => {
    if (!routeData || !mapRef.current) return;
    const itinerary = routeData.plan.itineraries[selectedItineraryIndex];
    const allCoords = itinerary.legs.flatMap((leg: any) => polyline.decode(leg.legGeometry.points).map(([lat, lng]) => ({ latitude: lat, longitude: lng })));
    if (allCoords.length > 0) {
      mapRef.current.fitToCoordinates(allCoords, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };

  return (
    <Layout>
      <ScrollView contentContainerStyle={dynamicStyles.container} ref={scrollRef}>
        <Text style={[dynamicStyles.label, { color: isDarkMode ? '#fff' : '#000' }]}>{t('fareroute.origin')}</Text>
        <TextInput style={dynamicStyles.input} value={origin} onChangeText={setOrigin} placeholder="e.g. NTU Hall 4" placeholderTextColor="#aaa" />
        <Text style={[dynamicStyles.label, { color: isDarkMode ? '#fff' : '#000' }]}>{t('fareroute.destination')}</Text>
        <TextInput style={dynamicStyles.input} value={destination} onChangeText={setDestination} placeholder="e.g. Woodlands South" placeholderTextColor="#aaa" />
        <View style={dynamicStyles.modeToggleContainer}>
          <TouchableOpacity
            style={[
              dynamicStyles.modeButton,
              routeMode === 'pt' && dynamicStyles.selectedModeButton,
            ]}
            onPress={() => setRouteMode('pt')}
          >
            <Text style={dynamicStyles.modeButtonText}>{t('fareroute.PublicTransport')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              dynamicStyles.modeButton,
              routeMode === 'drive' && dynamicStyles.selectedModeButton,
            ]}
            onPress={() => setRouteMode('drive')}
          >
            <Text style={dynamicStyles.modeButtonText}>{t('fareroute.cab')}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[dynamicStyles.searchButton, { backgroundColor: color }]} onPress={fetchRouteData}>
          <Text style={dynamicStyles.searchButtonText}>{t('fareroute.Search')}</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

        {routeData?.plan?.itineraries?.length > 0 && (
          <>
            <Text style={dynamicStyles.fareText}>
            {t('fareroute.EstimatedFare')} ${routeData.plan.itineraries[selectedItineraryIndex].fare}
            | {t('fareroute.TravelTime')} {routeData.plan.itineraries[selectedItineraryIndex].durationInMinutes} mins
            </Text>

            {routeMode === 'pt' && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={dynamicStyles.carouselContainer}>
                {routeData.plan.itineraries.map((_: any, index: number) => {
                  const isCheapest = index === routeData.cheapestIndex;
                  const isFastest = index === routeData.fastestIndex;

                  let badge = '';
                  if (isCheapest && isFastest) badge = 'Cheapest & Fastest';
                  else if (isCheapest) badge = 'Cheapest';
                  else if (isFastest) badge = 'Fastest';

                  return (
                    <TouchableOpacity
                      key={`itinerary-${index}`}
                      onPress={() => setSelectedItineraryIndex(index)}
                      style={[
                        dynamicStyles.carouselItem,
                        selectedItineraryIndex === index && dynamicStyles.selectedCarouselItem,
                      ]}
                    >
                      <Text style={dynamicStyles.carouselItemText}>Route {index + 1}</Text>
                      {badge !== '' && <Text style={dynamicStyles.carouselBadge}>{badge}</Text>}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            <Text style={dynamicStyles.instructionsHeader}>Instructions:</Text>
            {routeData.plan.itineraries[selectedItineraryIndex].legs.map((leg: any, index: number) => renderLegDetails(leg, index))}
            <TouchableOpacity style={dynamicStyles.overviewButton} onPress={zoomToFullRoute}>
              <Text style={dynamicStyles.overviewButtonText}>{t('fareroute.MapOverview')}</Text>
            </TouchableOpacity>
          </>
        )}
        <View style={dynamicStyles.mapContainer}>{renderMap()}</View>
      </ScrollView>
    </Layout>
  );
};

export default FareRouteMap;
