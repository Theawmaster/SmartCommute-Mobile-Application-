


import * as Location from 'expo-location';
import { Platform } from 'react-native';


export const DEFAULT_COORDINATES = {
  latitude: 1.3436,  
  longitude: 103.6869,
};

// Flag to detect if running in Android Studio emulator
export const isAndroidStudio = Platform.OS === 'android' && (
  Platform.constants.Fingerprint?.includes('generic') || 
  Platform.constants.Brand?.toLowerCase().includes('google')
);


export const getLocation = async () => {
  try {
    // Request location permissions
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access location was denied');
    }

    // Get current location
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return location.coords;
  } catch (error) {
    console.error('Error getting location:', error);
    throw new Error('Could not get location');
  }
}; 