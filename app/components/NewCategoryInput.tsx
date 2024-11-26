import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import TextIconInput from "@/components/TextIconInput";

type NewCategoryInputProps = {
  onAddCategory: (category: string) => void;
  themeColors: {
    primary: string;
  };
};

const NewCategoryInput = ({
  onAddCategory,
  themeColors,
}: NewCategoryInputProps) => {
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setNewCategory(""); // Reset input after adding
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TextIconInput
        placeholder="New Category"
        value={newCategory}
        onChangeText={setNewCategory}
        label={"New category"}
        icon="plus"
        iconColor={themeColors.primary}
        onIconPress={() => {
          if (newCategory.trim()) {
            onAddCategory(newCategory.trim());
            setNewCategory("");
          }
        }}
        clearTextOnFocus={false}
      />
      <TouchableOpacity onPress={handleAddCategory}>
        <FontAwesome6
          name="plus-circle"
          size={24}
          color={themeColors.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 2,
    borderRadius: 8,
    marginRight: 10,
  },
});

export default NewCategoryInput;
