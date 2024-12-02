import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  TextInput as RNTextInput,
  Modal,
  TextInput,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { RawMaterial_MenuItems } from "../models/MenuModel";
import AddIngredientModal from "../app/(auth)/management/menu/[id]/add-ingredient";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SafeAreaView } from "react-native-safe-area-context";
import NewCategoryInput from "./NewCategoryInput";
import QuantityInput from "./QuantityInput";

type CategoryIngredientTabsProps = {
  categories: string[];
  ingredients: RawMaterial_MenuItems[];
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
  onAddIngredient: (ingredient: RawMaterial_MenuItems) => void;
  onDeleteIngredient: (id: string) => void;
  onUpdateIngredientQuantity: (id: string, quantity: number) => void;

  themeColors: {
    primary: string;
    text: string;
    accent: string;
  };
};

const MenuTabView = React.memo(
  ({
    categories,
    ingredients,
    onAddCategory,
    onDeleteCategory,
    onAddIngredient,
    onDeleteIngredient,
    onUpdateIngredientQuantity,
    themeColors,
  }: CategoryIngredientTabsProps) => {
    const [index, setIndex] = React.useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const theme = useThemeColor();

    const routes = [
      { key: "categories", title: "Categories" },
      { key: "ingredients", title: "Ingredients" },
    ];

    const CategoriesTab = () => (
      <View style={styles.section}>
        <NewCategoryInput
          onAddCategory={onAddCategory}
          themeColors={themeColors}
        />
        <FlatList
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View
              style={[styles.categoryItem, { backgroundColor: theme.primary }]}
            >
              <Text style={styles.categoryText}>{item}</Text>
              <TouchableOpacity onPress={() => onDeleteCategory(item)}>
                <FontAwesome6
                  name="trash-alt"
                  size={18}
                  color={theme.secondary}
                />
              </TouchableOpacity>
            </View>
          )}
          style={styles.listContainer}
        />
      </View>
    );

    const IngredientsTab = () => (
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.addIcon}
          onPress={() => setIsModalVisible(true)}
        >
          <FontAwesome6
            name="square-plus"
            size={60}
            color={themeColors.primary}
          />
        </TouchableOpacity>
        <FlatList
          data={ingredients}
          keyExtractor={(item) => item.RawMaterial.id as string}
          renderItem={({ item }) => (
            <View
              style={[
                styles.ingredientItem,
                { backgroundColor: theme.primary },
              ]}
            >
              <Text style={styles.ingredientName}>{item.RawMaterial.name}</Text>
              <QuantityInput
                itemId={item.RawMaterial.id as string}
                initialQty={item.quantity}
                onQuantityChanged={onUpdateIngredientQuantity}
              />

              <Text style={{ width: 30, color: theme.background }}>
                {item.RawMaterial.unit}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  onDeleteIngredient(item.RawMaterial.id as string)
                }
              >
                <FontAwesome6
                  name="trash-alt"
                  size={18}
                  color={theme.secondary}
                />
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
      <View style={{ flex: 1 }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: Dimensions.get("window").width }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={[
                styles.tabIndicator,
                { backgroundColor: theme.primary },
              ]}
              style={[styles.tabBar, { backgroundColor: theme.accent }]}
              labelStyle={[styles.tabLabel, { color: theme.text }]}
              activeColor={theme.text}
              inactiveColor={theme.primary}
            />
          )}
        />
        <Modal
          animationType="none"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)} // Close modal on Android back button
        >
          <View style={styles.modalOverlay}>
            <View
              style={[styles.modalContent, { backgroundColor: theme.primary }]}
            >
              <AddIngredientModal
                onClose={() => setIsModalVisible(false)}
                onAddIngredient={onAddIngredient}
                themeColors={themeColors}
                excitingStockItems={ingredients.flatMap(
                  (ingredient) => ingredient.RawMaterial
                )}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
    height: "100%",
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
  },
  categoryText: {
    fontSize: 16,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: 10,
    borderRadius: 8,
    // backgroundColor: "#f9f9f9",
    marginBottom: 10,
    gap: 10,
  },
  ingredientName: {
    flex: 1,
    fontSize: 16,
    width: 10,
  },

  addIcon: {
    alignItems: "center",
    paddingTop: 5,
  },
  tabBar: {
    borderRadius: 5,
    elevation: 0,
  },
  tabIndicator: {
    height: 3,
  },
  tabLabel: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    height: "50%",
    minHeight: 600,
    padding: 10,
    borderRadius: 10,
  },
});

export default MenuTabView;
