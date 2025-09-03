
// BusStopSearch.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import debounce from 'lodash.debounce';
import { getDistance } from 'geolib';

// Offline geocoding: A simple dataset of Singapore locations with their coordinates.
const singaporeLocations = [
  { name: 'Woodlands', latitude: 1.4371, longitude: 103.7861 },
  { name: 'Marina Bay', latitude: 1.2821, longitude: 103.8585 },
  { name: 'Orchard Road', latitude: 1.3041, longitude: 103.8318 },
  { name: 'Chinatown', latitude: 1.2841, longitude: 103.8438 },
  // ... add more locations as needed.
];

/**
 * Converts a user query (e.g., "Woodlands") to coordinates
 * by checking against the offline dataset.
 */
function getLocationByQuery(query: string) {
  const lowerQuery = query.toLowerCase();
  return singaporeLocations.find(loc => loc.name.toLowerCase().includes(lowerQuery)) || null;
}

/**
 * Filters an array of bus stops to those within a specified radius (in meters)
 * of the provided latitude and longitude.
 */
function filterStopsByDistance(
  stops: BusStop[],
  latitude: number,
  longitude: number,
  radius = 1000
): BusStop[] {
  return stops.filter(stop => {
    const distance = getDistance(
      { latitude, longitude },
      { latitude: stop.latitude, longitude: stop.longitude }
    );
    return distance <= radius;
  });
}

interface BusStop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

const BusStopSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [busStops, setBusStops] = useState<BusStop[]>([]);
  const [filteredStops, setFilteredStops] = useState<BusStop[]>([]);
  const [loading, setLoading] = useState(false);

  // Load bus stops XML feed once on mount
  useEffect(() => {
    const loadBusStops = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://www.lta.gov.sg/map/busService/bus_stops.xml', { timeout: 5000 });
        const parser = new XMLParser();
        const parsedData = parser.parse(response.data);
        // Map the XML data to an array of BusStop objects.
        // Adjust the mapping below based on your XML structure.
        const stops: BusStop[] = (parsedData.busstops.busstop || []).map((stop: any) => ({
          id: stop['@_name'] || "",
          name: stop.details || "Unknown",
          latitude: parseFloat(stop.coordinates.lat || "0"),
          longitude: parseFloat(stop.coordinates.long || "0"),
        }));
        setBusStops(stops);
      } catch (error) {
        console.error('Error loading bus stops:', error);
      } finally {
        setLoading(false);
      }
    };
    loadBusStops();
  }, []);

  // Filter the bus stops as the user types.
  // We debounce the filtering to prevent excessive re-rendering.
  useEffect(() => {
    const debouncedFilter = debounce(() => {
      if (!query) {
        setFilteredStops([]);
        return;
      }
      // Use offline geocoding to convert the query to coordinates.
      const location = getLocationByQuery(query);
      if (location) {
        // Filter the loaded bus stops by proximity to the location's coordinates.
        const results = filterStopsByDistance(busStops, location.latitude, location.longitude);
        setFilteredStops(results);
      } else {
        setFilteredStops([]);
      }
    }, 300);
    debouncedFilter();
    return () => debouncedFilter.cancel();
  }, [query, busStops]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter location (e.g., Woodlands)"
        value={query}
        onChangeText={setQuery}
      />
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={filteredStops}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text style={styles.itemCoords}>
                ({item.latitude.toFixed(4)}, {item.longitude.toFixed(4)})
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text>No bus stops found near this location.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  input: { height: 40, borderWidth: 1, borderColor: '#ccc', marginBottom: 20, paddingHorizontal: 10, borderRadius: 5 },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  itemText: { fontSize: 16 },
  itemCoords: { fontSize: 12, color: '#666' },
});

export default BusStopSearch;
