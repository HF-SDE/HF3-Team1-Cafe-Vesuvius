import React from "react";
import { TextInput } from "react-native-paper";
import { useThemeColor } from "@/hooks/useThemeColor";
import { transparent } from "react-native-paper/lib/typescript/styles/themes/v2/colors";

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
      style={[style, { backgroundColor: BackgroundColor, color: TextColor }]}
      label={label}
      mode="outlined"
      value={value}
      activeOutlineColor={TextColor}
      outlineColor={PrimaryColor}
      onChangeText={onChange}
      theme={{
        colors: {
          text: TextColor,
          placeholder: PrimaryColor,
          background: "transparent",
          onSurfaceVariant: PrimaryColor,
          primary: TextColor,
          outline: PrimaryColor,
        },
      }}
      contentStyle={{
        color: PrimaryColor,
      }}
    />
  );
};

export default CustomTextInput;
