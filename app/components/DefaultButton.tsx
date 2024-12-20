import React from "react";
import { TouchableOpacity, Text, StyleSheet, ColorValue } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  triggerHapticFeedback,
  ImpactFeedbackStyle,
} from "@/utils/hapticFeedback";

interface ButtonProps {
  onPress?: () => void;
  title: string;
  disabled?: boolean | undefined;
  backgroundColor?: ColorValue | undefined;
  textColor?: ColorValue | undefined;
  isHighlighted?: boolean;
  noMargin?: boolean; // New prop to control margin
}

const SubmitButton: React.FC<ButtonProps> = ({
  onPress,
  title,
  disabled,
  backgroundColor,
  textColor,
  isHighlighted,
  noMargin, // Destructure the new prop
}) => {
  const theme = useThemeColor();
  const handlePress = async () => {
    // Trigger haptic feedback
    await triggerHapticFeedback(ImpactFeedbackStyle.Light);

    // Call the passed `onPress` function if defined
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: backgroundColor || theme.primary },
        {
          borderWidth: isHighlighted ? 3 : 0,
          borderColor: isHighlighted ? "red" : undefined,
        },
        noMargin ? { margin: 0 } : {}, // Conditionally apply margin
      ]}
      onPress={handlePress}
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
    margin: 5, // Default margin
    maxHeight: 50,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default SubmitButton;
