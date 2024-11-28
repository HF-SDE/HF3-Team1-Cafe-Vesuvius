import { KeyboardAvoidingView, StyleSheet, View, Platform } from "react-native";
import { useState, useCallback } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import Button from "@/components/DefaultButton";
import TextInput from "@/components/TextInput";

import { useNavigation } from "@react-navigation/native";
import { StockItemModel } from "../../../../models/StorageModel";

import InputSpinner from "react-native-input-spinner";

interface EditCreateUserPageProps {
  onClose: () => void;
  stockItem: StockItemModel | undefined;
  handleUpdateStock: (updateItem: StockItemModel) => void;
  handleCreateStock: (updateItem: StockItemModel) => void;
}

const EditCreateUserPage: React.FC<EditCreateUserPageProps> = ({
  onClose,
  stockItem: propStockItem,
  handleUpdateStock,
  handleCreateStock,
}) => {
  const navigation = useNavigation();

  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");

  const [stockItem, setStockItem] = useState<StockItemModel>(
    propStockItem || {
      id: undefined,
      name: "",
      unit: "",
      quantity: 0,
    }
  );

  const [changedFields, setChangedFields] = useState<{ [key: string]: any }>(
    {}
  );

  const handleSave = () => {
    const changedFieldsCount = Object.keys(changedFields).length;

    if (changedFieldsCount === 0) {
      console.log("No changes");
    } else {
      console.log("Update/Create");

      if (stockItem.id) {
        const updatedFields = { id: stockItem.id, ...changedFields };
        handleUpdateStock(updatedFields);
      } else {
        const updatedFields: StockItemModel = { ...changedFields };
        handleCreateStock(updatedFields);
      }

      setChangedFields({});
    }
    onClose();
  };

  const handleChange = (field: keyof StockItemModel, value: string) => {
    if (value !== stockItem[field]) {
      setChangedFields((prev) => ({
        ...prev,
        [field]: value,
      }));
    } else {
      const updatedChangedFields = { ...changedFields };
      delete updatedChangedFields[field];
      setChangedFields(updatedChangedFields);
    }

    setStockItem((prevStockItem) => ({
      ...prevStockItem,
      [field]: value,
    }));
  };

  const quantityChange = (newQty: number) => {
    const updatedStockItem = { ...stockItem, quantity: newQty };
    setStockItem(updatedStockItem);
    setChangedFields((prev) => ({
      ...prev,
      quantity: newQty,
    }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: BackgroundColor }]}
    >
      <TextInput
        style={styles.input}
        label="Name"
        value={stockItem.name}
        onChangeText={(value) => handleChange("name", value)}
        clearTextOnFocus={false}
      />

      <TextInput
        style={styles.input}
        label="Unit"
        value={stockItem.unit}
        onChangeText={(value) => handleChange("unit", value)}
        clearTextOnFocus={false}
      />

      <InputSpinner
        type="float"
        decimalSeparator="."
        step={1}
        color={PrimaryColor}
        textColor={PrimaryColor}
        value={stockItem.quantity}
        onChange={quantityChange}
        inputStyle={{ borderColor: PrimaryColor }}
        fontSize={20}
        buttonStyle={{
          borderRadius: 10,
          borderWidth: 3,
          backgroundColor: "transparent",
          borderColor: PrimaryColor,
          padding: 5,
        }}
        buttonTextColor={PrimaryColor}
        buttonFontSize={40}
        style={styles.spinner} // Apply compact styling here
      ></InputSpinner>

      <View style={styles.buttonContainer}>
        <Button title="Cancel" onPress={onClose} />
        <Button title={stockItem.id ? "Save" : "Create"} onPress={handleSave} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 10,
  },
  input: {
    height: 40,
    marginBottom: 15,
  },
  spinner: {
    height: 50, // Adjust height for compactness
    marginBottom: 15,
    alignSelf: "center",
    width: "100%",
    fontSize: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default EditCreateUserPage;
