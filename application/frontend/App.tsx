import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from "./components/ThemeContext";
import { I18nextProvider } from 'react-i18next';
import i18n from './services/i18n';  // Adjusted the path to match the likely correct folder name

// Import your screens
import IntroScreen from './screens/IntroScreen';
import PermissionsScreen from './screens/PermissionsScreen';
import Landingpage from './screens/Landingpage';
import Loginpage from './screens/Loginpage';
import Forgetpasswordpage from './screens/Forgetpasswordpage';
import Signuppage from './screens/Signuppage';
import SuccessfulPage from './screens/Successfulpage';
import Verificationpage from './screens/Verificationpage';
import Verificationselection from './screens/Verificationselection';
import Homepage from './screens/Homepage';
import Settingpage from './screens/Settingpage';
import Farepage from './screens/Farepage';
import Chatbotpage from './screens/Chatbotpage';
import FareRouteMap from './screens/FareRouteMap';
import SendFeedback from './screens/SendFeedback';
import ProfilePage from './screens/ProfilePage';
import ChangePassword from './screens/ChangePassword';
import ProfilepageforAdmin from './screens/ProfilepageforAdmin';

// Import transport layout components – these will be used for search results
import Taxihomelayout from './components/Taxihomelayout';
import Bushomelayout from './components/Bushomelayout';
import Trainhomelayout from './components/Trainhomelayout';

export type RootStackParamList = {
  IntroScreen: undefined;
  PermissionsScreen: undefined;
  LandingPage: undefined;
  LoginPage: undefined;
  ForgetPasswordPage: undefined;
  SignUpPage: undefined;
  SuccessfulPage: undefined;
  VerificationPage: { verificationType: "L" | "R" | "F"; email?: string } | undefined;
  VerificationSelection: undefined;
  Home: undefined;
  Fare: undefined;
  Settings: undefined;
  FareRouteMap: undefined;
  ChatBotPage: undefined;
  SendFeedback: undefined;
  Profile: undefined;
  ChangePassword: { verificationType?: "F"; email?: string } | undefined;
  ProfilepageforAdmin: undefined;
  // New screens for transport search results:
  TaxiMap: undefined; // Renders Taxihomelayout
  Bus: undefined;     // Renders Bushomelayout
  MRT: undefined;     // Renders Trainhomelayout
};

const Stack = createStackNavigator<RootStackParamList>();

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="IntroScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="IntroScreen" component={IntroScreen} />
      <Stack.Screen name="PermissionsScreen" component={PermissionsScreen} />
      <Stack.Screen name="LandingPage" component={Landingpage} />
      <Stack.Screen name="LoginPage" component={Loginpage} />
      <Stack.Screen name="ForgetPasswordPage" component={Forgetpasswordpage} />
      <Stack.Screen name="SignUpPage" component={Signuppage} />
      <Stack.Screen name="SuccessfulPage" component={SuccessfulPage} />
      <Stack.Screen name="VerificationPage" component={Verificationpage} />
      <Stack.Screen name="VerificationSelection" component={Verificationselection} />
      <Stack.Screen name="Home" component={Homepage} />
      <Stack.Screen name="Fare" component={Farepage} />
      <Stack.Screen name="Settings" component={Settingpage} />
      <Stack.Screen name="FareRouteMap" component={FareRouteMap} />
      <Stack.Screen name="ChatBotPage" component={Chatbotpage} />
      <Stack.Screen name="SendFeedback" component={SendFeedback} />
      <Stack.Screen name="Profile" component={ProfilePage} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="ProfilepageforAdmin" component={ProfilepageforAdmin} />
      {/* Add the transport search screens */}
      <Stack.Screen name="TaxiMap" component={Taxihomelayout} />
      <Stack.Screen name="Bus" component={Bushomelayout} />
      <Stack.Screen name="MRT" component={Trainhomelayout} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </I18nextProvider>
    </ThemeProvider>
  );
}
