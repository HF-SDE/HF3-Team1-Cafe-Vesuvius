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
  visible: boolean;
  onClose: () => void;
  onAddIngredient: (ingredient: RawMaterial_MenuItems) => void;
  themeColors: { primary: string; text: string };
}

const AddIngredientModal: React.FC<AddIngredientModalProps> = ({
  visible,
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
      style={styles.itemContainer}
      onPress={() => handleSelectItem(item)}
    >
      <Text style={styles.itemText}>
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
        />

        <View style={styles.modalButtonContainer}>
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: "red" }]}
            onPress={onClose}
          >
            <Text style={styles.modalButtonText}>Cancel</Text>
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
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 10,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    height: "50%",
    minHeight: 400,
    // backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
  },
  title: {
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
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default AddIngredientModal;
