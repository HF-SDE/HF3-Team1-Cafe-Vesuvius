import React from "react";
import { TextInput } from "react-native-paper";
import { useThemeColor } from "@/hooks/useThemeColor";

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  style?: object;
}

const CustomTextInput: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  style,
}) => {
  const PrimaryColor = useThemeColor({}, "primary");

  return (
    <TextInput
      style={style}
      label={label}
      mode="outlined"
      value={value}
      activeOutlineColor={PrimaryColor}
      onChangeText={onChange}
    />
  );
};

export default CustomTextInput;
