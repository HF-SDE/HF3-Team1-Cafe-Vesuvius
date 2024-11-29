import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Searchbar, SearchbarProps } from "react-native-paper";

export function SearchBar(props: SearchbarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const theme = useThemeColor();

  const { placeholder } = props;

  return (
    <Searchbar
      style={[
        styles.input,
        {
          backgroundColor: theme.background,
          borderColor: isFocused ? theme.text : theme.primary,
        },
      ]}
      inputStyle={[
        {
          color: theme.text,
        },
      ]}
      placeholder={placeholder}
      placeholderTextColor={theme.primary}
      {...props}
      iconColor={theme.primary}
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
