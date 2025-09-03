import React from 'react';
import { Switch,SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { useTheme } from "../components/ThemeContext";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

type RootStackParamList = {
  Verificationselection: { verificationType: "L" | "R" | "F"; email?: string }; // Include email as optional
  LoginVerificationPage: undefined;
  VerificationPage: { verificationType: "L" | "R" | "F"; email?: string };
};

type VerificationselectionRouteProp = RouteProp<RootStackParamList, "Verificationselection">;

type VerificationselectionProps = {
  navigation: NavigationProp<any>;
};

const Verificationselection: React.FC<VerificationselectionProps> = ({ navigation }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const route = useRoute<VerificationselectionRouteProp>();

  // Extract the verification type parameter from the route
  const { verificationType, email } = route.params;

  // Choose the color scheme based on the theme
  const colors = isDarkMode ? darkModeColors : lightModeColors;

  // Handle the button press by checking the parameter
  const handleVerificationPress = () => {
    if (verificationType === "L") {
      navigation.navigate("VerificationPage", {verificationType: "L", email});
    } else if (verificationType === "R") {
      navigation.navigate("VerificationPage", {verificationType: "R", email});
    } else if (verificationType === "F") {
      navigation.navigate("VerificationPage", {verificationType: "F", email});
    }
  };
  const { t } = useTranslation();
  return (
    <SafeAreaView style={{flex:1}}>
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
       {/* Back Button */}
    <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("ForgetPasswordPage")}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleTheme}
        value={isDarkMode}
        style={styles.switch}
      />
      <Text style={[styles.primarytext, { color: colors.text }]}>{t('Verificationselectionpage.text1')}</Text>
      <TouchableOpacity 
        style={[
          styles.button, 
          { 
            backgroundColor: colors.buttonPrimaryBackground, 
            borderColor: colors.borderColor, 
            width: "85%", 
            height: 30, 
            padding: 3 
          }
        ]} 
        onPress={handleVerificationPress}
      >
        <Text style={[styles.buttonText, { color: colors.text }]}>
        {t('Verificationselectionpage.text2')} <Text style={{ fontWeight: 'bold' }}>{t('Verificationselectionpage.text3')}</Text>
        </Text>
      </TouchableOpacity>

   

    </View>
    </SafeAreaView>
  );
};

const lightModeColors = {
  background: "#fff",
  text: "#000",
  borderColor: "green",
  buttonPrimaryBackground: "#fff",
};

const darkModeColors = {
  background: "#121212",
  text: "#fff",
  borderColor: "green",
  buttonPrimaryBackground: "#121212",
};

const styles = StyleSheet.create({
  switch: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  button: {
    marginTop: 65,
    borderRadius: 25,
    alignSelf: "center",
    marginBottom: 10,
    alignItems: "center",
    borderWidth: 1,
    elevation: 8,
  },
  primarytext: {
    marginTop: 300,
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: "center",
  },
  buttonText: {
    fontSize: 16,
  },
  backButton: {
    position: "absolute",
    top: 25,
    left: 20,
  },

});

export default Verificationselection;
