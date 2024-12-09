import React from "react";
import { TouchableOpacity, Text, StyleSheet, ColorValue } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

interface ButtonProps {
  onPress?: () => void;
  title: string;
  disabled?: boolean | undefined;
  backgroundColor?: ColorValue | undefined;
  textColor?: ColorValue | undefined;
}

const SubmitButton: React.FC<ButtonProps> = ({
  onPress,
  title,
  disabled,
  backgroundColor,
  textColor,
}) => {
  const theme = useThemeColor();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: backgroundColor || theme.primary },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[styles.buttonText, { color: textColor || theme.background }]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 5,
    margin: 5,
    maxHeight: 50,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default SubmitButton;
