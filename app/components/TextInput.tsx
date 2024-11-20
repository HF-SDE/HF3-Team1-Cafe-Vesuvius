import React from "react";
import { TextInput } from "react-native-paper";
import { useThemeColor } from "@/hooks/useThemeColor";
import { transparent } from "react-native-paper/lib/typescript/styles/themes/v2/colors";
import { View, TouchableOpacity, StyleSheet } from "react-native";

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSubmitEditing?: () => void;
  style?: object;
  placeholderTextColor?: string;
  autoCorrect?: boolean;
  autoCapitalize?: string | undefined;
}

const CustomTextInput: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  onSubmitEditing,
  style,
  placeholderTextColor,
  autoCorrect,
}) => {
  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");
  const AccentColor = useThemeColor({}, "accent");

  return (
    <TextInput
      style={[style, { backgroundColor: BackgroundColor, color: TextColor }]}
      style={styles.inputBlock}
      label={label}
      mode="outlined"
      value={value}
      activeOutlineColor={TextColor}
      outlineColor={PrimaryColor}
      outlineStyle={{ borderWidth: 2 }}
      activeOutlineColor="white"
      outlineColor={SecondaryColor}
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
      onSubmitEditing={onSubmitEditing}
      theme={{ colors: { onSurfaceVariant: placeholderTextColor } }}
      autoCorrect={autoCorrect}
    />
  );
};

const styles = StyleSheet.create({
  inputBlock: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    width: "100%",
    verticalAlign: "middle",
    backgroundColor: "transparent",
  },
});

export default CustomTextInput;
