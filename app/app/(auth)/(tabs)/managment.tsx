import React from "react";
import { Text, Button, StyleSheet, View } from "react-native";
import TemplateLayout from "@/components/TemplateLayout";
import axiosClient from "../../../api/apiClient"; // Adjust the path as necessary
import { useThemeColor } from "@/hooks/useThemeColor";

export default function ManagmentScreen() {
  const PrimaryColor = useThemeColor({}, "primary");

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
    <TemplateLayout pageName="ManagmentPage">
      <View style={styles.content}>
        <Text style={styles.text}>Welcome to the Management Screen!</Text>
        <Button
          title="Call API"
          color={PrimaryColor} // Themed color for the button
          onPress={handleApiCall}
        />
      </View>
    </TemplateLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginBottom: 20,
    fontSize: 16,
    fontWeight: "500",
  },
});
