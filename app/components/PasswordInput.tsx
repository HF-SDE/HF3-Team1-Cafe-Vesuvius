import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
//import { TextInput } from "react-native-paper";
import TextInput from "../components/TextInput";

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
  highlighOutlineColor?: string;
  isHighlighted?: boolean;
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
  highlighOutlineColor = "red",
  isHighlighted = false,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.inputBlock}>
      <TextInput
        label={placeholder}
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        autoCorrect={false}
        value={value}
        onChange={onChangeText}
        onSubmitEditing={onSubmitEditing}
        isHighlighted={isHighlighted}
        highlighOutlineColor={highlighOutlineColor}
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
    verticalAlign: "middle",
  },
  input: {
    height: 50,
    width: "100%",
    borderWidth: 0,
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
    alignSelf: "center",
    marginTop: 5,
  },
});
