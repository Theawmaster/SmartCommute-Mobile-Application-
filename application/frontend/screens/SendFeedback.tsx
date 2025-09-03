import React, { useState } from 'react';
import { View, Text, TextInput, Alert, ScrollView, TouchableOpacity, Button as RNButton } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ServerIP, ServerPort } from '../components/ServerIP';
import { isAndroidStudio } from '../components/locationService';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native';
import { useTheme } from '../components/ThemeContext';
import Layout from '../components/Layout';
import SendFeedbackStyles from '../styling/SendFeedback.styles';
import { useTranslation } from 'react-i18next';

const SendFeedback: React.FC = () => {
  const { isDarkMode, color } = useTheme();
  const navigation = useNavigation();
  const [message, setMessage] = useState<string>('');
  const [rating, setRating] = useState<number>(0); // Rating value from 1 to 5
  const { t } = useTranslation(); // Translation hook

  // Get styles based on the current theme
  const styles = SendFeedbackStyles(isDarkMode, color);

  // Handle feedback submission
  const handleSubmit = async () => {
    if (!message || rating === 0) {
      Alert.alert(t('feedback.alerts.errorEmpty'));
      return;
    }

    const token = await AsyncStorage.getItem("authToken");

    try {
      const response = await fetch(
        isAndroidStudio
          ? `http://10.0.2.2:${ServerPort}/api/feedback/submitfeedback`
          : `${ServerIP}:${ServerPort}/api/feedback/submitfeedback`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message, rating }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert(t('feedback.alerts.success'));
        setMessage('');
        setRating(0);
      } else {
        Alert.alert(t('feedback.alerts.errorAuth'));
      }
    } catch (error) {
      Alert.alert(t('feedback.alerts.errorNetwork'));
    }
  };

  return (
    <Layout>
      <ScrollView>
        <TouchableOpacity style={[styles.backButton]} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{t('feedback.back')}</Text>
        </TouchableOpacity>

        <View style={styles.imageContainer}>
          <Image 
            source={require('../assets/SmartCommute_Logo.png')} 
            style={styles.image}
          />
        </View>

        <View style={styles.container}>
          <Text style={styles.header}>{t('feedback.title')}</Text>

          {/* Message Input */}
          <TextInput
            style={styles.input}
            placeholder={t('feedback.placeholder')}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
          />

          {/* Rating System */}
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>{t('feedback.ratingLabel')}</Text>
            {[1, 2, 3, 4, 5].map(ratingValue => (
              <RNButton
                key={ratingValue}
                title={`${ratingValue}`}
                onPress={() => setRating(ratingValue)}
                color={rating === ratingValue ? color : 'gray'}
              />
            ))}
          </View>

          {/* Submit Button */}
          <RNButton title={t('feedback.submit')}  onPress={handleSubmit} color={color} />
        </View>
      </ScrollView>
    </Layout>
  );
};

export default SendFeedback;
