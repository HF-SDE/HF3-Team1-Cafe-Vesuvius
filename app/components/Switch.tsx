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
  const theme = useThemeColor();

  return (
    <Switch
      trackColor={{ true: theme.primary, false: theme.secondary }}
      thumbColor={value ? theme.secondary : theme.primary}
      ios_backgroundColor={theme.secondary}
      onValueChange={onValueChange}
      value={value}
    />
  );
};

export default CustomSwitch;
