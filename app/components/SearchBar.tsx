// SearchBar.tsx
import React from "react";
import { StyleSheet, TextInput } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

interface SearchBarProps {
  searchQuery: string;
  placeholder?: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  placeholder = "Search",
  setSearchQuery,
}) => {
  const SecondaryColor = useThemeColor({}, "secondary");
  const TextColor = useThemeColor({}, "text");

  return (
    <TextInput
      style={[styles.input, { color: TextColor, borderColor: SecondaryColor }]}
      placeholder={placeholder}
      placeholderTextColor={SecondaryColor}
      value={searchQuery}
      onChangeText={setSearchQuery}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
    minHeight: 40,
  },
});

export default SearchBar; // Ensure the component is exported as default
