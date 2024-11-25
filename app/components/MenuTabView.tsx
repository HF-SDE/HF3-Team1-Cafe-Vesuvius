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
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import TextIconInput from "@/components/TextIconInput";
import { RawMaterial_MenuItems } from "../models/MenuModel";
import AddIngredientModal from "../app/(auth)/management/menu/[id]/add-ingredient";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const [isModalVisible, setIsModalVisible] = useState(false);

  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");
  const AccentColor = useThemeColor({}, "accent");

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
            <Text>{item.RawMaterial.unit}</Text>

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
              { backgroundColor: PrimaryColor },
            ]}
            style={[styles.tabBar, { backgroundColor: AccentColor }]}
            labelStyle={[styles.tabLabel, { color: TextColor }]}
            activeColor={TextColor}
            inactiveColor={PrimaryColor}
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
            style={[styles.modalContent, { backgroundColor: PrimaryColor }]}
          >
            <AddIngredientModal
              visible={isModalVisible}
              onClose={() => setIsModalVisible(false)}
              onAddIngredient={onAddIngredient}
              themeColors={themeColors}
            />{" "}
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
    minHeight: 400,
    // backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
  },
});

export default CategoryIngredientTabs;
