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
        <TextInput
          style={styles.input}
          label="Quantity"
          value={(
            stockItem.quantity + (stockItem.quantityToAdd || 0)
          ).toString()}
          //onChangeText={(value) => handleChange("quantity", value)}
          clearTextOnFocus={false}
          inputMode="numeric"
        />
        <Text>Quantity</Text>
        <QuantityInput
          itemId={stockItem.id as string}
          initialQty={stockItem.quantity as number}
          onQuantityChange={quantityChange}
        />
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
  scrollViewContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  input: {
    height: 40,
    marginBottom: 15,
  },
  initialsInput: {
    maxWidth: "50%",
  },
  permissionsContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  permissionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  permissionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  permissionDescription: {
    marginTop: 5,
    fontSize: 14,
    color: "#555",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  initialsActiveContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  activeSwitchContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    alignSelf: "center",
  },
});
