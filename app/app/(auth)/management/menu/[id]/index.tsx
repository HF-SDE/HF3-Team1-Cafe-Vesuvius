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
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";
import LoadingPage from "@/components/LoadingPage";
import CheckPermission from "@/components/CheckPermission";

import { MenuModel } from "@/models/MenuModel";

import { triggerHapticFeedback } from "@/utils/hapticFeedback";

type EditCreateMenuRouteParams = {
  id: string | "new" | undefined;
};

export default function EditCreateUserPage() {
  const route =
    useRoute<RouteProp<{ params: EditCreateMenuRouteParams }, "params">>();
  const { id } = route.params || { id: undefined };
  const navigation = useNavigation();

  const theme = useThemeColor();

  const { menu, isLoading, error, createMenu, updateMenu, deleteMenu } =
    useMenu(id as string);

  if (error) {
    router.navigate("/management/menu");
  }
  const [menuItem, setMenuItem] = useState<MenuModel>({
    id: "",
    name: "",
    price: 0,
    category: [],
    RawMaterial_MenuItems: [],
  });

  const [validationErrors, setValidationErrors] = useState({
    name: false,
    price: false,
    ingredients: false,
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
  useEffect(() => {
    // Add a trashcan button to the header
    if (id !== "new") {
      navigation.setOptions({
        headerRight: () => (
          <CheckPermission requiredPermission={["menu:delete"]}>
            <FontAwesome6
              name="trash-alt"
              size={24}
              color={theme.secondary}
              onPress={async () => {
                if (id && id !== "new") {
                  await triggerHapticFeedback();
                  await deleteMenu(id);
                  navigation.goBack();
                }
              }}
              style={{ marginRight: 16 }}
            />
          </CheckPermission>
        ),
      });
    }
  }, [navigation, theme.primary, id, deleteMenu]);

  const handleSave = async () => {
    const errors = {
      name: !(menuItem.name as string).trim(), // Check if the name is empty
      price: Number(menuItem.price) <= 0, // Check if the price is greater than 0
      ingredients: (menuItem.RawMaterial_MenuItems || []).length === 0, // Check if there's at least one ingredient
    };

    setValidationErrors(errors);

    if (Object.values(errors).some((error) => error)) {
      return;
    }

    const changedFieldsCount = Object.keys(changedFields).length;

    if (changedFieldsCount === 0) {
    } else {
      const updatedFields = Object.keys(changedFields).reduce((acc, field) => {
        acc[field] = menuItem[field];
        return acc;
      }, {} as Partial<MenuModel>);
      if (id !== "new") {
        // Update user logic here

        await updateMenu(menuItem);
      } else {
        // Create new user logic here
        await createMenu(updatedFields);
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

      // Validate the field dynamically
      setValidationErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        if (field === "name") {
          newErrors.name = !value.trim(); // Name cannot be empty
        }
        if (field === "price") {
          newErrors.price = value <= 0; // Price must be greater than 0
        }
        return newErrors;
      });

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
        id={id}
        categories={menuItem.category || []}
        ingredients={menuItem.RawMaterial_MenuItems || []}
        onAddCategory={(category) => {
          handleChange("category", [...(menuItem.category || []), category]);
        }}
        onDeleteCategory={(category) => {
          handleChange(
            "category",
            (menuItem.category || []).filter((cat) => cat !== category)
          );
        }}
        onAddIngredient={(ingredient) => {
          handleChange("RawMaterial_MenuItems", [
            ...(menuItem.RawMaterial_MenuItems || []),
            ingredient,
          ]);
        }}
        onDeleteIngredient={(id) => {
          handleChange(
            "RawMaterial_MenuItems",
            (menuItem.RawMaterial_MenuItems || []).filter(
              (item) => item.RawMaterial.id !== id
            )
          );
        }}
        onUpdateIngredientQuantity={(id, quantity) => {
          handleChange(
            "RawMaterial_MenuItems",
            (menuItem.RawMaterial_MenuItems || []).map((item) =>
              item.RawMaterial.id === id ? { ...item, quantity } : item
            )
          );
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
      error={error}
    >
      {isLoading ? (
        <LoadingPage />
      ) : (
        <View style={styles.container}>
          <View>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.primary }]}>
                Menu Info
              </Text>
              <CheckPermission
                requiredPermission={[
                  id !== "new" ? "menu:update" : "menu:create",
                ]}
                showIfNotPermitted
              >
                <TextInput
                  style={{ marginBottom: 10 }}
                  label="Name"
                  value={menuItem.name}
                  onChangeText={(text) => handleChange("name", text)}
                  clearTextOnFocus={false}
                  selectTextOnFocus={false}
                  isHighlighted={validationErrors.name}
                  maxLength={50}
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
                  isHighlighted={validationErrors.price}
                />
              </CheckPermission>
            </View>

            <View style={{ minHeight: "63%" }}>{memoizedMenuTabView}</View>
          </View>

          <View
            style={[
              styles.buttonContainer,
              { backgroundColor: theme.background },
            ]}
          >
            <Button title="Cancel" onPress={() => navigation.goBack()} />
            <CheckPermission
              requiredPermission={[
                id !== "new" ? "menu:update" : "menu:create",
              ]}
            >
              <Button
                title={id !== "new" ? "Save" : "Create"}
                onPress={handleSave}
              />
            </CheckPermission>
          </View>
        </View>
      )}
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
    position: "absolute",
    width: "100%",
    bottom: 0,
    alignSelf: "center",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
    color: "red",
  },
});
