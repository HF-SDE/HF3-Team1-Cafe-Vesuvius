import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInputChangeEventData,
  View,
} from "react-native";
import { useState, useEffect } from "react";
import { useStock } from "@/hooks/useStock";
import TemplateLayout from "@/components/TemplateLayout";
import { useLocalSearchParams } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import Button from "@/components/DefaultButton";
import TextInput from "@/components/TextInput";
import QuantityInput from "@/components/QuantityInput";

import { useNavigation } from "@react-navigation/native";
import { StockItemModel } from "../../../../../models/StorageModel";

import { FontAwesome6 } from "@expo/vector-icons"; // Import FontAwesome6 icons
import InputSpinner from "react-native-input-spinner";

export default function EditCreateUserPage() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");

  const { stock, isLoading, error, updateStock, createStock } = useStock(
    id as string
  );

  const [stockItem, setStockItem] = useState<StockItemModel>({
    id: (id as string) || "",
    name: "",
    unit: "",
    quantity: 0,
    quantityToAdd: 0,
  });

  const [changedFields, setChangedFields] = useState<{ [key: string]: any }>(
    {}
  );

  useEffect(() => {
    if (stock) {
      const foundStockItem = stock[0];

      if (id && foundStockItem) {
        setStockItem(foundStockItem);
      }
    }
  }, [id, stock]);

  const handleSave = () => {
    const changedFieldsCount = Object.keys(changedFields).length;

    if (changedFieldsCount === 0) {
      console.log("No changes");

      navigation.goBack();
    } else {
      console.log("Update/Create");

      if (id !== "new") {
        // Update user logic here
        const updatedFields = { id: stockItem.id, ...changedFields };
        updateStock(updatedFields);
      } else {
        const updatedFields: StockItemModel = { ...changedFields };
        createStock(updatedFields);
        // Create new user logic here
      }
      setChangedFields({});
      navigation.goBack();
    }
  };

  const handleChange = (field: string, value) => {
    if (value !== changedFields[field]) {
      const origValue = stockItem[field] || "";
      setChangedFields((prev) => ({
        ...prev,
        [field]: origValue,
      }));
    } else {
      // If the value is changed back to original, remove from changedFields
      const updatedChangedFields = { ...changedFields };
      delete updatedChangedFields[field];
      setChangedFields(updatedChangedFields);
    }

    setStockItem((prevUser) => ({
      ...prevUser,
      [field]: value,
    }));
  };
  const quantityChange = (itemId: string, newQty: number) => {
    const updatedStockItem = { ...stockItem, quantityToAdd: newQty };
    setStockItem(updatedStockItem);
  };

  return (
    <TemplateLayout
      pageName="StockPage"
      title={id !== "new" ? "Edit Stock Item" : "Create Stock Item"}
      buttonTitle="Cancel"
    >
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          label="Name"
          value={stockItem.name}
          onChangeText={(value) => handleChange("name", value)}
          clearTextOnFocus={false}
        />

        {/* Use InputSpinner with custom icon buttons */}
        <InputSpinner
          step={1}
          color={SecondaryColor}
          textColor="white"
          value={stockItem.quantity}
          onChange={(num) => handleChange("quantity", num)}
          leftButton={
            <FontAwesome6
              name="square-minus"
              size={30}
              color={SecondaryColor}
            />
          }
          rightButton={
            <FontAwesome6 name="square-plus" size={30} color={SecondaryColor} />
          }
          buttonStyle={{
            borderRadius: 10,
            borderWidth: 3,
            backgroundColor: "transparent",
            borderColor: SecondaryColor,
            padding: 5,
          }}
          buttonTextColor={SecondaryColor}
          buttonFontSize={40}
          style={styles.spinner} // Apply compact styling here
        >
          <View>
            <Text>{stockItem.unit}</Text>
          </View>
        </InputSpinner>

        <TextInput
          style={styles.input}
          label="Unit"
          value={stockItem.unit}
          onChangeText={(value) => handleChange("unit", value)}
          clearTextOnFocus={false}
        />

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
  },
  input: {
    height: 40,
    marginBottom: 15,
  },
  spinner: {
    height: 50, // Adjust height for compactness
    marginBottom: 15,
    alignSelf: "flex-start",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
