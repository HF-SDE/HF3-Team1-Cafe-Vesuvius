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

  const theme = useThemeColor();

  const { menu, isLoading, error, createMenu, updateMenu, deleteMenu } =
    useMenu(id as string);

  const [menuItem, setMenuItem] = useState<MenuModel>({
    id: "",
    name: "",
    price: 0,
    category: [],
    RawMaterial_MenuItems: [],
  });

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
    const changedFieldsCount = Object.keys(changedFields).length;

    if (changedFieldsCount === 0) {
      console.log("No changes");
    } else {
      console.log("Update/Create");

      if (id !== "new") {
        // Update user logic here
        const updatedFields = Object.keys(changedFields).reduce(
          (acc, field) => {
            acc[field] = menuItem[field];
            return acc;
          },
          {} as Partial<MenuModel>
        );
        updateMenu({ id: menuItem.id, ...updatedFields });
        console.log(changedFields);
        console.log(menuItem);

        console.log(updatedFields);
      } else {
        // Create new user logic here
      }
    }

    navigation.goBack();
  };

  const handleChange = useCallback(
    (field: keyof MenuModel, value: any) => {
      setMenuItem((prevMenu) => ({
        ...prevMenu,
        [field]: value,
      }));

      setChangedFields((prevChangedFields) => {
        let origValue = menuItem[field] || ""; // Original value of the field in menuItem

        if (prevChangedFields[field] === undefined) {
          // Step 2: If no entry exists, create one using the current value from menuItem[field]
          return {
            ...prevChangedFields,
            [field]: origValue,
          };
        } else {
          origValue = prevChangedFields[field];
        }

        // Step 3: If entry exists and value matches the original value, remove it
        if (value === origValue) {
          const { [field]: _, ...rest } = prevChangedFields; // Remove the field
          return rest;
        }

        // Step 3b: If value doesn't match the original value, leave changedFields unchanged
        return prevChangedFields;
      });
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
          primary: theme.primary,
          text: theme.text,
          accent: theme.accent,
        }}
      />
    ),
    [
      menuItem.category,
      menuItem.RawMaterial_MenuItems,
      theme.primary,
      theme.text,
      theme.accent,
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
            <Text style={[styles.sectionTitle, { color: theme.primary }]}>
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