import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useStock } from "@/hooks/useStock";
import { useThemeColor } from "@/hooks/useThemeColor";

import SearchBar from "@/components/SearchBar";

import { RawMaterial_MenuItems } from "@/models/MenuModel";
import { StockItemModel } from "@/models/StorageModel";

import Button from "@/components/DefaultButton";

interface AddIngredientModalProps {
  onClose: () => void;
  onAddIngredient: (ingredient: RawMaterial_MenuItems) => void;
  themeColors: { primary: string; text: string };
  excitingStockItems: StockItemModel[];
}

const AddIngredientModal: React.FC<AddIngredientModalProps> = ({
  onClose,
  onAddIngredient,
  themeColors,
  excitingStockItems,
}) => {
  const theme = useThemeColor();

  const [searchQuery, setSearchQuery] = useState("");

  const { stock, isLoading, error } = useStock();

  const filteredStock = stock
    ? stock.filter(
        (stockItem) =>
          // Check if the item is not in excitingStockItems and matches the search query
          !excitingStockItems.some(
            (usedItem) => usedItem.id === stockItem.id // Assuming 'id' is unique for each stock item
          ) &&
          (stockItem.name || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectItem = (item: StockItemModel) => {
    const selectedIngredient: RawMaterial_MenuItems = {
      quantity: 1, // Use the quantity from input
      RawMaterial: item as Required<StockItemModel>,
    };
    onAddIngredient(selectedIngredient);
    onClose(); // Close modal after selection
  };

  const renderItem = ({ item }: { item: StockItemModel }) => (
    <TouchableOpacity
      style={[styles.itemContainer, { borderColor: theme.primary }]}
      onPress={() => handleSelectItem(item)}
    >
      <Text style={[styles.itemText, { color: theme.text }]}>
        {item.name} ({item.unit})
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <KeyboardAvoidingView style={styles.contentContainer}>
        {/* Field Above the FlatList */}
        <View>
          <Text style={[styles.title, { color: theme.text }]}>
            Add New Ingredient
          </Text>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for menu"
          />
        </View>

        {/* FlatList Section */}
        <FlatList
          data={filteredStock}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={styles.ingredientList}
        />

        {/* Field Below the FlatList */}
        <View style={styles.footer}>
          <Button title="Cancel" onPress={onClose} noMargin />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  modalContent: {
    width: "100%",
    height: "50%",
    minHeight: 400,
    padding: 10,
    paddingBottom: 30,
    borderRadius: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: "100%",
  },
  modalButtonText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  ingredientList: {},
  footer: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 10,
  },
});

export default AddIngredientModal;
