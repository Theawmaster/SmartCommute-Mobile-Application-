import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import createStyles from '../../styling/Settingpage.styles';

type LanguageModalProps = {
  visible: boolean;
  languages: string[];
  selectedLanguage: string;
  onSelectLanguage: (lang: string) => void;
  onClose: () => void;
  isDarkMode: boolean;
  color: string;
  fontsize: number;
};

const LanguageModal: React.FC<LanguageModalProps> = ({
  visible,
  languages,
  selectedLanguage,
  onSelectLanguage,
  onClose,
  isDarkMode,
  color,
  fontsize,
}) => {
  const { t } = useTranslation();
  const styles = createStyles(isDarkMode, color, fontsize);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
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
                selectedLanguage === lang && styles.selectedLangItem,
              ]}
              onPress={() => onSelectLanguage(lang)}
            >
              <Text
                style={[
                  styles.langText,
                  selectedLanguage === lang && styles.selectedLangText,
                ]}
              >
                {lang}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.modalCloseButton, { marginTop: 30 }]}
            onPress={onClose}
          >
            <Text style={styles.modalCloseButtonText}>
              {t('settingpage.closeButton')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default LanguageModal;
