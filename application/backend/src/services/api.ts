import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${process.env.API_URL}/login`, { email, password });

    if (response.data.token) {
      await AsyncStorage.setItem("authToken", response.data.token); // Store token
    }

    return response.data;
  } catch (error: any) {
    return error.response?.data || { message: "Network error" };
  }
};

// Retrieve the stored token
export const getAuthToken = async () => {
  return await AsyncStorage.getItem("authToken");
};

// Logout function - Remove token
export const logoutUser = async () => {
  await AsyncStorage.removeItem("authToken");
};