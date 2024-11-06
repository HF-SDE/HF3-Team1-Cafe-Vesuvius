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

interface ModalScreenProps {
  onClose: () => void;
}

export default function ModalScreen({ onClose }: ModalScreenProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");

  const handleReset = () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    alert("Password reset successfully!");
    onClose();
  };

  return (
    <View style={[styles.container, { backgroundColor: BackgroundColor }]}>
      <Text style={[styles.title, { color: TextColor }]}>Reset Password</Text>

      <TextInput
        style={[styles.input, { borderColor: PrimaryColor }]}
        placeholder="Old Password"
        placeholderTextColor={TextColor}
        secureTextEntry
        value={oldPassword}
        onChangeText={setOldPassword}
      />
      <TextInput
        style={[styles.input, { borderColor: PrimaryColor }]}
        placeholder="New Password"
        placeholderTextColor={TextColor}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={[styles.input, { borderColor: PrimaryColor }]}
        placeholder="Confirm New Password"
        placeholderTextColor={TextColor}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.resetButton, { backgroundColor: PrimaryColor }]}
          onPress={handleReset}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.cancelButton, { backgroundColor: "#ccc" }]}
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
});
