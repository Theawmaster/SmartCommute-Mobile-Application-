import React, { useState, useEffect } from 'react';
import { 
  View, 
  Image, 
  ScrollView, 
  Modal, 
  Text, 
  TouchableOpacity, 
  TouchableWithoutFeedback 
} from 'react-native';
import { Button } from 'react-native-paper';
import { NavigationProp } from '@react-navigation/native';
import ColorPicker from 'react-native-wheel-color-picker';
import { useTheme } from '../components/ThemeContext';
import Layout from '../components/Layout';
import i18n from '../services/i18n';
import { useTranslation } from 'react-i18next';
import createStyles from '../styling/Settingpage.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LandingPageProps = {
  navigation: NavigationProp<any>;
};

// Available languages (friendly names)
const languages = ['English', '中文', 'Bahasa Melayu', 'தமிழ்'];

// Mapping between i18n language codes and friendly names
const languageMap: { [key: string]: string } = {
  en: 'English',
  zh: '中文',
  ms: 'Bahasa Melayu',
  ta: 'தமிழ்',
};

// Reverse mapping: from friendly name to i18n language code
const reverseLanguageMap: { [key: string]: string } = {
  English: 'en',
  中文: 'zh',
  'Bahasa Melayu': 'ms',
  தமிழ்: 'ta',
};

const Settingpage: React.FC<LandingPageProps> = ({ navigation }) => {
  const { isDarkMode, color, fontsize, changeColor, changeFontSize } = useTheme();
  const { t } = useTranslation();
  const styles = createStyles(isDarkMode, color, fontsize);

  // Initialize the state based on i18n.language (using friendly name)
  const initialLanguage = languageMap[i18n.language] || 'English';
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [colorpickervisible, setcolorpickerVisible] = useState(false);
  const [fontmodalVisible, setfontModalVisible] = useState(false);
  const [selectedFontSize, setSelectedFontSize] = useState(fontsize);
  const [lastValidColor, setLastValidColor] = useState(color);


  // If i18n.language changes (from outside the settings page), update our state.
  useEffect(() => {
    const friendlyLang = languageMap[i18n.language] || 'English';
    setSelectedLanguage(friendlyLang);
  }, [i18n.language]);

  // Change language: update state, call i18n.changeLanguage and close modal.
  const changeLanguage = async (lang: string) => {
    setSelectedLanguage(lang);
    const newLang = reverseLanguageMap[lang] || 'en';
    // Optionally, persist language:
    // await AsyncStorage.setItem('appLanguage', newLang);
    i18n.changeLanguage(newLang);
    setLangModalVisible(false);
  };

  // Font size handler.
  const handlePress = (size: number) => {
    setSelectedFontSize(size);
    changeFontSize(size);
    
  };

  return (
    <Layout>
      <ScrollView style={styles.container}>
        {/* Logo/Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={require('../assets/SmartCommute_Logo.png')} 
            style={styles.image}
          />
        </View>

        {/* Settings Options */}
        <View style={styles.settingsContainer}>
          {/* Language Selection Button */}
          <Button 
            mode="text" 
            icon="translate" 
            onPress={() => setLangModalVisible(true)} 
            style={styles.button} 
            labelStyle={styles.buttonLabel}
          >
            {t('settingpage.languageButton') + selectedLanguage}
          </Button>

          <Button 
            mode="text" 
            icon="human" 
            onPress={() => navigation.navigate('Profile')} 
            style={styles.button} 
            labelStyle={styles.buttonLabel}
          >
            {t('settingpage.myProfile')}
          </Button>

          <Button 
            mode="text" 
            icon="text" 
            onPress={() => setfontModalVisible(true)} 
            style={styles.button} 
            labelStyle={styles.buttonLabel}
          >
            {t('settingpage.displayFonts')}
          </Button>

          <Button 
            mode="text" 
            icon="palette" 
            onPress={() => setcolorpickerVisible(true)} 
            style={styles.button} 
            labelStyle={styles.buttonLabel}
          >
            {t('settingpage.colorTheme')}
          </Button>

          <Button 
            mode="text" 
            icon="comment-text" 
            onPress={() => navigation.navigate('SendFeedback')} 
            style={styles.button} 
            labelStyle={styles.buttonLabel}
          >
            {t('settingpage.sendFeedback')}
          </Button>

          <Button
            mode="text"
            icon="file-document"
            onPress={() => setModalVisible(true)}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            {t('settingpage.termsPolicy')}
          </Button>
        </View>
      </ScrollView>

      {/* Modal for Terms and Conditions */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>
              {t('settingpage.termsPolicy')}
            </Text>
            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalBody}>
                {t('settingpage.modalBody')}
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseButtonText}>
                {t('settingpage.closeButton')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Colour Picker Modal */}
      <Modal
        visible={colorpickervisible}
        transparent
        animationType="slide"
        onRequestClose={() => setcolorpickerVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setcolorpickerVisible(false)}>
        <View style={[styles.sectionContainer, styles.centeredModal]}>
          <View style={styles.colorPickerWrapper}>
              <ColorPicker
                color={color}
                swatches={false}
                row={true} // layout: wheel-only
                sliderHidden={true} // Optional if your library supports it
                thumbSize={30}
                noSnap={true}
                onColorChangeComplete={(clr) => {
                  const forbiddenColors = ['#000000', '#ffffff'];
                  const selectedColor = clr.toLowerCase();

                  if (forbiddenColors.includes(selectedColor)) {
                    alert("This color is restricted. Please choose another.");
                    setTimeout(() => {
                      changeColor(lastValidColor);
                    }, 10);
                    return;
                  }

                  setLastValidColor(clr);
                  changeColor(clr);
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>

      </Modal>

      {/* Font Size Modal */}
      <Modal
        visible={fontmodalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setfontModalVisible(false)}
      >
      <View style={styles.modalOverlay}>
        <View style={styles.fontModalContainer}>
          <Text style={styles.modalHeader}>
            {t('settingpage.fontModalTitle')}
          </Text>
        {[14, 16, 18].map((size) => (
          <TouchableOpacity 
            key={size} 
            style={[
              styles.fontItem, 
              selectedFontSize === size && styles.selectedFontItem
            ]}
            onPress={() => handlePress(size)}
          >
            <Text style={[
              styles.fontText, 
              { fontSize: size },
              selectedFontSize === size && styles.selectedFontText
            ]}>
              {t('settingpage.fontLabel')}
            </Text>
          </TouchableOpacity>
    ))}
    <TouchableOpacity 
      style={[styles.modalCloseButton, { marginTop: 30 }]}
      onPress={() => setfontModalVisible(false)}
    >
      <Text style={styles.modalCloseButtonText}>
        {t('settingpage.closeButton')}
      </Text>
    </TouchableOpacity>
  </View>
</View>
      </Modal>

      {/* Language Selection Modal */}
      <Modal
        visible={langModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLangModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.langModalContainer}>
            <Text style={styles.modalHeader}>
              {t('settingpage.selectLanguageTitle')}
            </Text>
            {languages.map((lang) => (
              <TouchableOpacity 
                key={lang} 
                style={[
                  styles.langItem, 
                  selectedLanguage === lang && styles.selectedLangItem
                ]}
                onPress={() => changeLanguage(lang)}
              >
                <Text style={[
                  styles.langText, 
                  selectedLanguage === lang && styles.selectedLangText
                ]}>
                  {lang}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity 
              style={[styles.modalCloseButton, { marginTop: 30 }]}
              onPress={() => setLangModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>
                {t('settingpage.closeButton')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Layout>
  );
};

export default Settingpage;