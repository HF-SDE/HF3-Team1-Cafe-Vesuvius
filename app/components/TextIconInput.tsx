import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import TextInput from "../components/TextInput";

interface TextIconInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  icon?: string;
  iconPosition?: "left" | "right";
  iconStyle?: object;
  iconColor?: string;
  onIconPress?: () => void;
  secureTextEntry?: boolean;
  highlighOutlineColor?: string;
  isHighlighted?: boolean;
}

export default function TextIconInput({
  label,
  value,
  onChangeText,
  placeholder = "",
  icon,
  iconPosition = "right",
  iconStyle = {},
  iconColor = "black",
  onIconPress,
  secureTextEntry,
  highlighOutlineColor,
  isHighlighted,
  ...rest
}: TextIconInputProps) {
  return (
    <View
      style={[
        styles.container,
        iconPosition === "left" ? styles.rowReverse : styles.row,
      ]}
    >
      {icon && iconPosition === "left" && (
        <TouchableOpacity
          onPress={onIconPress}
          style={[styles.iconContainer, styles.leftIcon, iconStyle]}
        >
          <MaterialCommunityIcons name={icon} size={24} />
        </TouchableOpacity>
      )}
      <TextInput
        {...rest}
        label={label}
        value={value}
        onChange={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        highlighOutlineColor={highlighOutlineColor}
        isHighlighted={isHighlighted}
        style={[
          styles.textInput,
          icon && iconPosition === "left" ? { paddingLeft: 40 } : {},
          icon && iconPosition === "right" ? { paddingRight: 40 } : {},
        ]}
      />
      {icon && iconPosition === "right" && (
        <TouchableOpacity
          onPress={onIconPress}
          style={[styles.iconContainer, styles.rightIcon, iconStyle]}
        >
          <MaterialCommunityIcons name={icon} size={24} color={iconColor} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    width: "100%",
  },
  row: {
    flexDirection: "row",
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  textInput: {
    flex: 1,
  },
  iconContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    zIndex: 1,
    marginTop: 5,
  },
  leftIcon: {
    left: 10,
  },
  rightIcon: {
    right: 10,
  },
});
