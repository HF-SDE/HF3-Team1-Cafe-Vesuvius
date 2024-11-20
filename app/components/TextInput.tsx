import React, { HTMLInputAutoCompleteAttribute } from "react";
import { TextInput, TextInputProps } from "react-native-paper";
import { useThemeColor } from "@/hooks/useThemeColor";
import { TextInputLabelProp } from "react-native-paper/lib/typescript/components/TextInput/types";
import { EnterKeyHintTypeOptions, InputModeOptions, StyleProp } from "react-native";
import { TextStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import { transparent } from "react-native-paper/lib/typescript/styles/themes/v2/colors";
import { View, TouchableOpacity, StyleSheet } from "react-native";

interface InputProps {
  label: TextInputLabelProp;
  value: string;
  onChange: (value: string) => void;
  onSubmitEditing?: () => void;
  style?: StyleProp<TextStyle>;
  clearButtonMode: TextInputProps["clearButtonMode"];
  autoComplete: TextInputProps["autoComplete"];
  clearTextOnFocus: TextInputProps["clearTextOnFocus"];
  enablesReturnKeyAutomatically: TextInputProps["enablesReturnKeyAutomatically"];
  enterKeyHint: EnterKeyHintTypeOptions;
  inputMode: InputModeOptions;
  autoCorrect?: TextInputProps["autoCorrect"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
}


/**
 * Custom text input component
 *
 * @example
 * <CustomTextInput label="Name" value={name} onChange={setName} />
 * 
 * @param {TextInputLabelProp} label - label for the text input @see https://callstack.github.io/react-native-paper/docs/components/TextInput/#label
 * @param {string} value - value for the text input @see https://callstack.github.io/react-native-paper/docs/components/TextInput/#value
 * @param {(value: string) => void} onChange - function to handle text input change event @see https://reactnative.dev/docs/textinput#onchangetext
 * @param {StyleProp<TextStyle>} style - custom style for the text input @see https://callstack.github.io/react-native-paper/docs/components/TextInput/#style
 * @param {TextInputProps["clearButtonMode"]} [clearButtonMode="never"] [IOS ONLY] - default is "never". @see https://reactnative.dev/docs/textinput#clearbuttonmode-ios
 * @param {TextInputProps["autoComplete"]} [autoComplete="off"] - default is "off". @see https://reactnative.dev/docs/textinput#autocomplete
 * @param {TextInputProps["autoCapitalize"]} [autoCapitalize="sentences"] - default is "sentences". @see https://reactnative.dev/docs/textinput#autocapitalize
 * @param {TextInputProps["clearTextOnFocus"]} [clearTextOnFocus=true] [IOS ONLY] - default is true. @see https://reactnative.dev/docs/textinput#cleartextonfocus-ios
 * @param {TextInputProps["enablesReturnKeyAutomatically"]} [enablesReturnKeyAutomatically=false] [IOS ONLY] - default is false.  @see https://reactnative.dev/docs/textinput#enablesreturnkeyautomatically-ios
 * @param {EnterKeyHintTypeOptions} [enterKeyHint="next"] - default is "next". What enter keys should be used for. @see https://reactnative.dev/docs/textinput#enterkeyhint
 * @param {InputModeOptions} [inputMode="text"] - default is "text". Helps to determine what keyboardType should be used. @see https://reactnative.dev/docs/textinput#inputmode
 * @returns {*}
 */
export default function CustomTextInput({ label, value, onChange, style, onSubmitEditing, autoCorrect, clearButtonMode = "never", autoComplete = "off", autoCapitalize = "sentences", clearTextOnFocus = true, enablesReturnKeyAutomatically = false, enterKeyHint = "next", inputMode = "text"  }: InputProps) {
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
      outlineColor={PrimaryColor}
      outlineStyle={{ borderWidth: 2 }}
      onChangeText={onChange}
      clearButtonMode={clearButtonMode}
      autoComplete={autoComplete}
      autoCapitalize={autoCapitalize}
      clearTextOnFocus={clearTextOnFocus}
      enablesReturnKeyAutomatically={enablesReturnKeyAutomatically}
      enterKeyHint={enterKeyHint}
      inputMode={inputMode}
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


