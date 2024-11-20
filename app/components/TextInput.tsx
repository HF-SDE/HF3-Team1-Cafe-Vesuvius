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
  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");
  const AccentColor = useThemeColor({}, "accent");

  return (
    <TextInput
      style={[style, { borderColor: "red" }]}
      label={label}
      mode="outlined"
      value={value}
      activeOutlineColor={PrimaryColor}
      outlineColor={SecondaryColor}
      onChangeText={onChange}
    />
  );
};

export default CustomTextInput;
