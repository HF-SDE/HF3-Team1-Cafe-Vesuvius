import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TextInput as RNTextInput,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useMenu } from "@/hooks/useMenu";
import { useThemeColor } from "@/hooks/useThemeColor";
import Button from "@/components/DefaultButton";
import TextInput from "@/components/TextInput";
import TextIconInput from "@/components/TextIconInput";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import TemplateLayout from "@/components/TemplateLayout";
import {
  MenuModel,
  RawMaterial_MenuItems,
} from "../../../../../models/MenuModel";
import AddButton from "@/components/AddButton";

export default function EditCreateUserPage() {
  const route = useRoute();
  const { id } = route.params || {};
  const navigation = useNavigation();

  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");
  const AccentColor = useThemeColor({}, "accent");

  const { menu } = useMenu(id as string);

  const [menuItem, setMenuItem] = useState<MenuModel>({
    id: "",
    name: "",
    price: 0,
    category: [],
    RawMaterial_MenuItems: [],
  });

  const [newCategory, setNewCategory] = useState("");
  const [changedFields, setChangedFields] = useState<{ [key: string]: any }>(
    {}
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (menu) {
      const foundMenuItem = menu[0];
      if (id && foundMenuItem) setMenuItem(foundMenuItem);
    }
  }, [id, menu]);

  const routes = [
    { key: "categories", title: "Categories" },
    { key: "ingredients", title: "Ingredients" },
  ];

  const handleSave = () => {
    if (Object.keys(changedFields).length === 0) {
      console.log("No changes");
      navigation.goBack();
      return;
    }
    console.log("Changes:", changedFields);
    // Update or create logic here
  };

  const handleChange = (field: string, value: any) => {
    if (value !== menuItem[field]) {
      setChangedFields((prev) => ({ ...prev, [field]: value }));
    }
    setMenuItem((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setMenuItem((prev) => ({
        ...prev,
        category: [...prev.category, newCategory.trim()],
      }));
      setNewCategory("");
    }
  };

  const handleDeleteCategory = (category: string) => {
    setMenuItem((prev) => ({
      ...prev,
      category: prev.category.filter((cat) => cat !== category),
    }));
  };

  const handleAddIngredient = () => {
    const newIngredient: RawMaterial_MenuItems = {
      id: `${Date.now()}`,
      quantity: 1,
      RawMaterial: { name: "New Ingredient", unit: "unit" },
    };
    setMenuItem((prev) => ({
      ...prev,
      RawMaterial_MenuItems: [...prev.RawMaterial_MenuItems, newIngredient],
    }));
  };

  const handleDeleteIngredient = (id: string) => {
    setMenuItem((prev) => ({
      ...prev,
      RawMaterial_MenuItems: prev.RawMaterial_MenuItems.filter(
        (item) => item.id !== id
      ),
    }));
  };

  const RenderCategory = ({ category }: { category: string }) => (
    <View style={styles.categoryItem}>
      <Text style={styles.categoryText}>{category}</Text>
      <TouchableOpacity onPress={() => handleDeleteCategory(category)}>
        <FontAwesome6 name="trash" size={18} color="red" />
      </TouchableOpacity>
    </View>
  );

  const RenderIngredient = ({ item }: { item: RawMaterial_MenuItems }) => (
    <View style={styles.ingredientItem}>
      <Text style={styles.ingredientName}>{item.RawMaterial.name}</Text>
      <RNTextInput
        style={styles.quantityInput}
        value={item.quantity.toString()}
        keyboardType="numeric"
        onChangeText={(value) =>
          setMenuItem((prev) => ({
            ...prev,
            RawMaterial_MenuItems: prev.RawMaterial_MenuItems.map((ing) =>
              ing.id === item.id ? { ...ing, quantity: Number(value) } : ing
            ),
          }))
        }
      />
      <TouchableOpacity onPress={() => handleDeleteIngredient(item.id)}>
        <FontAwesome6 name="trash" size={18} color="red" />
      </TouchableOpacity>
    </View>
  );

  const CategoriesTab = () => (
    <View style={styles.section}>
      <TextIconInput
        placeholder="New Category"
        value={newCategory}
        onChangeText={setNewCategory}
        label={"New category"}
        icon="plus"
        iconColor={PrimaryColor}
        onIconPress={handleAddCategory}
      />
      <FlatList
        data={menuItem.category}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <RenderCategory category={item} />}
        style={styles.listContainer}
      />
    </View>
  );

  const IngredientsTab = () => (
    <View style={styles.section}>
      <TouchableOpacity style={styles.addIcon} onPress={handleAddIngredient}>
        <FontAwesome6 name="square-plus" size={60} color={PrimaryColor} />
      </TouchableOpacity>
      <FlatList
        data={menuItem.RawMaterial_MenuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RenderIngredient item={item} />}
        style={styles.listContainer}
      />
    </View>
  );

  const renderScene = SceneMap({
    categories: CategoriesTab,
    ingredients: IngredientsTab,
  });

  return (
    <TemplateLayout
      pageName="ManagementPage"
      title={id !== "new" ? "Edit Menu Item" : "Create Menu Item"}
      buttonTitle="Cancel"
    >
      <View style={styles.container}>
        <View>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: PrimaryColor }]}>
              Menu Info
            </Text>
            <TextInput
              label="Name"
              value={menuItem.name}
              onChange={(value) => handleChange("name", value)}
            />
            <TextInput
              label="Price"
              value={menuItem.price.toString()}
              onChange={(value) => handleChange("price", value)}
            />
          </View>

          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: Dimensions.get("window").width }}
            renderTabBar={(props) => (
              <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: PrimaryColor }}
                style={{ backgroundColor: AccentColor }}
                labelStyle={{ color: TextColor }}
              />
            )}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Cancel" onPress={() => navigation.goBack()} />
          <Button
            title={id !== "new" ? "Save" : "Create"}
            onPress={handleSave}
          />
        </View>
      </View>
    </TemplateLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addIcon: {
    alignItems: "center",
    paddingVertical: 10,
  },
});
