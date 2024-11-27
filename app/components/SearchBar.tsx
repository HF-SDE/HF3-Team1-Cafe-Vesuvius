import React from "react";
import { StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Searchbar, SearchbarProps } from "react-native-paper";

export function SearchBar(props: SearchbarProps) {
  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const SecondaryColor = useThemeColor({}, "secondary");

  const { placeholder } = props;

  return (

    <Searchbar
      style={[
        styles.input,
        { backgroundColor: BackgroundColor }
      ]}
      inputStyle={[
        {
          color: TextColor
        }
      ]}
      placeholder={placeholder}
      placeholderTextColor={SecondaryColor}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 10,
    marginBlockEnd: 10, 
  }
});

export default SearchBar;
