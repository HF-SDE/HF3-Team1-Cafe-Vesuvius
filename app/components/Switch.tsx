import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { Switch } from "react-native";

interface CustomSwitchProps {
  value: boolean;
  onValueChange?: (value: boolean) => void;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({
  value,
  onValueChange,
}) => {
  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");
  return (
    <Switch
      trackColor={{ true: "red", false: "#767577" }}
      thumbColor={value ? "red" : "#f4f3f4"}
      ios_backgroundColor="red"
      onValueChange={onValueChange}
      value={value}
    />
  );
};

export default CustomSwitch;
