import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { Switch } from "react-native";

interface CustomSwitchProps {
  value: boolean;
  onValueChange?: (value: boolean) => void;
}

const BackgroundColor = useThemeColor({}, "background");
const TextColor = useThemeColor({}, "text");
const PrimaryColor = useThemeColor({}, "primary");
const SecondaryColor = useThemeColor({}, "secondary");
const AccentColor = useThemeColor({}, "accent");
const CustomSwitch: React.FC<CustomSwitchProps> = ({
  value,
  onValueChange,
}) => {
  return (
    <Switch
      trackColor={{ false: "#767577", true: "#81b0ff" }}
      thumbColor={value ? "red" : "#f4f3f4"}
      ios_backgroundColor="#3e3e3e"
      onValueChange={onValueChange}
      value={value}
    />
  );
};

export default CustomSwitch;
