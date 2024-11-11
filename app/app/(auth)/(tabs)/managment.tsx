import React from "react";
import { StyleSheet, SafeAreaView, Text, View, Button } from "react-native";
import axiosClient from "../../../api/apiClient"; // Import your Axios client
import { useThemeColor } from "@/hooks/useThemeColor";

export default function TabTwoScreen() {
  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");
  const AccentColor = useThemeColor({}, "accent");

  // Function to handle the API call
  const handleApiCall = async () => {
    try {
      const response = await axiosClient.get("/stock"); // Replace with your API endpoint
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: BackgroundColor,
          borderColor: BackgroundColor,
          borderWidth: 2,
        },
      ]}
    >
      <Text style={[styles.title, { color: TextColor }]}>Management</Text>
      <View style={styles.separator} />

      <Button
        title="Call API"
        color={PrimaryColor} // You can use your theme color here
        onPress={handleApiCall}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
