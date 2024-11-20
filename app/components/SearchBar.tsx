// SearchBar.tsx
import React from "react";
import { StyleSheet, TextInput } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");
  const AccentColor = useThemeColor({}, "accent");

  return (
    <TextInput
      style={[styles.input, { color: TextColor, borderColor: PrimaryColor }]}
      placeholder="Search users"
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
  },
});

export default SearchBar; // Ensure the component is exported as default
