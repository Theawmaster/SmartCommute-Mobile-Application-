import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, ScrollView, Modal, Alert, Image } from 'react-native';
import Layout from '../components/Layout';
import ImageViewer from 'react-native-image-zoom-viewer';
import { useTheme } from '../components/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import staticStyles from '../styling/FarepageStyles';
import createDynamicStyles from '../styling/farePageDynamicStyles';
import { useTranslation } from 'react-i18next';

// Define the RootStackParamList type
type RootStackParamList = {
  Fare: undefined;
  FareRouteMap: undefined;
};

// Define allowed transport types
type TransportType = 'Taxi' | 'Bus' | 'MRT' | 'Fare Calculator';

const TransportFarePage = () => {
  const [selectedTransport, setSelectedTransport] = useState<TransportType>('Taxi');
  const [showFareOptions, setShowFareOptions] = useState(false);
  const [selectedFareType, setSelectedFareType] = useState<string | null>(null);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Get the current theme from context
  const { isDarkMode, color, fontsize } = useTheme();
  const dynamicStyles = createDynamicStyles({ isDarkMode, color, fontsize });

  // Translation
  const { t } = useTranslation();

  const taxiFareTypes = [
    t('farepage.fareTypes.taxi.flagDown'),
    t('farepage.fareTypes.taxi.distanceTime'),
    t('farepage.fareTypes.taxi.peakPeriods'),
    t('farepage.fareTypes.taxi.locationSurcharges'),
    t('farepage.fareTypes.taxi.bookingFees')
  ];

  const busFareTypes = [
    t('farepage.fareTypes.bus.adultCard'),
    t('farepage.fareTypes.bus.workfare'),
    t('farepage.fareTypes.bus.studentCard'),
    t('farepage.fareTypes.bus.seniorDisabled'),
    t('farepage.fareTypes.bus.fareTable')
  ];

  const mrtFareTypes = [
    t('farepage.fareTypes.mrt.adultCard'),
    t('farepage.fareTypes.mrt.workfare'),
    t('farepage.fareTypes.mrt.studentCard'),
    t('farepage.fareTypes.mrt.seniorDisabled')
  ];

  const handleFareTypeSelection = (fare: string) => {
    setSelectedFareType(fare);
    setShowFareOptions(false);
  };

  const taxiFareTable = [
    { taxiFareType: 'Flag-Down Fare', taxiType: t('farepage.tables.Standard'), fare: '$4.40 - $4.80' },
    { taxiFareType: 'Flag-Down Fare', taxiType: t('farepage.tables.Premium'), fare: '$4.80 - $5.50' },
    { taxiFareType: 'Distance & Time-based Unit Fares', taxiType: t('farepage.tables.Standard'), distanceFare: '26 cents/400m (1-10km)\n\n26 cents/350m(>10km)', timeFare: '26 cents/45 sec wait time' },
    { taxiFareType: 'Distance & Time-based Unit Fares', taxiType: t('farepage.tables.Premium'), distanceFare: '36-38 cents/400m (1-10km)\n\n36-38 cents/350m(>10km)', timeFare: '36-38 cents/45 sec wait time' },
    { taxiFareType: 'Booking Fees', taxiOperator: 'CDG Taxi', taxiWebsite: 'www.cdgtaxi.com.sg' },
    { taxiFareType: 'Booking Fees', taxiOperator: 'Prime Taxi', taxiWebsite: 'www.primetaxi.sg' },
    { taxiFareType: 'Booking Fees', taxiOperator: 'Strides Premier Taxi', taxiWebsite: 'www.stridespremier.com.sg' },
    { taxiFareType: 'Booking Fees', taxiOperator: 'Trans-cab', taxiWebsite: 'www.transcab.com.sg' },
    { taxiFareType: 'Peak Periods', farePeriod:
      t('farepage.fareTypes.taxi.peakPeriod'),
      meteredFare: '25% of metered fare' },
    { taxiFareType: 'Peak Periods', farePeriod:
      t('farepage.fareTypes.taxi.lateNight'),
      meteredFare: '50% of metered fare' },
    { taxiFareType: 'Location Surcharges', taxiLocation: 'City Area\n\nFrom 5pm to before midnight on any day', taxiBookingFees: "$3.00" },
    { taxiFareType: 'Location Surcharges', taxiLocation: 'Changi Airport\n\nFrom 5pm to before midnight on any day\n\nAll other times', taxiBookingFees: "\n\n$8.00\n\n\n$6.00" },
    { taxiFareType: 'Location Surcharges', taxiLocation: 'Fuji Xerox Towers\nMonday to Fridays, excluding public holidays',
      taxiBookingFees: "Prevailing charges at the ERP gantry located at the junction of Anson Road and Keppel Road" },
    { taxiFareType: 'Location Surcharges', taxiLocation: 'Gardens by the Bay\n\nAny time on any day', taxiBookingFees: "$3.00" },
    { taxiFareType: 'Location Surcharges', taxiLocation: 'Mandai Wildlife Reserve (Night Safari, River Wonders, Singapore Zoo)\n\nFrom 1pm to before midnight\n\nBird Paradise\n\nFrom 1pm to before midnight on any day',
      taxiBookingFees: "$5.00" }
  ];

  const busFareTable = [
    {
      fareType: t('farepage.fareTypes.bus.adultCard'),
      fares: [
        { distance: '0.0 - 3.2 km', basicService: '$1.19', expressService: '$1.79 - $3.20' },
        { distance: '3.3 - 4.2 km', basicService: '$1.29', expressService: '$1.89 - $4.20' },
        { distance: '4.3 - 5.2 km', basicService: '$1.40', expressService: '$2.00 - $5.20' },
        { distance: '5.3 - 6.2 km', basicService: '$1.50', expressService: '$2.10 - $6.20' },
        { distance: '6.3 - 7.2 km', basicService: '$1.59', expressService: '$2.19 - $7.20' },
        { distance: '> 40.2 km', basicService: '$2.47', expressService: '$3.07' },
      ],
    },
    {
      fareType: t('farepage.fareTypes.bus.workfare'),
      fares: [
        { distance: '0.0 - 3.2 km', basicService: '$0.78', expressService: '$1.28 - $3.20' },
        { distance: '3.3 - 4.2 km', basicService: '$0.86', expressService: '$1.36 - $4.20' },
        { distance: '4.3 - 5.2 km', basicService: '$0.95', expressService: '$1.45 - $5.20' },
        { distance: '> 40.2 km', basicService: '$1.83', expressService: '$2.33' },
      ],
    },
    {
      fareType: t('farepage.fareTypes.bus.seniorDisabled'),
      fares: [
        { distance: '0.0 - 3.2 km', basicService: '$0.69', expressService: '$1.14 - $3.20' },
        { distance: '3.3 - 4.2 km', basicService: '$0.76', expressService: '$1.21 - $4.20' },
        { distance: '> 7.2 km', basicService: '$1.03', expressService: '$1.48' },
      ],
    },
    {
      fareType: t('farepage.fareTypes.bus.studentCard'),
      fares: [
        { distance: '0.0 - 3.2 km', basicService: '$0.52', expressService: '$0.82 - $3.20' },
        { distance: '3.3 - 4.2 km', basicService: '$0.57', expressService: '$0.87 - $4.20' },
        { distance: '> 7.2 km', basicService: '$0.74', expressService: '$1.04' },
      ],
    },
  ];

  // Reuse busFareTable for MRT fares
  const mrtFareTable = busFareTable;

  const handleTransportChange = (type: TransportType) => {
    setSelectedTransport(type);
    setSelectedFareType(null);
    setShowFareOptions(false);
  };

  const openFareCalculator = () => {
    Alert.alert(
      t('farepage.alert.External'),
      t('farepage.alert.message'),
      [
        { text: t('farepage.alert.cancel'), style: "cancel" },
        { text: t('farepage.alert.continue'), onPress: () => Linking.openURL('https://www.lta.gov.sg/content/ltagov/en/map/fare-calculator.html') }
      ]
    );
  };

  return (
    <Layout>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={dynamicStyles.container}>
        <View>
          <View style={staticStyles.transportTabs}>
            {[t('farepage.taxi'), t('farepage.bus'), t('farepage.mrt'), t('farepage.fareCalculator')].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  dynamicStyles.transportTab,
                  selectedTransport === type && [dynamicStyles.activeTab, { borderBottomColor: color }]
                ]}
                onPress={() => handleTransportChange(type as TransportType)}
              >
                <Text style={dynamicStyles.text}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Fare Type Dropdown */}
          {(selectedTransport === t('farepage.taxi') || selectedTransport === t('farepage.bus') || selectedTransport === t('farepage.mrt')) && (
            <>
              <TouchableOpacity
                style={dynamicStyles.dropdownHeader}
                onPress={() => setShowFareOptions(!showFareOptions)}
              >
                <Text style={dynamicStyles.text}>
                  {selectedFareType || t('farepage.chooseFareType')}
                </Text>
              </TouchableOpacity>
              {showFareOptions && (
                <View style={dynamicStyles.fareOptions}>
                  {(selectedTransport === t('farepage.taxi')
                    ? taxiFareTypes
                    : selectedTransport === t('farepage.bus')
                    ? busFareTypes
                    : mrtFareTypes).map((fare, index) => (
                    <TouchableOpacity
                      key={index}
                      style={dynamicStyles.fareOption}
                      onPress={() => handleFareTypeSelection(fare)}
                    >
                      <Text style={dynamicStyles.text}>{fare}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )}

          {selectedTransport === t('farepage.fareCalculator') && (
            <View>
              <TouchableOpacity
                style={[dynamicStyles.externalLink, { backgroundColor: color }]}
                onPress={openFareCalculator}
              >
                <Text style={dynamicStyles.linkText}>{t('farepage.openFareCalculator')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[dynamicStyles.mapButton, { backgroundColor: color }]}
                onPress={() => navigation.navigate('FareRouteMap')}
              >
                <Text style={dynamicStyles.mapButtonText}>{t('farepage.viewNavigationMap')}</Text>
              </TouchableOpacity>
            </View>
          )}

          {selectedTransport === t('farepage.taxi') && selectedFareType === t('farepage.fareTypes.taxi.flagDown') && (
            <View style={dynamicStyles.tableContainer}>
              <View style={dynamicStyles.tableRowHeader}>
                <Text style={dynamicStyles.tableHeaderCell}>{t('farepage.tables.taxiType')}</Text>
                <Text style={[dynamicStyles.tableHeaderCell, staticStyles.lastCell]}>{t('farepage.tables.fare')}</Text>
              </View>
              {taxiFareTable
                .filter((item) => item.taxiFareType === 'Flag-Down Fare')
                .map((item, index) => (
                  <View key={index} style={dynamicStyles.tableRow}>
                    <Text style={dynamicStyles.tableCell}>{item.taxiType}</Text>
                    <Text style={[dynamicStyles.tableCell, staticStyles.lastCell]}>{item.fare}</Text>
                  </View>
                ))}
            </View>
          )}

          {selectedTransport === t('farepage.taxi') && selectedFareType === t('farepage.fareTypes.taxi.distanceTime') && (
            <View style={dynamicStyles.tableContainer}>
              <View style={dynamicStyles.tableRowHeader}>
                <Text style={dynamicStyles.tableHeaderCell}>{t('farepage.tables.taxiType')}</Text>
                <Text style={[dynamicStyles.tableHeaderCell, staticStyles.wideCell]}>
                  {t('farepage.tables.distanceFare')}
                </Text>
                <Text style={[dynamicStyles.tableHeaderCell, staticStyles.lastCell]}>
                {t('farepage.tables.waitFare')}
                </Text>
              </View>
              {taxiFareTable
                .filter((item) => item.taxiFareType === 'Distance & Time-based Unit Fares')
                .map((item, index) => (
                  <View key={index} style={dynamicStyles.tableRow}>
                    <Text style={dynamicStyles.tableCell}>{item.taxiType}</Text>
                    <Text style={[dynamicStyles.tableCell, staticStyles.wideCell]}>
                      {item.distanceFare}
                    </Text>
                    <Text style={[dynamicStyles.tableCell, staticStyles.lastCell]}>
                      {item.timeFare}
                    </Text>
                  </View>
                ))}
            </View>
          )}

          {selectedTransport === t('farepage.taxi') && selectedFareType === t('farepage.fareTypes.taxi.peakPeriods') && (
            <View style={dynamicStyles.tableContainer}>
              {taxiFareTable
                .filter((item) => item.taxiFareType === 'Peak Periods')
                .map((item, index) => (
                  <View key={index} style={dynamicStyles.tableRow}>
                    <Text style={[dynamicStyles.tableCell, staticStyles.wideCell]}>
                      {item.farePeriod}
                    </Text>
                    <Text style={[dynamicStyles.tableCell, staticStyles.lastCell]}>
                      {item.meteredFare}
                    </Text>
                  </View>
                ))}
            </View>
          )}

          {selectedTransport === t('farepage.taxi') && selectedFareType === t('farepage.fareTypes.taxi.locationSurcharges') && (
            <View style={dynamicStyles.tableContainer}>
              {taxiFareTable
                .filter((item) => item.taxiFareType === 'Location Surcharges')
                .map((item, index) => (
                  <View key={index} style={dynamicStyles.tableRow}>
                    <Text style={[dynamicStyles.tableCell, staticStyles.wideCell]}>
                      {item.taxiLocation}
                    </Text>
                    <Text style={[dynamicStyles.tableCell, staticStyles.lastCell]}>
                      {item.taxiBookingFees}
                    </Text>
                  </View>
                ))}
            </View>
          )}

          {selectedTransport === t('farepage.taxi') && selectedFareType === t('farepage.fareTypes.taxi.bookingFees') && (
            <>
              <Text style={dynamicStyles.infoText}>
                {t('farepage.bookingInfo')}
              </Text>
              <View style={dynamicStyles.tableContainer}>
                <View style={dynamicStyles.tableRowHeader}>
                  <Text style={dynamicStyles.tableHeaderCell}>{t('farepage.tables.operator')}</Text>
                  <Text style={dynamicStyles.tableHeaderCell}>{t('farepage.tables.website')}</Text>
                </View>
                {taxiFareTable
                  .filter((item) => item.taxiFareType === 'Booking Fees')
                  .map((item, index) => (
                    <View key={index} style={dynamicStyles.tableRow}>
                      <Text style={dynamicStyles.tableCell}>{item.taxiOperator}</Text>
                      <TouchableOpacity
                        style={[dynamicStyles.tableCell, staticStyles.lastCell]}
                        onPress={() => {
                          Alert.alert(
                            "External Link",
                            "You are about to leave the app and open an external website. Do you want to continue?",
                            [
                              { text: "Cancel", style: "cancel" },
                              { text: "Continue", onPress: () => Linking.openURL(`http://${item.taxiWebsite}`) }
                            ]
                          );
                        }}
                      >
                        <Text style={dynamicStyles.linkColor}>{item.taxiWebsite}</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
              </View>
            </>
          )}

          {busFareTable.map((category, index) => (
            selectedTransport === t('farepage.bus') && selectedFareType === category.fareType && (
              <View key={index} style={dynamicStyles.tableContainer}>
                <View style={dynamicStyles.tableRowHeader}>
                  <Text style={dynamicStyles.tableHeaderCell}>{t('farepage.tables.distance')}</Text>
                  <Text style={dynamicStyles.tableHeaderCell}>{t('farepage.tables.basicService')}</Text>
                  <Text style={dynamicStyles.tableHeaderCell}>{t('farepage.tables.expressService')}</Text>
                </View>
                {category.fares.map((fare, fareIndex) => (
                  <View key={fareIndex} style={dynamicStyles.tableRow}>
                    <Text style={dynamicStyles.tableCell}>{fare.distance}</Text>
                    <Text style={dynamicStyles.tableCell}>{fare.basicService}</Text>
                    <Text style={dynamicStyles.tableCell}>{fare.expressService}</Text>
                  </View>
                ))}
              </View>
            )
          ))}

          {selectedTransport === t('farepage.bus') && selectedFareType === t('farepage.fareTypes.bus.fareTable') && (
            <View style={staticStyles.imageContainer}>
              <TouchableOpacity onPress={() => setIsImageModalVisible(true)}>
                <Image
                  source={require('../assets/busFareTable.png')}
                  style={staticStyles.image}
                  resizeMode="contain"
                />
                <Text style={dynamicStyles.tapToZoomText}>{t('farepage.tables.tapToZoom')}</Text>
              </TouchableOpacity>
              <Modal visible={isImageModalVisible} transparent={true}>
                <View style={dynamicStyles.modalContainer}>
                  <ImageViewer
                    imageUrls={[{
                      url: '',
                      props: { source: require('../assets/busFareTable.png') }
                    }]}
                    enableSwipeDown={true}
                    onSwipeDown={() => setIsImageModalVisible(false)}
                    onClick={() => setIsImageModalVisible(false)}
                  />
                  <TouchableOpacity 
                    style={dynamicStyles.closeButton}
                    onPress={() => setIsImageModalVisible(false)}
                  >
                    <Text style={dynamicStyles.closeButtonText}>{t('farepage.tables.close')}</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
          )}

          {mrtFareTable.map((category, index) => (
            selectedTransport === t('farepage.mrt') && selectedFareType === category.fareType && (
              <React.Fragment key={index}>
                <Text style={dynamicStyles.infoText}>
                  {t('farepage.fareTypes.mrt.discount50cent')}
                </Text>
                <View style={dynamicStyles.tableContainer}>
                  <View style={dynamicStyles.tableRowHeader}>
                    <Text style={dynamicStyles.tableHeaderCell}>{t('farepage.tables.distance')}</Text>
                    <Text style={dynamicStyles.tableHeaderCell}>{t('farepage.tables.basicService')}</Text>
                  </View>
                  {category.fares.map((fare, fareIndex) => (
                    <View key={fareIndex} style={dynamicStyles.tableRow}>
                      <Text style={dynamicStyles.tableCell}>{fare.distance}</Text>
                      <Text style={dynamicStyles.tableCell}>{fare.basicService}</Text>
                    </View>
                  ))}
                </View>
              </React.Fragment>
            )
          ))}
        </View>
      </ScrollView>
    </Layout>
  );
};

export default TransportFarePage;
