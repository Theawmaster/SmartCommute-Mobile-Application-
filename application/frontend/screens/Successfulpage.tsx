import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { NavigationProp } from '@react-navigation/native'; // Import NavigationProp

type LandingPageProps = {
  navigation: NavigationProp<any>; // Explicitly define the navigation prop type
  route: any
};

const SuccessfulPage: React.FC<LandingPageProps> = ({ route, navigation }) => {
    const [isSuccess, setIsSuccess] = useState(true); // Toggle between true/false
    const { isCondition } = route.params;
   
    useEffect(() => {
        
        setTimeout(() => {
            if(isCondition){
                navigation.navigate('LoginPage'); // Replace 'Login' with your actual login screen name
            }
            else{
                navigation.navigate('Home'); // Replace 'Login' with your actual login screen name
            }
            
        }, 1000); // 1 second delay
        
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <View style={styles.card}>
                {isCondition ? (
                    <>
                        <Text style={styles.message}>Hello</Text>
                        <Text style={{ fontSize: 12 }}>You have successfully logged in</Text>
                    </>
                ) : (
                    <>
                        <Text style={styles.message}>YAY</Text>
                        <Text style={{ fontSize: 12 }}>You have successfully registered!</Text>
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    card: {
        backgroundColor: 'white',
        width: "60%",
        height: "14%",
        padding: 25,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    message: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default SuccessfulPage;
