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
//import apiClient from "../../../utils/apiClient"; // Import your API client
import { useUserProfile } from "@/hooks/useUserProfile"; // Import the hook
import PasswordInput from "../../../components/PasswordInput";

import { Buffer } from "buffer";

interface ModalScreenProps {
  onClose: () => void;
}

export default function ResetPasswordModal({ onClose }: ModalScreenProps) {
  const { resetPassword } = useUserProfile(); // Use the hook

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");
  const AccentColor = useThemeColor({}, "accent");

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
      console.log(oldPassword + newPassword);

      const response = await resetPassword(oldPassword, newPassword);
      if (response === "success") {
        onClose(); // Close the modal on success
      } else {
        setErrorMessage(response || "An error occurred.");
      }
    } catch (error) {
      console.error(error);

      setErrorMessage("An error occurred while resetting password.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: BackgroundColor }]}>
      <Text style={[styles.title, { color: TextColor }]}>Reset Password</Text>

      <PasswordInput
        value={oldPassword}
        onChangeText={setOldPassword}
        //isInvalid={isPasswordEmpty}
        //onSubmitEditing={handleLogin}
        backgroundColor={BackgroundColor}
        borderColor={PrimaryColor}
        textColor={PrimaryColor}
        iconColor={SecondaryColor}
        placeholder="Old Password"
      />
      <PasswordInput
        value={newPassword}
        onChangeText={setNewPassword}
        //isInvalid={isPasswordEmpty}
        //onSubmitEditing={handleLogin}
        backgroundColor={BackgroundColor}
        borderColor={PrimaryColor}
        textColor={PrimaryColor}
        iconColor={SecondaryColor}
        placeholder="New Password"
      />
      <PasswordInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        //isInvalid={isPasswordEmpty}
        //onSubmitEditing={handleLogin}
        backgroundColor={BackgroundColor}
        borderColor={PrimaryColor}
        textColor={PrimaryColor}
        iconColor={SecondaryColor}
        placeholder="Confirm New Password"
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
          style={[styles.cancelButton, { backgroundColor: AccentColor }]}
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
