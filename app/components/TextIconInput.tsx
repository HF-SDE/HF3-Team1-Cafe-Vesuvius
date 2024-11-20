import React, { ComponentProps } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TouchableOpacityProps,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TextInputLabelProp } from "react-native-paper/lib/typescript/components/TextInput/types";
import CustomTextInput from "../components/TextInput";

interface TextIconInputProps extends TextInputProps {
  label: TextInputLabelProp;
  value: TextInputProps["value"];
  placeholder?: TextInputProps["placeholder"];
  icon: ComponentProps<typeof MaterialCommunityIcons>['name'];
  iconPosition?: "left" | "right";
  iconStyle?:  StyleProp<ViewStyle>;
  iconColor?: ComponentProps<typeof MaterialCommunityIcons>['color'];
  secureTextEntry?: TextInputProps["secureTextEntry"];
  highlighOutlineColor?: ComponentProps<typeof CustomTextInput>['highlighOutlineColor'];
  isHighlighted?: ComponentProps<typeof CustomTextInput>['isHighlighted'];
  editable?: TextInputProps["editable"];
  onChangeText: TextInputProps["onChangeText"];
  onIconPress?: TouchableOpacityProps["onPress"];
}


/**
 * Text input with icon
 * @param {TextInputLabelProp} label [Required] - Label for the text input @see https://callstack.github.io/react-native-paper/docs/components/TextInput/#label
 * @param {TextInputProps["value"]} value [Required] - Value of the text input @see https://reactnative.dev/docs/textinput#value
 * @param {TextInputProps["placeholder"]} [placeholder=""] [Optional] - Default is "" - Placeholder text @see https://callstack.github.io/react-native-paper/docs/components/TextInput/#placeholder
 * @param {ComponentProps<typeof MaterialCommunityIcons>['name']} icon [Required] - Icon name @see https://icons.expo.fyi/
 * @param {("left" | "right")} [iconPosition="right"] [Optional] - Default is "right" - Position of the icon
 * @param {StyleProp<ViewStyle>} [iconStyle={}] [Optional] - Style for the icon
 * @param {ComponentProps<typeof MaterialCommunityIcons>['color']} [iconColor="black"] [Optional] - Default is "black" - Color of the icon @see https://reactnative.dev/docs/textinput#color
 * @param {TextInputProps["secureTextEntry"]} [secureTextEntry] [Optional] - Default is true - If the text input should be secure @see https://reactnative.dev/docs/textinput#securetextentry
 * @param {ComponentProps<typeof TextInput>['highlighOutlineColor']} [highlighOutlineColor] [Optional] - Default is "black" - Color of the outline when the text input is highlighted
 * @param {ComponentProps<typeof TextInput>['isHighlighted']} [isHighlighted] [Optional] - Default is false - If the text input is highlighted
 * @param {TextInputProps["editable"]} [editable] [Optional] - Default is true - If the text input is editable @see https://callstack.github.io/react-native-paper/docs/components/TextInput/#editable
 * @param {TextInputProps["onChangeText"]} onChangeText [Required] - Function to handle text input change event @see https://reactnative.dev/docs/textinput#onchangetext
 * @param {TouchableOpacityProps["onPress"]} [onIconPress] [Optional] - Function to handle icon press event
 * @param {{}} ...rest [Optional] - Other props for the text input @see https://reactnative.dev/docs/textinput @see https://callstack.github.io/react-native-paper/docs/components/TextInput
 * @returns {*}
 */
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
  editable = true,
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
      <CustomTextInput
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
