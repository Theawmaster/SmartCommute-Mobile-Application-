import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface DynamicStyleParams {
  isDarkMode: boolean;
  color: string;
  fontsize: number;
}


const fareRouteMap = ({ isDarkMode, color, fontsize }: DynamicStyleParams) =>
  StyleSheet.create({
    container: { padding: 20, flexGrow: 1 },
    label: { marginBottom: 5, fontWeight: 'bold' },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 8,
      marginBottom: 15,
      borderRadius: 5,
      backgroundColor: '#fff',
      color: '#000',
    },
    searchButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
      alignItems: 'center',
      marginBottom: 10,
    },
    searchButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    fareText: { marginTop: 20, fontSize: 15, fontWeight: 'bold' },
    instructionsHeader: { fontWeight: 'bold', marginBottom: 10, fontSize: 16 },
    legTitle: { fontWeight: 'bold', fontSize: 14, marginVertical: 4 },
    stopListContainer: { marginLeft: 15, marginTop: 5, paddingBottom: 10 },
    stopText: { fontSize: 13, marginVertical: 2, color: '#555' },
    mapContainer: { height: 400, marginTop: 20 },
    map: { ...StyleSheet.absoluteFillObject },
    overviewButton: {
      marginTop: 10,
      alignSelf: 'center',
      backgroundColor: '#5abdb2',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
    },
    overviewButtonText: { fontWeight: 'bold', textAlign: 'center', color: '#fff' },
    carouselItem: {
      backgroundColor: '#ccc',
      borderRadius: 10,
      padding: 15,
      marginRight: 10,
      width: 150,
      alignItems: 'center',
    },
    carouselContainer: {
      flexDirection: 'row',
      marginVertical: 10,
    },
    selectedCarouselItem: {
      backgroundColor: '#5abdb2',
    },
    carouselItemText: {
      fontWeight: 'bold',
      fontSize: 16,
      color: '#fff',
    },
    carouselBadge: {
      fontSize: 12,
      color: '#fff',
      marginTop: 5,
      textAlign: 'center',
    },
    modeToggleContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 15,
    },
    modeButton: {
      paddingVertical: 8,
      paddingHorizontal: 15,
      backgroundColor: '#ccc',
      marginHorizontal: 5,
      borderRadius: 10,
    },
    selectedModeButton: {
      backgroundColor: color,
    },
    modeButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });

export default fareRouteMap;