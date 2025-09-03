import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, useColorScheme } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5";

type PermissionsScreenProps = {
  navigation: NavigationProp<any>;
};

const logo = require("../assets/SmartCommute_Logo.png");

const PermissionsScreen: React.FC<PermissionsScreenProps> = ({ navigation }) => {
  const isDarkMode = useColorScheme() === "dark";
  const themeStyles = getThemedStyles(isDarkMode);

  return (
    <View style={[styles.screen, themeStyles.screen]}>
      <View style={styles.header} />
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>
      <View style={[styles.container, themeStyles.container]}>
        <View style={[styles.box, themeStyles.box]}>
          <Icon name="exclamation-circle" size={24} color="#F1C40F" style={styles.icon} />
          <Text style={[styles.title, themeStyles.text]}>Permissions</Text>
          <Text style={[styles.text, themeStyles.text]}>
            To provide real-time transport updates, SmartCommute needs your location access.
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.denyButton} onPress={() => navigation.goBack()}>
              <Text style={styles.buttonText}>Deny</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.allowButton} onPress={() => navigation.navigate("Home")}>
              <Text style={styles.buttonText}>Allow</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const getThemedStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    screen: { backgroundColor: isDarkMode ? "#121212" : "#fff" },
    container: { backgroundColor: isDarkMode ? "#121212" : "#fff" },
    box: {
      backgroundColor: isDarkMode ? "#1E1E1E" : "#fff",
      borderColor: isDarkMode ? "#2C3E50" : "#BDC3C7",
      shadowColor: isDarkMode ? "#000" : "#7F8C8D",
    },
    text: { color: isDarkMode ? "#E0E0E0" : "#34495E" },
  });

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { height: 60, backgroundColor: "#5ABDB2" },
  logoContainer: { alignItems: "center", marginTop: 10 },
  logo: { width: 200, height: 200 },
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 30,
  },
  box: {
    width: "90%",
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
  icon: { marginVertical: 5 },
  title: { fontSize: 20, fontWeight: "bold", textAlign: "center" },
  text: { fontSize: 16, textAlign: "center", marginTop: 10 },
  buttonRow: { flexDirection: "row", justifyContent: "center", width: "100%", marginTop: 50 },
  denyButton: {
    backgroundColor: "#E74C3C",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    marginBottom: 10,
  },
  allowButton: {
    backgroundColor: "#1ABC9C",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    marginBottom: 10,
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default PermissionsScreen;
