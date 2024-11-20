import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import TemplateLayout from "@/components/TemplateLayout";
import { useStock } from "@/hooks/useStock";
import AddButton from "@/components/AddButton";
import { router } from "expo-router";

import SearchBar from "@/components/SearchBar";

export default function ManageUsersPage() {
  const { stock, isLoading, error } = useStock();
  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");

  const [searchQuery, setSearchQuery] = useState("");
  const [quantities, setQuantities] = useState({}); // Track adjustments per item

  const handleAddUser = () => {
    router.navigate("/management/storage/new");
  };

  const handleIncrease = (itemId) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const handleDecrease = (itemId) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(
        (prev[itemId] || 0) - 1,
        -stock.find((item) => item.id === itemId).quantity
      ),
    }));
  };

  const filteredUsers = stock
    ? stock.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const renderItem = ({ item }) => {
    const adjustedQty = quantities[item.id] || 0; // Current adjustment
    const newStock = item.quantity + adjustedQty; // Adjusted stock

    return (
      <View style={[styles.userItem, { backgroundColor: PrimaryColor }]}>
        <View style={styles.itemRow}>
          <TouchableOpacity onPress={() => handleDecrease(item.id)}>
            <Text style={[styles.icon, { color: SecondaryColor }]}>-</Text>
          </TouchableOpacity>
          <Text style={[styles.adjustedQty, { color: SecondaryColor }]}>
            {adjustedQty}
          </Text>
          <TouchableOpacity onPress={() => handleIncrease(item.id)}>
            <Text style={[styles.icon, { color: SecondaryColor }]}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.userName, { color: SecondaryColor }]}>
          {item.name}
        </Text>
        <Text style={[styles.userEmail, { color: SecondaryColor }]}>
          Current stock: {item.quantity}
        </Text>
        {newStock !== item.quantity && (
          <Text style={[styles.userEmail, { color: SecondaryColor }]}>
            New stock: {newStock}
          </Text>
        )}
      </View>
    );
  };

  return (
    <TemplateLayout pageName="StockPage" title="Storage">
      <View style={[styles.container, { backgroundColor: BackgroundColor }]}>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search for item"
        />
        {isLoading ? (
          <Text style={[styles.loadingText, { color: TextColor }]}>
            Loading...
          </Text>
        ) : error ? (
          <Text style={[styles.errorText, { color: TextColor }]}>
            Something went wrong!
          </Text>
        ) : (
          <FlatList
            data={filteredUsers}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.userList}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          />
        )}
        <AddButton
          onPress={handleAddUser}
          requiredPermission={["order:create"]}
        />
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
  userList: {
    flexGrow: 1,
  },
  userItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    marginTop: 5,
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
    color: "red",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    fontSize: 24,
    marginHorizontal: 10,
  },
  adjustedQty: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
