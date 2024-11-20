import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import CheckPermission from "@/components/CheckPermission";
import { useThemeColor } from "@/hooks/useThemeColor";

interface AddButtonProps {
  onPress: () => void;
  requiredPermission: string[];
}

const AddButton: React.FC<AddButtonProps> = ({
  onPress,
  requiredPermission,
}) => {
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");

  return (
    <CheckPermission requiredPermission={requiredPermission}>
      <TouchableOpacity
        style={[
          styles.addButton,
          { backgroundColor: PrimaryColor, borderColor: SecondaryColor },
        ]}
        onPress={onPress}
      >
        <FontAwesome6 name="plus" size={60} color={SecondaryColor} />
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
