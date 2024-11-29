import React, { useState, useEffect, useCallback, useMemo } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useMenu } from "@/hooks/useMenu";
import { useThemeColor } from "@/hooks/useThemeColor";
import Button from "@/components/DefaultButton";
import TextInput from "@/components/TextInput";
import TemplateLayout from "@/components/TemplateLayout";
import MenuTabView from "@/components/MenuTabView";
import { RouteProp } from "@react-navigation/native";

import { MenuModel } from "@/models/MenuModel";

type EditCreateUserRouteParams = {
  id: string | "new" | undefined;
};

export default function EditCreateUserPage() {
  const route =
    useRoute<RouteProp<{ params: EditCreateUserRouteParams }, "params">>();
  const { id } = route.params || { id: undefined };
  const navigation = useNavigation();

  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");
  const AccentColor = useThemeColor({}, "accent");

  const { menu, isLoading, error, createMenu, updateMenu, deleteMenu } =
    useMenu(id as string);

  const [menuItem, setMenuItem] = useState<MenuModel>({
    id: "",
    name: "",
    price: 0,
    category: [],
    RawMaterial_MenuItems: [],
  });

  interface ChangedFields {
    field?: keyof MenuModel;
    originalValue?: any;
    newValue?: any;
  }

  //  const [changedFields, setChangedFields] = useState<ChangedFields>({});
  const [changedFields, setChangedFields] = useState<{ [key: string]: any }>(
    {}
  );
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
    } else {
      console.log("Changes:", changedFields);

      if (id !== "new") {
        // Update
        const updatedFields: MenuModel = {
          id: menuItem.id,
          ...changedFields,
        };
        updateMenu(updatedFields);
      } else {
        // Create
      }
    }
    navigation.goBack();
  };

  const handleChange = useCallback(
    (field: keyof MenuModel, value: any) => {
      // Only update changedFields and menuItem if the value is different
      if (value !== menuItem[field]) {
        setChangedFields((prev) => ({ ...prev, [field]: value }));
      }

      // Update the menuItem state
      setMenuItem((prev) => ({ ...prev, [field]: value }));
    },
    [menuItem]
  );

  const memoizedMenuTabView = useMemo(
    () => (
      <MenuTabView
        categories={menuItem.category || []}
        ingredients={menuItem.RawMaterial_MenuItems || []}
        onAddCategory={(category) => {
          setMenuItem((prev) => ({
            ...prev,
            category: [...(prev.category || []), category],
          }));
        }}
        onDeleteCategory={(category) => {
          setMenuItem((prev) => ({
            ...prev,
            category: (prev.category || []).filter((cat) => cat !== category),
          }));
        }}
        onAddIngredient={(ingredient) => {
          setMenuItem((prev) => ({
            ...prev,
            RawMaterial_MenuItems: [
              ...(prev.RawMaterial_MenuItems || []),
              ingredient,
            ],
          }));
        }}
        onDeleteIngredient={(id) => {
          setMenuItem((prev) => ({
            ...prev,
            RawMaterial_MenuItems: (prev.RawMaterial_MenuItems || []).filter(
              (item) => item.id !== id
            ),
          }));
        }}
        onUpdateIngredientQuantity={(id, quantity) => {
          setMenuItem((prev) => ({
            ...prev,
            RawMaterial_MenuItems: (prev.RawMaterial_MenuItems || []).map(
              (item) => (item.id === id ? { ...item, quantity } : item)
            ),
          }));
        }}
        themeColors={{
          primary: PrimaryColor,
          text: TextColor,
          accent: AccentColor,
        }}
      />
    ),
    [
      menuItem.category,
      menuItem.RawMaterial_MenuItems,
      PrimaryColor,
      TextColor,
      AccentColor,
    ]
  );

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
              style={{ marginBottom: 10 }}
              label="Name"
              value={menuItem.name}
              onChangeText={(text) => handleChange("name", text)}
              clearTextOnFocus={false}
              selectTextOnFocus={false}
            />
            <TextInput
              label="Price"
              value={menuItem.price?.toString()}
              onChangeText={(text) => {
                // Replace commas with periods
                let formattedText = text.replace(/,/g, ".");

                // Validate the input and ensure only two decimal places are allowed
                const regex = /^\d*\.?\d{0,2}$/;

                if (regex.test(formattedText)) {
                  const newPrice: number = Number(formattedText);
                  handleChange("price", newPrice);
                }
              }}
              inputMode="decimal"
              clearTextOnFocus={false}
              selectTextOnFocus={false}
            />
          </View>

          <View style={{ minHeight: "70%" }}>{memoizedMenuTabView}</View>
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

  inputBox: {
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
