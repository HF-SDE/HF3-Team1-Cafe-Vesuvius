import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { Platform, Switch } from "react-native";

interface CustomSwitchProps {
  value: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean | undefined;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({
  value,
  onValueChange,
  disabled,
}) => {
  const theme = useThemeColor();

  return (
    <>
      {Platform.OS === "web" ? (
        <div
          style={{
            display: "inline-block",
            position: "relative",
            width: "40px",
            height: "20px",
            backgroundColor: value ? theme.primary : theme.secondary,
            borderRadius: "10px",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
          onClick={() => !disabled && onValueChange?.(!value)}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: value ? "20px" : "0px",
              transform: "translateY(-50%)",
              width: "18px",
              height: "18px",
              backgroundColor: value ? theme.secondary : theme.primary,
              borderRadius: "50%",
              transition: "0.2s",
            }}
          />
        </div>
      ) : (
        <Switch
          trackColor={{ true: theme.primary, false: theme.secondary }}
          thumbColor={value ? theme.secondary : theme.primary}
          ios_backgroundColor={theme.secondary}
          onValueChange={onValueChange}
          value={value}
          disabled={disabled}
        />
      )}
    </>
  );
};

export default CustomSwitch;
