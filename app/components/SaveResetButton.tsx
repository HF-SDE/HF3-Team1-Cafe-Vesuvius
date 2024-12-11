import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import CheckPermission from "@/components/CheckPermission";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  triggerHapticFeedback,
  ImpactFeedbackStyle,
} from "@/utils/hapticFeedback";

interface SaveResetButtonProps {
  onPressSave?: () => void;
  onPressReset?: () => void;
  requiredPermission: string[];
}

const SaveResetButton: React.FC<SaveResetButtonProps> = ({
  onPressSave: onPressSave,
  onPressReset: onPressReset,
  requiredPermission,
}) => {
  const theme = useThemeColor();

  const handleSavePress = () => {
    triggerHapticFeedback(ImpactFeedbackStyle.Medium);
    if (onPressSave) onPressSave();
  };

  const handleResetPress = () => {
    triggerHapticFeedback();
    if (onPressReset) onPressReset();
  };

  return (
    <CheckPermission requiredPermission={requiredPermission}>
      <View
        style={[
          styles.buttonContainer,
          { backgroundColor: theme.primary, borderColor: theme.secondary },
        ]}
      >
        <TouchableOpacity style={styles.button} onPress={handleSavePress}>
          <FontAwesome6
            name={"cloud-arrow-up"}
            size={45}
            color={theme.secondary}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleResetPress}>
          <MaterialCommunityIcons
            name="arrow-u-left-top-bold"
            size={50}
            color={theme.secondary}
          />
        </TouchableOpacity>
      </View>
    </CheckPermission>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    width: 160,
    height: 70,
    borderRadius: 20,
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    borderWidth: 5,
    borderStyle: "solid",
  },
  button: {
    paddingHorizontal: 10,
  },
});

export default SaveResetButton;
