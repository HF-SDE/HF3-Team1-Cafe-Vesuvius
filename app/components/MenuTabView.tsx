import React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  TextInput as RNTextInput,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import TextIconInput from "@/components/TextIconInput";
import { RawMaterial_MenuItems } from "../models/MenuModel";

type CategoryIngredientTabsProps = {
  categories: string[];
  ingredients: RawMaterial_MenuItems[];
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
  onAddIngredient: () => void;
  onDeleteIngredient: (id: string) => void;
  onUpdateIngredientQuantity: (id: string, quantity: number) => void;
  themeColors: {
    primary: string;
    text: string;
    accent: string;
  };
};

const CategoryIngredientTabs: React.FC<CategoryIngredientTabsProps> = ({
  categories,
  ingredients,
  onAddCategory,
  onDeleteCategory,
  onAddIngredient,
  onDeleteIngredient,
  onUpdateIngredientQuantity,
  themeColors,
}) => {
  const [newCategory, setNewCategory] = React.useState("");
  const [index, setIndex] = React.useState(0);

  const routes = [
    { key: "categories", title: "Categories" },
    { key: "ingredients", title: "Ingredients" },
  ];

  const CategoriesTab = () => (
    <View style={styles.section}>
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
      />
      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.categoryItem}>
            <Text style={styles.categoryText}>{item}</Text>
            <TouchableOpacity onPress={() => onDeleteCategory(item)}>
              <FontAwesome6 name="trash" size={18} color="red" />
            </TouchableOpacity>
          </View>
        )}
        style={styles.listContainer}
      />
    </View>
  );

  const IngredientsTab = () => (
    <View style={styles.section}>
      <TouchableOpacity style={styles.addIcon} onPress={onAddIngredient}>
        <FontAwesome6
          name="square-plus"
          size={60}
          color={themeColors.primary}
        />
      </TouchableOpacity>
      <FlatList
        data={ingredients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.ingredientItem}>
            <Text style={styles.ingredientName}>{item.RawMaterial.name}</Text>
            <RNTextInput
              style={styles.quantityInput}
              value={item.quantity.toString()}
              keyboardType="numeric"
              onChangeText={(value) =>
                onUpdateIngredientQuantity(item.id, Number(value))
              }
            />
            <TouchableOpacity onPress={() => onDeleteIngredient(item.id)}>
              <FontAwesome6 name="trash" size={18} color="red" />
            </TouchableOpacity>
          </View>
        )}
        style={styles.listContainer}
      />
    </View>
  );

  const renderScene = SceneMap({
    categories: CategoriesTab,
    ingredients: IngredientsTab,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: Dimensions.get("window").width }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: themeColors.primary }}
          style={{ backgroundColor: themeColors.accent }}
          labelStyle={{ color: themeColors.text }}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  listContainer: {
    marginTop: 10,
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  categoryText: {
    fontSize: 16,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
  },
  ingredientName: {
    flex: 1,
    fontSize: 16,
  },
  quantityInput: {
    width: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    textAlign: "center",
  },
  addIcon: {
    alignItems: "center",
    paddingVertical: 10,
  },
});

export default CategoryIngredientTabs;
