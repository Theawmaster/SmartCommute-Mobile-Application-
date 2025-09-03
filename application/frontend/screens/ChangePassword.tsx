import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useTheme } from "../components/ThemeContext";
import Layout from "../components/Layout";
import { RootStackParamList } from "../App";
import { isAndroidStudio } from "../components/locationService";
import { ServerIP, ServerPort } from '../components/ServerIP';
import { useTranslation } from 'react-i18next';
import Icon from "react-native-vector-icons/Ionicons";

type ChangePasswordRouteProp = RouteProp<RootStackParamList, "ChangePassword">;

const ChangePassword: React.FC = () => {
  const { isDarkMode, color } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<ChangePasswordRouteProp>();
  const { t } = useTranslation();
  const { verificationType, email } = route.params || {};

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (verificationType !== "F") {
      const checkToken = async () => {
        const localToken = await AsyncStorage.getItem("authToken");
        setToken(localToken);
      };
      checkToken();
    }
  }, [verificationType]);

  const baseURL = isAndroidStudio
    ? `http://10.0.2.2:${ServerPort}`
    : `${ServerIP}:${ServerPort}`;

  const handleChangePassword = async () => {
    if (verificationType !== "F" && !token) {
      Alert.alert(t('ChangePassword.Alerts.RestrictedAccess'));
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(t('ChangePassword.Alerts.PasswordNotMatch'));
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      Alert.alert(t('ChangePassword.Alerts.PasswordRequirement'));
      return;
    }

    try {
      let url = "";
      let body: any = {};

      if (verificationType === "F") {
        url = `${baseURL}/api/password/changeForgotPassword`;
        body.email = email;
        body.newPassword = newPassword;
      } else {
        url = `${baseURL}/api/password/changepassword`;
        body.oldPassword = oldPassword;
        body.newPassword = newPassword;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(verificationType !== "F" && token
            ? { Authorization: `Bearer ${token}` }
            : {}),
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(t(`ChangePassword.BackendMessages.ChangePassword${response.status}`) || "Password changed successfully.");
        navigation.navigate("Profile");
      } else {
        Alert.alert(t(`ChangePassword.BackendMessages.ChangePassword${response.status}`) || "Failed to change password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      Alert.alert(t('ChangePassword.Alerts.ErrorChangingPassword'));
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      padding: 0,
      backgroundColor: isDarkMode ? "#333" : "#fff",
    },
    header: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      color: isDarkMode ? "#fff" : "#000",
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      width: "80%",
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      paddingHorizontal: 10,
      marginVertical: 5,
      backgroundColor: isDarkMode ? "#555" : "#fff",
    },
    inputField: {
      flex: 1,
      paddingVertical: 10,
      color: isDarkMode ? "#fff" : "#000",
    },
    button: {
      backgroundColor: color,
      padding: 10,
      marginVertical: 10,
      borderRadius: 20,
      width: "80%",
      alignItems: "center",
    },
    buttonText: {
      color: "white",
      textAlign: "center",
      fontSize: 16,
    },
    backButton: {
      marginBottom: 20,
      padding: 10,
      backgroundColor: color,
      borderRadius: 10,
      alignSelf: "flex-start",
    },
    backButtonText: {
      color: "#fff",
      fontSize: 16,
    },
  });

  return (
    <Layout>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{t('ChangePassword.Back')}</Text>
        </TouchableOpacity>

        <Text style={styles.header}>{t('ChangePassword.ChangePassword')}</Text>

        {/* Old password */}
        {verificationType !== "F" && (
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.inputField}
              placeholder={t('ChangePassword.OldPassword')}
              placeholderTextColor={isDarkMode ? "#ccc" : "#999"}
              secureTextEntry={!showOldPassword}
              value={oldPassword}
              onChangeText={setOldPassword}
            />
            <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)}>
              <Icon name={showOldPassword ? "eye-off" : "eye"} size={20} color={isDarkMode ? "#ccc" : "#333"} />
            </TouchableOpacity>
          </View>
        )}

        {/* New password */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.inputField}
            placeholder={t('ChangePassword.NewPassword')}
            placeholderTextColor={isDarkMode ? "#ccc" : "#999"}
            secureTextEntry={!showNewPassword}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
            <Icon name={showNewPassword ? "eye-off" : "eye"} size={20} color={isDarkMode ? "#ccc" : "#333"} />
          </TouchableOpacity>
        </View>

        {/* Confirm password */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.inputField}
            placeholder={t('ChangePassword.ConfirmNewPassword')}
            placeholderTextColor={isDarkMode ? "#ccc" : "#999"}
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Icon name={showConfirmPassword ? "eye-off" : "eye"} size={20} color={isDarkMode ? "#ccc" : "#333"} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>
            {verificationType === "F"
              ? t('ChangePassword.ResetPassword')
              : t('ChangePassword.UpdatePassword')}
          </Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
};

export default ChangePassword;
