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

import { SafeAreaView } from "react-native-safe-area-context";

interface ModalScreenProps {
  onClose: () => void;
}

export default function ResetPasswordModal({ onClose }: ModalScreenProps) {
  const { resetPassword } = useUserProfile();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");
  const AccentColor = useThemeColor({}, "accent");

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      setErrorMessage("Please fill out all fields!");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords does not match!");
      return;
    }

    try {
      // const response = await resetPassword(oldPassword, newPassword);
      // if (response === "success") {
      //   onClose();
      // } else {
      //   setErrorMessage(response || "An error occurred.");
      // }
    } catch (error) {
      console.error(error);

      setErrorMessage("An error occurred while resetting password.");
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: BackgroundColor }]}
    >
      <Text style={[styles.title, { color: TextColor }]}>Reset Password</Text>

      <PasswordInput
        value={newPassword}
        onChangeText={setNewPassword}
        iconColor={SecondaryColor}
        placeholder="New Password"
      />
      <PasswordInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        iconColor={SecondaryColor}
        placeholder="Confirm New Password"
      />

      {errorMessage ? (
        <Text style={[styles.errorText, { color: "red" }]}>{errorMessage}</Text>
      ) : null}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.cancelButton, { backgroundColor: AccentColor }]}
          onPress={onClose}
        >
          <Text style={[styles.buttonText, { color: TextColor }]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.resetButton, { backgroundColor: PrimaryColor }]}
          onPress={handleReset}
        >
          <Text style={[styles.buttonText, { color: BackgroundColor }]}>
            Reset
          </Text>
        </TouchableOpacity>
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
    marginTop: 20,
    gap: 10,
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
