import React, { ReactElement } from "react";
import {
  HelperText,
  HelperTextProps,
  TextInput,
  TextInputProps,
} from "react-native-paper";
import { useThemeColor } from "@/hooks/useThemeColor";
import { TextInputLabelProp } from "react-native-paper/lib/typescript/components/TextInput/types";
import {
  EnterKeyHintTypeOptions,
  InputModeOptions,
  StyleProp,
} from "react-native";
import { TextStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import { StyleSheet } from "react-native";

export interface CustomTextInputProps extends TextInputProps {
  label: TextInputLabelProp;
  value?: TextInputProps["value"];
  placeholder?: TextInputProps["placeholder"];
  style?: StyleProp<TextStyle>;
  error?: TextInputProps["error"];
  clearButtonMode?: TextInputProps["clearButtonMode"];
  autoComplete?: TextInputProps["autoComplete"];
  clearTextOnFocus?: TextInputProps["clearTextOnFocus"];
  enablesReturnKeyAutomatically?: TextInputProps["enablesReturnKeyAutomatically"];
  enterKeyHint?: EnterKeyHintTypeOptions;
  inputMode?: InputModeOptions;
  autoCorrect?: TextInputProps["autoCorrect"];
  autoCapitalize?: TextInputProps["autoCapitalize"];

  /**
   * Color of the outline when the text input is highlighted
   */
  highlighOutlineColor?: string;

  /**
   * If the text input is highlighted
   */
  isHighlighted?: boolean;
  secureTextEntry?: TextInputProps["secureTextEntry"];
  editable?: TextInputProps["editable"];
  onChangeText?: TextInputProps["onChangeText"];
  onSubmitEditing?: TextInputProps["onSubmitEditing"];
  onKeyPress?: TextInputProps["onKeyPress"];

  /**
   * Callback triggered when the input loses focus
   */
  onLeave?: () => void;
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
 * @param {TextInputProps["error"]} [error] [Optional] - default is false - Whether to style the TextInput with error style. @see https://callstack.github.io/react-native-paper/docs/components/TextInput/#error
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
 * @param {TextInputProps["onLeave"]} [onLeave] [Optional] - function to handle text input submit event @see https://reactnative.dev/docs/textinput#onsubmitediting
 * @param {TextInputProps["maxLength"]} [maxLength] [Optional] - function to handle text input submit event @see https://reactnative.dev/docs/textinput#onsubmitediting
 *
 * @returns {*}
 */
export default function CustomTextInput({
  label,
  value,
  onChangeText: onChange,
  style,
  onSubmitEditing,
  onKeyPress,
  onLeave,
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
  error = false,
  maxLength,
}: CustomTextInputProps): ReactElement {
  const theme = useThemeColor();

  return (
    <>
      <TextInput
        style={[
          style,
          styles.inputBlock,
          { backgroundColor: theme.background, color: theme.text },
        ]}
        label={label}
        mode="outlined"
        value={value}
        activeOutlineColor={theme.text}
        outlineColor={isHighlighted ? highlighOutlineColor : theme.primary}
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
            text: theme.text,
            placeholder: theme.primary,
            background: "transparent",
            onSurfaceVariant: theme.primary,
            primary: theme.text,
            outline: theme.primary,
          },
        }}
        maxLength={maxLength || 30}
        contentStyle={{
          color: theme.primary,
        }}
        onSubmitEditing={onSubmitEditing}
        onKeyPress={onKeyPress}
        autoCorrect={autoCorrect}
        secureTextEntry={secureTextEntry}
        error={error}
        onBlur={() => {
          onLeave?.();
        }}
      />
    </>
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
