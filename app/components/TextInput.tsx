import React, { ComponentProps, HTMLInputAutoCompleteAttribute } from "react";
import { TextInput, TextInputProps } from "react-native-paper";
import { useThemeColor } from "@/hooks/useThemeColor";
import { TextInputLabelProp } from "react-native-paper/lib/typescript/components/TextInput/types";
import {
  EnterKeyHintTypeOptions,
  InputModeOptions,
  StyleProp,
} from "react-native";
import { TextStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import { transparent } from "react-native-paper/lib/typescript/styles/themes/v2/colors";
import { View, TouchableOpacity, StyleSheet } from "react-native";

interface InputProps {
  label: TextInputLabelProp;
  value?: TextInputProps["value"];
  placeholder?: TextInputProps["placeholder"];
  style?: StyleProp<TextStyle>;
  clearButtonMode?: TextInputProps["clearButtonMode"];
  autoComplete?: TextInputProps["autoComplete"];
  clearTextOnFocus?: TextInputProps["clearTextOnFocus"];
  enablesReturnKeyAutomatically?: TextInputProps["enablesReturnKeyAutomatically"];
  enterKeyHint?: EnterKeyHintTypeOptions;
  inputMode?: InputModeOptions;
  autoCorrect?: TextInputProps["autoCorrect"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  highlighOutlineColor?: string;
  isHighlighted?: boolean;
  secureTextEntry?: TextInputProps['secureTextEntry'];
  editable?: TextInputProps["editable"];
  onChange?: TextInputProps["onChangeText"];
  onSubmitEditing?: TextInputProps["onSubmitEditing"];
}

/**
 * Custom text input component
 *
 * @example
 * <CustomTextInput label="Name" value={name} onChange={setName} />
 *
 * @param {TextInputLabelProp} label [Required] - label for the text input @see https://callstack.github.io/react-native-paper/docs/components/TextInput/#label
 * @param {string} [value] [Optional] - value for the text input @see https://callstack.github.io/react-native-paper/docs/components/TextInput/#value
 * @param {StyleProp<TextStyle>} [style] [Optional] - custom style for the text input @see https://callstack.github.io/react-native-paper/docs/components/TextInput/#style
 * @param {TextInputProps["clearButtonMode"]} [clearButtonMode="never"] [IOS ONLY] [Optional] - default is "never". @see https://reactnative.dev/docs/textinput#clearbuttonmode-ios
 * @param {TextInputProps["autoComplete"]} [autoComplete="off"] [Optional] - default is "off". @see https://reactnative.dev/docs/textinput#autocomplete
 * @param {TextInputProps["autoCapitalize"]} [autoCapitalize="sentences"] [Optional] - default is "sentences". @see https://reactnative.dev/docs/textinput#autocapitalize
 * @param {TextInputProps["clearTextOnFocus"]} [clearTextOnFocus=true] [IOS ONLY] [Optional] - default is true. @see https://reactnative.dev/docs/textinput#cleartextonfocus-ios
 * @param {TextInputProps["enablesReturnKeyAutomatically"]} [enablesReturnKeyAutomatically=false] [IOS ONLY] [Optional] - default is false.  @see https://reactnative.dev/docs/textinput#enablesreturnkeyautomatically-ios
 * @param {EnterKeyHintTypeOptions} [enterKeyHint="next"] [Optional] - default is "next". What enter keys should be used for. @see https://reactnative.dev/docs/textinput#enterkeyhint
 * @param {InputModeOptions} [inputMode="text"] [Optional] - default is "text" - Helps to determine what keyboardType should be used. @see https://reactnative.dev/docs/textinput#inputmode
 * @param {string} [highlighOutlineColor="red"] [Optional] - default is "red" - Color of the outline when the text input is highlighted
 * @param {boolean} [isHighlighted=false] [Optional] - default is false - If the text input is highlighted
 * @param {TextInputProps["autoCorrect"]} [autoCorrect] [Optional] - default is true - If the text input should be auto corrected @see https://reactnative.dev/docs/textinput#autocorrect
 * @param {TextInputProps["secureTextEntry"]} [secureTextEntry] [Optional] - default is false - If the text input should be secure @see https://reactnative.dev/docs/textinput#securetextentry
 * @param {TextInputProps["editable"]} [editable] [Optional] - default is true - If the text input should be editable @see https://reactnative.dev/docs/textinput#editable
 * @param {TextInputProps["onChangeText"]} [onChange] [Optional] - function to handle text input change event @see https://reactnative.dev/docs/textinput#onchangetext
 * @param {TextInputProps["onSubmitEditing"]} [onSubmitEditing] [Optional] - function to handle text input submit event @see https://reactnative.dev/docs/textinput#onsubmitediting
 * @returns {*}
 */
export default function CustomTextInput({
  label,
  value,
  onChange,
  style,
  onSubmitEditing,
  autoCorrect,
  clearButtonMode = "never",
  autoComplete = "off",
  autoCapitalize = "sentences",
  clearTextOnFocus = true,
  enablesReturnKeyAutomatically = false,
  enterKeyHint = "next",
  inputMode = "text",
  highlighOutlineColor = "red",
  isHighlighted = false,
  secureTextEntry,
  editable = true,
}: InputProps) {
  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");
  const AccentColor = useThemeColor({}, "accent");

  return (
    <TextInput
      style={[
        style,
        styles.inputBlock,
        { backgroundColor: BackgroundColor, color: TextColor },
      ]}
      label={label}
      mode="outlined"
      value={value}
      activeOutlineColor={TextColor}
      outlineColor={isHighlighted ? highlighOutlineColor : PrimaryColor}
      outlineStyle={{ borderWidth: 2 }}
      onChangeText={onChange}
      clearButtonMode={clearButtonMode}
      autoComplete={autoComplete}
      autoCapitalize={autoCapitalize}
      clearTextOnFocus={clearTextOnFocus}
      enablesReturnKeyAutomatically={enablesReturnKeyAutomatically}
      enterKeyHint={enterKeyHint}
      inputMode={inputMode}
      editable={editable}
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
      autoCorrect={autoCorrect}
      secureTextEntry={secureTextEntry}
    />
  );
}

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
