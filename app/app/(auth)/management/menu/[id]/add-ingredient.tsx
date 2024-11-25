import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { RawMaterial_MenuItems } from "../../../../../models/MenuModel";
import { StockItemModel } from "../../../../../models/StorageModel";
import { useStock } from "@/hooks/useStock";
import { useThemeColor } from "@/hooks/useThemeColor";
import SearchBar from "@/components/SearchBar";
import { SafeAreaView } from "react-native-safe-area-context";

interface AddIngredientModalProps {
  onClose: () => void;
  onAddIngredient: (ingredient: RawMaterial_MenuItems) => void;
  themeColors: { primary: string; text: string };
}

const AddIngredientModal: React.FC<AddIngredientModalProps> = ({
  onClose,
  onAddIngredient,
  themeColors,
}) => {
  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");
  const AccentColor = useThemeColor({}, "accent");

  const [searchQuery, setSearchQuery] = useState("");

  const { stock, isLoading, error, updateStock } = useStock();

  const filteredStock = stock
    ? stock.filter((stockItem) =>
        (stockItem.name || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectItem = (item: StockItemModel) => {
    const selectedIngredient: RawMaterial_MenuItems = {
      id: `${Date.now()}`,
      quantity: 1, // Use the quantity from input
      RawMaterial: item,
    };
    onAddIngredient(selectedIngredient);
    onClose(); // Close modal after selection
  };

  const renderItem = ({ item }: { item: StockItemModel }) => (
    <TouchableOpacity
      style={[styles.itemContainer, { borderColor: PrimaryColor }]}
      onPress={() => handleSelectItem(item)}
    >
      <Text style={[styles.itemText, { color: TextColor }]}>
        {item.name} ({item.unit})
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: BackgroundColor }]}
    >
      <View style={[styles.modalContent]}>
        <Text style={[styles.title, { color: TextColor }]}>
          Add New Ingredient
        </Text>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search for menu"
        />

        <FlatList
          data={filteredStock}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={styles.ingredientList}
        />

        <View style={styles.modalButtonContainer}>
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: PrimaryColor }]}
            onPress={onClose}
          >
            <Text style={[styles.modalButtonText, { color: BackgroundColor }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    gap: 10,
    height: "100%",
    borderRadius: 10,
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
  ingredientList: {
    minHeight: "100%",
  },
});

export default AddIngredientModal;
