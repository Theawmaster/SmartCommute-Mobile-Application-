import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Layout from '../components/Layout';
import Bushomelayout from '../components/Bushomelayout';
import Taxihomelayout from '../components/Taxihomelayout';
import Trainhomelayout from '../components/Trainhomelayout';
import { useTheme } from '../components/ThemeContext';
import { useTranslation } from 'react-i18next';
import styles from '../styling/Homepage.styles';

const TransportTabs = () => {
  const [selected, setSelected] = useState('bus');
  const { color, isDarkMode } = useTheme();
  const { t } = useTranslation();
  const componentStyles = styles(isDarkMode, color);

  const transportOptions = ['taxi', 'bus', 'mrt'];
  const renderLayout = () => {
    switch (selected) {
      case 'taxi': return <Taxihomelayout />;
      case 'bus': return <Bushomelayout />;
      case 'mrt': return <Trainhomelayout />;
      default: return null;
    }
  };

  return (
    <Layout>
      <View style={componentStyles.container}>
        {transportOptions.map((transport) => (
          <TouchableOpacity
            key={transport}
            style={componentStyles.optionContainer}
            onPress={() => setSelected(transport)}
          >
            <Ionicons
              name={
                transport === 'taxi' ? 'car-outline' :
                transport === 'bus' ? 'bus-outline' : 'subway-outline'
              }
              size={25}
              color={selected === transport ? color : 'gray'}
            />
            <Text style={[
              componentStyles.text,
              selected === transport && componentStyles.selectedText
            ]}>
              {t(`transport.${transport}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {renderLayout()}
    </Layout>
  );
};

export default TransportTabs;