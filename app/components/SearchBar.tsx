import React, { useState } from "react";
import { StyleSheet, TextInput, View, TouchableOpacity } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";

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
  const [isFocused, setIsFocused] = useState(false);

  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");

  return (
    <View style={[styles.inputHolder, { backgroundColor: BackgroundColor }]}>
      <FontAwesome
        name="search"
        size={24}
        color={PrimaryColor}
        style={styles.leftIcon}
      />

      <TextInput
        style={[
          styles.input,
          {
            color: TextColor,
            borderColor: isFocused ? TextColor : PrimaryColor, // Change border color on focus
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={SecondaryColor}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {searchQuery.length > 0 && (
        <TouchableOpacity
          onPress={() => setSearchQuery("")}
          style={styles.rightIconContainer}
        >
          <Entypo name="cross" size={32} color={PrimaryColor} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputHolder: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    width: "100%",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: "100%",
    paddingLeft: 40, // Space for left icon
    paddingRight: 40, // Space for right icon
    borderWidth: 1,
    borderRadius: 10,
  },
  leftIcon: {
    position: "absolute",
    left: 10,
    zIndex: 1,
  },
  rightIconContainer: {
    position: "absolute",
    right: 10,
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
});

export default SearchBar;
