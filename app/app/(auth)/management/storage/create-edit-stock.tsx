import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  Text,
  Platform,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { useThemeColor } from "@/hooks/useThemeColor";
import Button from "@/components/DefaultButton";
import TextInput from "@/components/TextInput";

import { StockItemModel } from "@/models/StorageModel";

import InputSpinner from "react-native-input-spinner";

import {
  triggerHapticFeedback,
  ImpactFeedbackStyle,
} from "@/utils/hapticFeedback";

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
  const theme = useThemeColor();

  const [stockItem, setStockItem] = useState<StockItemModel>(
    propStockItem || {
      id: undefined,
      name: "",
      unit: "",
      quantity: 0,
    }
  );

  const [validationErrors, setValidationErrors] = useState({
    name: false,
    unit: false,
  });

  const [changedFields, setChangedFields] = useState<{ [key: string]: any }>(
    {}
  );

  const handleSave = () => {
    const errors = {
      name: !(stockItem.name as string).trim(), // Check if the name is empty
      unit: !(stockItem.unit as string).trim(), // Check if the price is greater than 0
    };

    setValidationErrors(errors);
    if (errors.name || errors.unit) {
      return;
    }

    const changedFieldsCount = Object.keys(changedFields).length;

    if (changedFieldsCount === 0) {
    } else {
      if (stockItem.id) {
        const updatedFields: StockItemModel = {
          id: stockItem.id,
          ...changedFields,
        };
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
    setValidationErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (field === "name") {
        newErrors.name = !value.trim();
      }
      if (field === "unit") {
        newErrors.unit = !value.trim();
      }
      return newErrors;
    });
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
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Text style={[styles.title, { color: theme.text }]}>
        {stockItem.id ? "Edit item" : "Create new item"}
      </Text>

      <TextInput
        style={styles.input}
        label="Name"
        value={stockItem.name}
        onChangeText={(value) => handleChange("name", value)}
        clearTextOnFocus={false}
        isHighlighted={validationErrors.name}
      />

      <TextInput
        style={styles.input}
        label="Unit"
        value={stockItem.unit}
        onChangeText={(value) => handleChange("unit", value)}
        clearTextOnFocus={false}
        isHighlighted={validationErrors.unit}
      />

      <InputSpinner
        type="float"
        decimalSeparator="."
        step={1}
        color={"transparent"}
        textColor={theme.primary}
        value={stockItem.quantity}
        onChange={quantityChange}
        inputStyle={{ borderColor: theme.primary }}
        fontSize={20}
        buttonStyle={{
          backgroundColor: "transparent",
        }}
        buttonTextColor={theme.primary}
        buttonFontSize={40}
        style={styles.spinner}
        buttonRightImage={
          <FontAwesome6 name="square-plus" size={50} color={theme.primary} />
        }
        buttonLeftImage={
          <FontAwesome6 name="square-minus" size={50} color={theme.primary} />
        }
        onIncrease={async () => {
          await triggerHapticFeedback();
        }}
        onDecrease={async () => {
          await triggerHapticFeedback();
        }}
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Cancel"
          onPress={onClose}
          backgroundColor={theme.accent}
          textColor={theme.text}
        />
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    marginBottom: 15,
  },
  spinner: {
    height: 50,
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
  errorMessage: {
    marginVertical: 10,
    textAlign: "center",
  },
  errorText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
  },
});

export default EditCreateUserPage;
