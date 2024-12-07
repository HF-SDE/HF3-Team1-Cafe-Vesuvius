import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

interface ButtonProps {
  onPress?: () => void;
  title: string;
  disabled?: boolean | undefined;
}

const SubmitButton: React.FC<ButtonProps> = ({ onPress, title, disabled }) => {
  const theme = useThemeColor();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.primary }]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, { color: theme.background }]}>
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
