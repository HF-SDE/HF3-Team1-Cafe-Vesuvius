import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import CheckPermission from "@/components/CheckPermission";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  triggerHapticFeedback,
  ImpactFeedbackStyle,
} from "@/utils/hapticFeedback";

interface AddButtonProps {
  onPress?: () => void;
  requiredPermission: string[];
  icon?: string;
}

const AddButton: React.FC<AddButtonProps> = ({
  onPress,
  requiredPermission,
  icon,
}) => {
  const theme = useThemeColor();

  const handleAddPress = () => {
    triggerHapticFeedback(ImpactFeedbackStyle.Heavy);
    if (onPress) onPress();
  };

  return (
    <CheckPermission requiredPermission={requiredPermission}>
      <TouchableOpacity
        style={[
          styles.addButton,
          { backgroundColor: theme.primary, borderColor: theme.secondary },
        ]}
        onPress={handleAddPress}
      >
        <FontAwesome6
          name={icon ? icon : "plus"}
          size={60}
          color={theme.secondary}
        />
      </TouchableOpacity>
    </CheckPermission>
  );
};

const styles = StyleSheet.create({
  addButton: {
    width: 70,
    height: 70,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    borderWidth: 5,
    borderStyle: "solid",
  },
});

export default AddButton;
