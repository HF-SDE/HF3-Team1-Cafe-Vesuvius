import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInputChangeEventData,
  View,
} from "react-native";
import { useState, useEffect } from "react";
import { useStock } from "@/hooks/useStock";
import { useLocalSearchParams } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import Button from "@/components/DefaultButton";
import TextInput from "@/components/TextInput";
import QuantityInput from "@/components/QuantityInput";

import { useNavigation } from "@react-navigation/native";
import { StockItemModel } from "../../../../models/StorageModel";

import { FontAwesome6 } from "@expo/vector-icons"; // Import FontAwesome6 icons
import InputSpinner from "react-native-input-spinner";
import { SafeAreaView } from "react-native-safe-area-context";

interface EditCreateUserPageProps {
  onClose: () => void;
  stockItem: StockItemModel | undefined; // If undefined create a new empty one
}

const EditCreateUserPage: React.FC<EditCreateUserPageProps> = ({
  onClose,
  stockItem: propStockItem,
}) => {
  const navigation = useNavigation();

  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");

  const { updateStock, createStock } = useStock(); // Assuming `stock` is fetched from useStock hook

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
      navigation.goBack();
    } else {
      console.log("Update/Create");

      if (id !== "new") {
        const updatedFields = { id: stockItem.id, ...changedFields };
        updateStock(updatedFields);
      } else {
        const updatedFields: StockItemModel = { ...changedFields };
        createStock(updatedFields);
      }

      setChangedFields({});
      navigation.goBack();
    }
  };

  const handleChange = (field: string, value: any) => {
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
    <SafeAreaView>
      <View style={[styles.container, { backgroundColor: BackgroundColor }]}>
        <TextInput
          style={styles.input}
          label="Name"
          value={stockItem.name}
          onChangeText={(value) => handleChange("name", value)}
          clearTextOnFocus={false}
        />

        <InputSpinner
          step={1}
          color={PrimaryColor}
          textColor={PrimaryColor}
          value={stockItem.quantity}
          onChange={quantityChange}
          leftButton={<FontAwesome6 name="square-minus" size={30} />}
          rightButton={<FontAwesome6 name="square-plus" size={30} />}
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
          <Button title="Cancel" onPress={onClose} />
          <Button
            title={stockItem.id ? "Save" : "Create"}
            onPress={handleSave}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

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
