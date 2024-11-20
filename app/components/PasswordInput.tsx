import React, { useState } from "react";
import TextIconInput from "./TextIconInput";
import { useThemeColor } from "@/hooks/useThemeColor";

interface PasswordInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isInvalid?: boolean;
  onSubmitEditing?: () => void;
  inputStyle?: object;
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
  iconColor,
  highlighOutlineColor = "red",
  isHighlighted = false,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const SecondaryColor = useThemeColor({}, "secondary");
  const PrimaryColor = useThemeColor({}, "primary");

  return (
    <TextIconInput
      label={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={!showPassword}
      icon={showPassword ? "eye-off" : "eye"}
      iconPosition="right"
      onIconPress={() => setShowPassword((prev) => !prev)}
      style={inputStyle}
      highlighOutlineColor={highlighOutlineColor}
      isHighlighted={isHighlighted}
      onSubmitEditing={onSubmitEditing}
      iconColor={iconColor || SecondaryColor}
    />
  );
}
