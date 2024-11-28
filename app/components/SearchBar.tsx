import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Searchbar, SearchbarProps } from "react-native-paper";

export function SearchBar(props: SearchbarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const SecondaryColor = useThemeColor({}, "secondary");
  const PrimaryColor = useThemeColor({}, "primary");

  const { placeholder } = props;

  return (
    <Searchbar
      style={[
        styles.input,
        {
          backgroundColor: BackgroundColor,
          borderColor: isFocused ? TextColor : PrimaryColor,
        },
      ]}
      inputStyle={[
        {
          color: TextColor,
        },
      ]}
      placeholder={placeholder}
      placeholderTextColor={PrimaryColor}
      {...props}
      iconColor={PrimaryColor}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
  },
});

export default SearchBar;
