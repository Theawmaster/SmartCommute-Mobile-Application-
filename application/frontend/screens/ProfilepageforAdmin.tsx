import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Layout from '../components/Layout';
import { useTheme } from '../components/ThemeContext';
import { isAndroidStudio } from '../components/locationService';
import { ServerIP,ServerPort } from '../components/ServerIP';
import { useTranslation } from 'react-i18next';
const ProfilepageforAdmin: React.FC = () => {
  const { isDarkMode, color } = useTheme();
  const navigation = useNavigation<any>();
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Lite');
  const { t } = useTranslation();
  const [feedbacks, setFeedbacks] = useState<
    {
      username: string;
      feedbacks: {
        message: string;
        rating: number;
        createdAt: string;
      }[];
    }[]
  >([]);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const localToken = await AsyncStorage.getItem('authToken');
      if (!localToken) {
        // Not logged in
        setStatus('Lite');
        Alert.alert(t('ProfilePageForAdmin.Alerts.NotLoggedIn'));
        navigation.navigate('ProfilePage'); 
        return;
      }

      // Fetch user details to check isAdmin
      const response = await fetch(isAndroidStudio? `http://10.0.2.2:${ServerPort}/api/user/userid`: `${ServerIP}:${ServerPort}/api/user/userid`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localToken}`,
        },
      });

      const data = await response.json();
      if (response.ok && data.user?.isAdmin) {
        // User is admin
        setToken(localToken);
        setStatus('Admin');
        fetchAllFeedback(localToken);
      } else {
        // Not admin
        setStatus('Lite');
        Alert.alert(t('ProfilePageForAdmin.Alerts.DenyAccess'));
        navigation.navigate('Home'); 
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      Alert.alert(t('ProfilePageForAdmin.Alerts.ErrorVerify'));
      navigation.navigate('Home');
    }
  };

  /**
   * 2) Fetch all feedback from the server
   */
  const fetchAllFeedback = async (localToken: string) => {
    try {
      const response = await fetch(isAndroidStudio? `http://10.0.2.2:${ServerPort}/api/feedback/retrievefeedbacks`: `${ServerIP}:${ServerPort}/api/feedback/retrievefeedbacks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localToken}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        // Successfully fetched feedback data
        setFeedbacks(data.feedbackData || []);
      } else {
        Alert.alert(t(`ProfilePageForAdmin.BackendMessages.getfeedback${response.status}`) || 'Failed to fetch feedbacks');
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      Alert.alert(t('ProfilePageForAdmin.Alerts.ErrorFetch'));
    }
  };

  // ---------- Styles ----------
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#333' : '#fff',
      paddingTop: 0,
    },
    backButton: {
      marginBottom: 20,
      padding: 10,
      backgroundColor: color,
      borderRadius: 5,
      alignSelf: 'flex-start',
    },
    backButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    imageContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    image: {
      width: 100,
      height: 100,
      resizeMode: 'contain',
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
      color: isDarkMode ? '#fff' : '#000',
    },
    feedbackItem: {
      marginBottom: 15,
      padding: 10,
      backgroundColor: isDarkMode ? '#444' : '#f9f9f9',
      borderRadius: 8,
    },
    usernameText: {
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 5,
      color: isDarkMode ? '#fff' : '#000',
    },
    singleFeedback: {
      marginBottom: 10,
      paddingLeft: 10,
      borderLeftWidth: 2,
      borderLeftColor: color,
    },
    feedbackText: {
      color: isDarkMode ? '#ddd' : '#333',
      marginBottom: 3,
    },
    ratingText: {
      color: '#f39c12',
      marginBottom: 3,
    },
    dateText: {
      color: '#888',
      fontSize: 12,
    },
    button: {
      backgroundColor: '#007bff',
      padding: 12,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 40,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
  });

  return (
    <Layout>
        <ScrollView>
            <View style={styles.container}>
            {/* Back button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>{t('ProfilePageForAdmin.Back')}</Text>
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.header}>{t('ProfilePageForAdmin.FeedbackReceive')}</Text>

            {/* List of feedbacks */}
            {feedbacks.map((item, index) => (
                <View key={index} style={styles.feedbackItem}>
                <Text style={styles.usernameText}>{t('ProfilePageForAdmin.User')}{item.username}</Text>
                {item.feedbacks.map((fb, fbIndex) => (
                    <View key={fbIndex} style={styles.singleFeedback}>
                    <Text style={styles.feedbackText}>{fb.message}</Text>
                    <Text style={styles.ratingText}>{t('ProfilePageForAdmin.Rating')}{fb.rating}</Text>
                    <Text style={styles.dateText}>
                    {t('ProfilePageForAdmin.Date')}{new Date(fb.createdAt).toLocaleString()}
                    </Text>
                    </View>
                ))}
                </View>
            ))}
            </View>
       </ScrollView>
    </Layout>
  );
};

export default ProfilepageforAdmin;