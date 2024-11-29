import React, { useState, memo } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
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
        onIconPress={handleAddCategory}
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
});

export default memo(NewCategoryInput);