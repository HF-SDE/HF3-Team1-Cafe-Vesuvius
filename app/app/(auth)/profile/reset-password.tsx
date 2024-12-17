import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";

import { StatusBar } from "expo-status-bar";

import { useThemeColor } from "@/hooks/useThemeColor";
import { useUserProfile } from "@/hooks/useUserProfile";

import PasswordInput from "@/components/PasswordInput";
import Button from "@/components/DefaultButton";

import { SafeAreaView } from "react-native-safe-area-context";

interface ModalScreenProps {
  onClose: () => void;
}

export default function ResetPasswordModal({ onClose }: ModalScreenProps) {
  const { resetPassword } = useUserProfile();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const theme = useThemeColor();

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
      const response = await resetPassword(oldPassword, newPassword);
      if (response === "success") {
        onClose();
      } else {
        setErrorMessage(response || "An error occurred.");
      }
    } catch (error) {
      console.error(error);

      setErrorMessage("An error occurred while changing password.");
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Text style={[styles.title, { color: theme.text }]}>Change Password</Text>

      <PasswordInput
        value={oldPassword}
        onChangeText={setOldPassword}
        iconColor={theme.secondary}
        placeholder="Old Password"
      />
      <PasswordInput
        value={newPassword}
        onChangeText={setNewPassword}
        iconColor={theme.secondary}
        placeholder="New Password"
      />
      <PasswordInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        iconColor={theme.secondary}
        placeholder="Confirm New Password"
      />

      <Text
        style={[
          styles.errorText,
          {
            color: errorMessage ? "red" : "transparent",
            visibility: errorMessage ? "visible" : "hidden",
          },
        ]}
      >
        {errorMessage || "Error Message"}
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Cancel"
          onPress={onClose}
          backgroundColor={theme.accent}
          textColor={theme.text}
        />
        <Button title={"Change"} onPress={handleReset} />
      </View>

      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 10,
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
  },
  resetButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
  },
  errorText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
  },
});
