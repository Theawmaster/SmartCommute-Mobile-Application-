// IntroScreen.styles.ts
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  rightRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  sunIcon: {
    marginRight: 10,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  sunText: {
    fontSize: 24,
  },
  themeSwitch: {
    marginRight: 10,
  },
  weatherInfo: {
    marginLeft: 10,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#5abdb2',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  weatherContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  weatherIcon: {
    width: 40,
    height: 40,
  },
  weatherText: {
    marginLeft: 5,
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 5,
  },
  logo: {
    width: 300,
    height: 300,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 1,
  },
  box: {
    width: "95%",
    minHeight: 300,
    padding: 20,
    borderWidth: 1,
    borderRadius: 10,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
    alignItems: "center",
  },
  icon: {
    marginVertical: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    paddingVertical: 6,
  },
  listIcon: {
    width: 25,
    textAlign: "center",
  },
  listText: {
    fontSize: 16,
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#5ABDB2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default styles;