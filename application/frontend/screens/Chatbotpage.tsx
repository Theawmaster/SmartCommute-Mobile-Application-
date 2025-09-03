import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { useTheme } from "../components/ThemeContext";
import Layout from "../components/Layout";
import { Ionicons } from "@expo/vector-icons"; // For icons
import { DEFAULT_COORDINATES, isAndroidStudio } from "../components/locationService";
import { ServerIP, ServerPort } from "../components/ServerIP";
import AsyncStorage from '@react-native-async-storage/async-storage';
import faresData from "../data/fares.json";
import timingsData from "../data/publicTransportTimings.json";
import { useTranslation } from 'react-i18next';
type LandingPageProps = {
  navigation: NavigationProp<any>;
};

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
};

// Helper function to handle external links
const handleOpenLink = (url: string) => {
  Alert.alert(
    "External Link",
    "You are about to leave the app and open an external website. Do you want to continue?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Continue",
        onPress: () => Linking.openURL(url),
      },
    ]
  );
};

// Helper function to handle phone calls
const handleCall = (phoneNumber: string) => {
  Alert.alert(
    "Making a Call",
    `You are about to call ${phoneNumber}. Do you want to continue?`,
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Continue",
        onPress: () => Linking.openURL(`tel:${phoneNumber}`),
      },
    ]
  );
};

const Chatbotpage: React.FC<LandingPageProps> = ({ navigation }) => {
  const [trainmessage, setTrainMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { color, fontsize } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text:
        "Hello and welcome to SmartCommute Bot!\n\n" +
        "I can assist you with:\n" +
        "• Finding nearby bus interchanges, taxi stands, and their operating hours\n" +
        "• Checking MRT crowd levels and train schedules\n" +
        "• Providing detailed fare information for bus, MRT, and taxi journeys (including late night surcharges, e.g. 50% extra at 3am)\n" +
        "• Offering route suggestions complete with estimated travel times and costs\n\n" +
        "For example, you can ask:\n" +
        "• 'Midnight taxi surcharges'\n" +
        "• 'MRT station operating hours'\n" +
        "• 'How to get from NTU to Ikea Tampines' (including travel time, cost, and interchange details)\n\n" +
        "How can I help you plan your journey today?",
      sender: "bot",
    },
  ]);
  const fetchUserDetails = async () => {
    const localToken = await AsyncStorage.getItem("authToken");
    console.log(localToken);
  }
  fetchUserDetails();
  const [input, setInput] = useState("");

  const styles = StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#00A9A5",
      padding: 15,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "white",
    },
    chatContainer: {
      flex: 1,
      padding: 10,
    },
    messageContainer: {
      padding: 10,
      borderRadius: 10,
      marginVertical: 5,
      maxWidth: "75%",
    },
    userMessage: {
      alignSelf: "flex-end",
      backgroundColor: "#00A9A5",
    },
    botMessage: {
      alignSelf: "flex-start",
      backgroundColor: "#EAEAEA",
    },
    messageText: {
      fontSize: fontsize,
    },
    userText: {
      color: "white",
    },
    botText: {
      color: "black",
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      borderTopWidth: 1,
      borderColor: "#ccc",
      backgroundColor: "white",
    },
    input: {
      flex: 1,
      padding: 10,
      borderRadius: 25,
      backgroundColor: "#F0F0F0",
      fontSize: fontsize,
      // For multiline support:
      minHeight: 40,
      maxHeight: 120,
      textAlignVertical: "top",
    },
    sendButton: {
      backgroundColor: "#00A9A5",
      padding: 10,
      marginLeft: 10,
      borderRadius: 25,
    },
    bottomNav: {
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 15,
      borderTopWidth: 1,
      borderColor: "#ccc",
      backgroundColor: "white",
    },
  });

  const sendMessage = async () => {
    if (!input.trim()) return;
  
    // Append user's message.
    const userMessage: Message = {
      id: Math.random().toString(),
      text: input,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput("");
  
    try {
      let reply = "";
      const lowerInput = userInput.toLowerCase();
  
      // Navigation trigger example: if user asks for "fare calculator"
      if (lowerInput.includes("fare calculator")) {
        reply = "Opening Fare Calculator...";
        navigation.navigate("FareRouteMap");
      }
      // Check for "midnight surcharge" (i.e. peak period fares)
      else if (lowerInput.includes("midnight surcharge")) {
        const peakFare = faresData.taxiFareTable.find(
          (item) =>
            (item.taxiFareType === "Peak Periods" &&
            item.farePeriod?.toLowerCase().includes("late night")) ?? false
        );
        if (peakFare) {
          reply = `Peak Period Fare (Late Night Hiring): ${peakFare.meteredFare}`;
        } else {
          reply = "Sorry, I couldn't find the fare information for midnight surcharges.";
        }
      }
      // If the user asks for nearby bus stops or interchanges.
      else if (
        lowerInput.includes("nearest bus interchange") ||
        lowerInput.includes("nearby bus stops")
      ) {
        const currentCoordinates = { latitude: 1.3521, longitude: 103.8198 }; // Default to Singapore coordinates
        const busApiUrl = currentCoordinates
          ? `${ServerIP}:${ServerPort}/api/bus/nearby-bus-stops?lat=${currentCoordinates.latitude}&lon=${currentCoordinates.longitude}`
          : `${ServerIP}:${ServerPort}/api/bus/nearby-bus-stops?lat=${DEFAULT_COORDINATES.latitude}&lon=${DEFAULT_COORDINATES.longitude}`;
        
        const busResponse = await fetch(busApiUrl);
        const busData = await busResponse.json();
        if (busResponse.ok && busData.length > 0) {
          reply = "Nearby Bus Interchanges:\n";
          busData.slice(0, 3).forEach((stop: any) => {
            reply += `• ${stop.name} (${stop.distance}m away)\n`;
          });
        } else {
          reply = "Sorry, I couldn't retrieve nearby bus stops at this time.";
        }
      }
      // If the user asks about MRT crowd levels.
      else if (
        lowerInput.includes("mrt crowd") ||
        lowerInput.includes("mrt crowd level")
      ) {
        const currentCoordinates = { latitude: 1.3521, longitude: 103.8198 }; // Default to Singapore coordinates
        const trainApiUrl = `${ServerIP}:${ServerPort}/api/train/nearby-train-crowd?lat=${currentCoordinates.latitude}&lon=${currentCoordinates.longitude}&radius=3`;
        const trainResponse = await fetch(trainApiUrl);
        const trainData = await trainResponse.json();
        if (trainResponse.ok && trainData.length > 0) {
          reply = "Nearby MRT Stations Crowd Levels:\n";
          trainData.slice(0, 3).forEach((station: any) => {
            reply += `• ${station.name}: ${station.crowdLevel}\n`;
          });
        } else {
          reply = "Sorry, I couldn't fetch the MRT crowd levels at this time.";
        }
      }
      // Fallback: use refined prompt to query the chatbot API.
      else {
        const refinedPrompt = `
You are SmartCommute Bot, a helpful and accurate assistant for Singapore public transportation queries.

When a user asks for directions, please provide a detailed response that includes:
- Estimated travel time for bus, MRT, and taxi options.
- Cost estimates including any applicable surcharges (e.g., for taxi journeys at 3am, include a 50% surcharge).
- Operating hours for relevant bus interchanges and MRT lines.
- Simple, clear, concise, step-by-step instructions with any needed transfers.
- Ensure spacing between sections for readability.

For example, to travel from [Origin] to [Destination] in Singapore:

Option 1: Bus and MRT Combination
• Bus from **[Origin]: Walk to the nearest bus stop and board the appropriate bus.
• MRT from the transfer point to the destination MRT station.
• Bus or a short walk to the final destination.
Estimated travel time: Approximately 60 to 75 minutes.
Fare: Approximately S$1.50 to S$2.50.
Operating Hours: Bus services run from about 5:30 AM to 12:30 AM; MRT services from 5:30 AM to midnight.

Option 2: Direct Taxi Option
• For taxi journeys, note that if traveling at late night hours (e.g., 3am), a 50% surcharge is applied.
Estimated travel time: Typically 20 to 40 minutes (depending on traffic).
Fare: Base fare plus applicable surcharges.
Operating Hours: Taxis operate 24/7.

If timings are required, include this short recommendation:
Recommendation:
- For train arrival timings, please check the SMRT website, SBS Transit Website, or LTA Website.
- For bus arrival timings, please return to the Home Page, as schedules are retrieved based on your current location.

For Bus services timings, provide the following:
• Feeder bus services usually run from 05:30 AM to 12:30 AM.
• Normal Bus services usually run from 05:30 AM to 11:30 AM.

Able to communicate in chinese, malay and tamil if required

If the user ask in their specific language, please respond in that language all the way til the user change its choice of language.

Do not change language until the user has specified to do so.

Try to keep the memory of the user, and remember their previous queries.

Now, please answer the following query in the above style, keeping the response short and clear, and avoiding double asterisks.

User Query: ${userInput}
        `;
        const response = await fetch(
          isAndroidStudio
            ? `http://10.0.2.2:${ServerPort}/api/chatbot/chat`
            : `${ServerIP}:${ServerPort}/api/chatbot/chat`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: refinedPrompt }),
          }
        );
        const result = await response.json();
        if (response.ok) {
          reply = result.message;
        } else {
          Alert.alert("Query Failed", result.message || "Unknown error");
        }
      }
  
      // Append bot's reply.
      const botMessage: Message = {
        id: Math.random().toString(),
        text: reply,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      Alert.alert("Error", "Network error. Please try again later.");
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageContainer, item.sender === "user" ? styles.userMessage : styles.botMessage]}>
      <Text style={[styles.messageText, item.sender === "user" ? styles.userText : styles.botText]}>
        {item.text}
      </Text>
      {/* Example of embedding clickable links in a bot message */}
      {item.sender === "bot" && item.text.includes("SMRT website") && (
        <View style={{ marginTop: 5 }}>
        <TouchableOpacity 
          style={{ marginVertical: 10 }} 
          onPress={() => handleOpenLink("https://www.smrt.com.sg")}
        >
          <Text style={{ color: "blue" }}>SMRT Website</Text>
        </TouchableOpacity>
      
        <TouchableOpacity 
          style={{ marginVertical: 10 }} 
          onPress={() => handleCall("18003368900")}
        >
          <Text style={{ color: "blue" }}>Call SMRT Hotline (1800-336-8900)</Text>
        </TouchableOpacity>
      
        <TouchableOpacity 
          style={{ marginVertical: 10 }} 
          onPress={() => handleOpenLink("https://www.sbstransit.com.sg")}
        >
          <Text style={{ color: "blue" }}>SBS Transit Website</Text>
        </TouchableOpacity>
      
        <TouchableOpacity 
          style={{ marginVertical: 10 }} 
          onPress={() => handleCall("18002872727")}
        >
          <Text style={{ color: "blue" }}>Call SBS Transit Hotline (1800-287-2727)</Text>
        </TouchableOpacity>
      
        <TouchableOpacity 
          style={{ marginVertical: 10 }} 
          onPress={() => handleOpenLink("https://www.lta.gov.sg/content/ltagov/en.html")}
        >
          <Text style={{ color: "blue" }}>LTA Website</Text>
        </TouchableOpacity>
      </View>
      )}
    </View>
  );

  return (
    <Layout>
      <View style={{ height: "100%", display: "flex" }}>
        <FlatList data={messages} renderItem={renderMessage} keyExtractor={(item) => item.id} style={styles.chatContainer} />
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={Platform.OS === "ios" ? 139 : 0}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Tap to type message..."
              value={input}
              onChangeText={setInput}
              editable={!loading}
              multiline={true}
              scrollEnabled={true}
            />
            {loading ? (
              <ActivityIndicator size="small" color="#00A9A5" style={{ marginLeft: 10 }} />
            ) : (
              <TouchableOpacity onPress={sendMessage} style={[styles.sendButton, { backgroundColor: color }]}>
                <Ionicons name="arrow-forward" size={24} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Layout>
  );
};

export default Chatbotpage;
