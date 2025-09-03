import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native';
import { useTheme } from '../components/ThemeContext';
import Layout from '../components/Layout';
import { ScrollView } from 'react-native-gesture-handler';
import { isAndroidStudio } from '../components/locationService';
import { ServerIP, ServerPort } from '../components/ServerIP';
import { useTranslation } from 'react-i18next';
const Profile: React.FC = () => {
  const { isDarkMode, color } = useTheme();
  const navigation = useNavigation<any>();

  // Local state to store token and user info
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState('Guest'); // Default status
  const { t } = useTranslation();
  // Controls visibility of Premium modal
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  /**
   * Fetch user details from the server and set the token status accordingly.
   */
  const fetchUserDetails = async () => {
    try {
      const localToken = await AsyncStorage.getItem("authToken");
      setToken(localToken); 
      if (!localToken) {
        // If no token, set status to Guest
        setStatus('Guest');
      }

      const response = await fetch(isAndroidStudio? `http://10.0.2.2:${ServerPort}/api/user/userid`: `${ServerIP}:${ServerPort}/api/user/userid`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localToken}`,
        },
      });

      const data = await response.json();
      if (response.ok && data.user) {
        if (data.user.isAdmin) {
          setStatus("Admin");
        } else if (data.user.isPremium) {
          setStatus("Premium");
        } else {
          setStatus("Lite");
        }
        return data.user;
      } else {
        setStatus("Guest");
      }
    } catch (error) {
      setStatus('Guest'); 
    }
  };

  /**
   * Get username on mount.
   */
  useEffect(() => {
    const getUsername = async () => {
      try {
        const userDetails = await fetchUserDetails();
        if (userDetails) {
          const fetchedUsername = userDetails.username;
          await AsyncStorage.setItem("username", fetchedUsername);
          setUsername(fetchedUsername);
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    getUsername();
  }, []);

  /**
   * Handle the Login/Logout button press.
   * - If no token, navigate to Login.
   * - If token exists, remove it and navigate to Login.
   */
  const handleLoginLogout = async () => {
    if (!token) {
      navigation.navigate("LandingPage");
    } else {
      // Logout: remove token, reset status, navigate to Login
      await AsyncStorage.removeItem("authToken");
      setToken(null);
      setStatus("Guest");
      navigation.navigate("Home");
      Alert.alert(t('ProfilePage.Alerts.LoggedOut'));
    }
  };

  const handleChangePassword = () => {
    if (!token) {
      Alert.alert(t('ProfilePage.Alerts.DenyAccess'));
    } else {
      navigation.navigate("ChangePassword");
    }
  };

  const handleSupportPress = () => {
    if (status === 'Guest') {
      Alert.alert(
        t('ProfilePage.Alerts.LoginRequired')
      );
    } else if (status === 'Lite') {
      setShowPremiumModal(true);
    }
  };

  const handlePurchasePremium = async () => {
    try {
      const response = await fetch(
        isAndroidStudio 
          ? `http://10.0.2.2:${ServerPort}/api/admin/make-premium` 
          : `${ServerIP}:${ServerPort}/api/admin/make-premium`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ premium: true }), 
        }
      );
  
      const data = await response.json();

      if (response.ok && data.success) {
        await AsyncStorage.setItem("authToken", data.token);
        setToken(data.token);
        await fetchUserDetails(); 
        Alert.alert(t('ProfilePage.Alerts.PurchaseSuccess'));
      } else {
        Alert.alert(t('ProfilePage.Alerts.PurchaseFail'));
      }
    } catch (error) {
      Alert.alert(t('ProfilePage.Alerts.Error'));
    } finally {
      setShowPremiumModal(false);
    }
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 0,
      backgroundColor: isDarkMode ? '#333' : '#fff',
      marginTop:-70,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: isDarkMode ? '#fff' : '#000',
    },
    imageContainer: {
      alignItems: 'center',
      marginTop:-60,
     
    },
    image: {
      width: 350,
      height: 350,
      resizeMode: 'contain',
    },
    backButton: {
      position: 'absolute',
      marginBottom: 20,
      padding: 10,
      backgroundColor: '#5abdb2',
      borderRadius: 10,
    },
    backButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    username: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: isDarkMode ? '#fff' : '#000',
    },
    statusContainer: {
      marginVertical: 20,
      backgroundColor: isDarkMode ? '#444' : '#f0f0f0',
      padding: 15,
      borderRadius: 20,
      width: '80%',
      alignItems: 'center',
    },
    statusText: {
      fontSize: 18,
      color: isDarkMode ? '#fff' : '#555',
    },
    button: {
      backgroundColor: color,
      padding: 10,
      marginVertical: 10,
      borderRadius: 20,
      width: '80%',
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      textAlign: 'center',
      fontSize: 16,
    },

    // Modal Styles
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
      width: '85%',
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    modalSubtitle: {
      fontSize: 16,
      marginBottom: 10,
    },
    modalPrice: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    modalFeatures: {
      fontSize: 16,
      marginVertical: 2,
    },
    purchaseButton: {
      backgroundColor: '#d32f2f',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginTop: 15,
    },
    purchaseButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    restoreButtonText: {
      marginTop: 10,
      textDecorationLine: 'underline',
      color: '#007BFF',
    },
    modalDisclaimer: {
      marginTop: 10,
      fontSize: 12,
      color: '#888',
      textAlign: 'justify',
    },
  });

  return (
    <Layout>          
      <ScrollView>
        {/* Back button */}
        <TouchableOpacity style={[styles.backButton, {backgroundColor:color}]} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{t('ProfilePage.back')}</Text>
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.imageContainer}>
          <Image source={require('./../assets/SmartCommute_Logo.png')} style={styles.image} />
        </View>

        {/* Profile Content */}
        <View style={styles.container}>
          <Text style={styles.header}>{t('ProfilePage.profiledetail')}</Text>

          {/* Status Section */}
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>{t(`ProfilePage.Status${status}`)}</Text>
          </View>

          {/* Username Display */}
          <Text style={styles.username}>
            {token ? t('ProfilePage.GreetingHi', { username }) : t('ProfilePage.Greeting')}!
          </Text>

          {/* If Admin, show a button to navigate to Admin Settings */}
          {status === 'Admin' && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("ProfilepageforAdmin")}
            >
              <Text style={styles.buttonText}>{t('ProfilePage.GoAdminPanel')}</Text>
            </TouchableOpacity>
          )}

          {/* Change Password Button */}
          {status !== 'Guest' && (
            <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
              <Text style={styles.buttonText}>{t('ProfilePage.ChangePassword')}</Text>
            </TouchableOpacity>
          )}

          {/* Login/SignUp Button */}
          {status === 'Guest' && (
            <TouchableOpacity style={[styles.button, {backgroundColor:color}]} onPress={handleLoginLogout}>
              <Text style={styles.buttonText}>{t('ProfilePage.SignupLogin')}</Text>
            </TouchableOpacity>
          )} 
          
          {/* Logout Button */}
          {status !== 'Guest' && (
            <TouchableOpacity style={styles.button} onPress={handleLoginLogout}>
              <Text style={styles.buttonText}>{t('ProfilePage.Logout')}</Text>
            </TouchableOpacity>
          )}

          {/* Support us Button (only if Guest or Lite) */}
          {(status === 'Guest' || status === 'Lite') && (
            <TouchableOpacity style={styles.button} onPress={handleSupportPress}>
              <Text style={styles.buttonText}>{t('ProfilePage.Supportus')}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Premium Modal (only shown if user is Lite and tapped "Support us") */}
        <Modal
          visible={showPremiumModal}
          animationType="fade"
          transparent
          onRequestClose={() => setShowPremiumModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{t('ProfilePage.Message1')}</Text>
              <Text style={styles.modalSubtitle}>
              {t('ProfilePage.Message2')}
              </Text>
              <Text style={styles.modalPrice}>{t('ProfilePage.Message3')}</Text>
              <Text style={styles.modalFeatures}>{t('ProfilePage.Message4')}</Text>
              <Text style={styles.modalFeatures}>{t('ProfilePage.Message5')}</Text>
              <Text style={styles.modalFeatures}>{t('ProfilePage.Message6')}</Text>

              <TouchableOpacity
                style={styles.purchaseButton}
                onPress={handlePurchasePremium}
              >
                <Text style={styles.purchaseButtonText}>{t('ProfilePage.Upgrade')}</Text>
              </TouchableOpacity>

              <Text style={styles.modalDisclaimer}>
              {t('ProfilePage.NoteMessage')}
              </Text>

              {/* Close modal by pressing outside or with a "Cancel" button */}
              <Pressable
                style={{ marginTop: 20 }}
                onPress={() => setShowPremiumModal(false)}
              >
                <Text style={{ color: 'green', fontWeight: '600' }}>{t('ProfilePage.Cancel')}</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </Layout>
  );
};

export default Profile;