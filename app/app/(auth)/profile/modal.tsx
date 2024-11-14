import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import apiClient from "../../../utils/apiClient"; // Import your API client
import { Buffer } from "buffer";

interface ModalScreenProps {
  onClose: () => void;
}

export default function ModalScreen({ onClose }: ModalScreenProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");

  const handleReset = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMessage("Please fill out all fields!");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords does not match!");
      return;
    }

    try {
      const response = await resetPassword();
      if (response === "success") {
        onClose(); // Close the modal on success
      } else {
        setErrorMessage(response || "An error occurred.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while resetting password.");
    }
  };

  const resetPassword = async (): Promise<string> => {
    const payload = {
      oldPassword: Buffer.from(oldPassword).toString("base64"),
      newPassword: Buffer.from(newPassword).toString("base64"),
    };

    // Replace `/reset-password` with your actual API endpoint
    try {
      //const response = await apiClient.put("/profile/reset", payload);
      const response = await apiClient.put("/profile/reset", payload, {
        validateStatus: (status) => status < 500, // Only throw errors for 500+ status codes
      });
      return response.status === 200 ? "success" : response.data.message;
    } catch {
      return "Something went wrong on our end. Please contact support";
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: BackgroundColor }]}>
      <Text style={[styles.title, { color: TextColor }]}>Reset Password</Text>

      <TextInput
        style={[styles.input, { borderColor: PrimaryColor, color: TextColor }]}
        placeholder="Old Password"
        placeholderTextColor={SecondaryColor}
        secureTextEntry
        value={oldPassword}
        onChangeText={setOldPassword}
      />
      <TextInput
        style={[styles.input, { borderColor: PrimaryColor, color: TextColor }]}
        placeholder="New Password"
        placeholderTextColor={SecondaryColor}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={[styles.input, { borderColor: PrimaryColor, color: TextColor }]}
        placeholder="Confirm New Password"
        placeholderTextColor={SecondaryColor}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {errorMessage ? (
        <Text style={[styles.errorText, { color: "red" }]}>{errorMessage}</Text>
      ) : null}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.resetButton, { backgroundColor: PrimaryColor }]}
          onPress={handleReset}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.cancelButton, { backgroundColor: "#969696" }]}
          onPress={onClose}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  resetButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginRight: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
  },
});
