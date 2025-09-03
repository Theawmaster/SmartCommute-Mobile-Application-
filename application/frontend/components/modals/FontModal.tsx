import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import createStyles from '../../styling/Settingpage.styles';

type FontModalProps = {
  visible: boolean;
  selectedFontSize: number;
  onSelectFontSize: (size: number) => void;
  onClose: () => void;
  isDarkMode: boolean;
  color: string;
  fontsize: number;
};

const FontModal: React.FC<FontModalProps> = ({
  visible,
  selectedFontSize,
  onSelectFontSize,
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
      <View style={styles.sectionContainer}>
        <View style={styles.fontmodalContainer}>
          <Text style={styles.fontmodalHeader}>
            {t('settingpage.fontModalTitle')}
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✖</Text>
          </TouchableOpacity>
          <ScrollView contentContainerStyle={{ flexDirection: 'column', alignItems: 'center', gap: 15, marginTop: 60 }}>
            {[14, 16, 18].map((size) => (
              <TouchableOpacity
                key={size}
                style={{
                  backgroundColor: selectedFontSize === size ? color : 'white',
                  paddingVertical: 24,
                  borderRadius: 20,
                  width: 330,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '25%',
                  borderWidth: 1,
                  borderColor: 'black',
                }}
                onPress={() => onSelectFontSize(size)}
              >
                <Text style={{ fontSize: size, color: 'black' }}>
                  {t('settingpage.fontLabel')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default FontModal;
