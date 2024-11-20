import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface PasswordInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isInvalid?: boolean;
  onSubmitEditing?: () => void;
  inputStyle?: object;
  iconStyle?: object;
  placeholderTextColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  iconColor?: string;
}

export default function PasswordInput({
  value,
  onChangeText,
  placeholder = "Password",
  isInvalid = false,
  onSubmitEditing,
  inputStyle = {},
  iconStyle = {},
  placeholderTextColor = "gray",
  backgroundColor = "white",
  borderColor = "gray",
  textColor = "black",
  iconColor = "gray",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.inputBlock}>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: isInvalid ? "red" : borderColor,
            color: textColor,
            backgroundColor: backgroundColor,
            paddingRight: 45,
          },
          inputStyle,
        ]}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        autoCorrect={false}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
      />
      <TouchableOpacity
        onPress={() => setShowPassword((prev) => !prev)}
        style={[styles.iconContainer, iconStyle]}
      >
        <MaterialCommunityIcons
          name={showPassword ? "eye-off" : "eye"}
          size={24}
          style={{ color: iconColor }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputBlock: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    width: "100%",
  },
  input: {
    height: 50,
    width: "100%",
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  iconContainer: {
    padding: 5,
    position: "absolute",
    right: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
