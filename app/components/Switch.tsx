import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { Platform, Switch } from "react-native";

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
  const AccentColor = useThemeColor({}, "accent");

  return (
    <Switch
      trackColor={{ true: PrimaryColor, false: SecondaryColor }}
      thumbColor={value ? SecondaryColor : PrimaryColor}
      ios_backgroundColor={SecondaryColor}
      onValueChange={onValueChange}
      value={value}
    />
  );
};

export default CustomSwitch;
