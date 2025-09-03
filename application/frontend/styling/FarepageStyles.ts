import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  transportTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  lastCell: {
    borderRightWidth: 0,
  },
  wideCell: {
    flex: 2,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});