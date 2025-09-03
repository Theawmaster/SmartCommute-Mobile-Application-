import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import createStyles from '../../styling/Settingpage.styles';

type TermsModalProps = {
  visible: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  color: string;
  fontsize: number;
};

const TermsModal: React.FC<TermsModalProps> = ({
  visible,
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
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>
            {t('settingpage.termsPolicy')}
          </Text>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalBody}>
            
              By using this application, you agree to our Terms of Use and Privacy Policy. In order to provide you with personalized transit updates, route planning, and a secure login experience, this app requires access to your location data, as well as your email address and password.{"\n\n"}
              <Text style={styles.modalSubHeader}>Location Data:</Text>{"\n"}
              Your location is used solely to calculate transit routes and provide real-time public transport updates near you. This information is processed on your device or our secure servers and is not shared with third parties without your explicit consent.{"\n\n"}
              <Text style={styles.modalSubHeader}>Email and Password:</Text>{"\n"}
              Your email address is used to create and manage your account and to communicate important service updates. Your password is securely stored using encryption to protect your privacy and ensure account security.{"\n\n"}
              <Text style={styles.modalSubHeader}>Data Security and Privacy:</Text>{"\n"}
              We take your privacy seriously. We do not sell or disclose your personal information to any third parties. All data is handled according to our privacy guidelines and applicable laws. You have the right to request deletion or modification of your data by contacting our support team.{"\n\n"}
              By proceeding, you acknowledge that you have read, understood, and agreed to these terms. If you do not agree with any part of these policies, please do not use this application.
            </Text>
          </ScrollView>
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseButtonText}>
              {t('settingpage.closeButton')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TermsModal;
