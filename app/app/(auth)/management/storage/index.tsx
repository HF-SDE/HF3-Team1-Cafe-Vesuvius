import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";

import { useThemeColor } from "@/hooks/useThemeColor";
import { useStock } from "@/hooks/useStock";

import { RelativePathString, router } from "expo-router";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { SwipeListView } from "react-native-swipe-list-view";

import SearchBar from "@/components/SearchBar";
import AddButton from "@/components/AddButton";
import DefaultButton from "@/components/DefaultButton";
import TemplateLayout from "@/components/TemplateLayout";
import { StockItemModel } from "../../../../models/StorageModel";

export default function ManageUsersPage() {
  const { stock, isLoading, error, updateStock } = useStock();
  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");
  const AccentColor = useThemeColor({}, "accent");

  const [searchQuery, setSearchQuery] = useState("");
  const [quantities, setQuantities] = useState({}); // Track adjustments per item

  const handleAddEditStockItem = (id?: string) => {
    const path: RelativePathString = `/management/storage/${
      id ?? "new"
    }` as RelativePathString;
    router.navigate(path);
  };

  const handleDeleteStockItem = () => {};
  const handleSaveStockItems = () => {
    if (hasChanges) {
      // Create an array of changed stock items with the id and the new quantity
      const changedStock: StockItemModel[] = Object.keys(quantities)
        .map((itemId) => {
          const adjustedQty = quantities[itemId];
          if (!stock) {
            return null;
          }
          const item = stock.find((item) => item.id === itemId);

          if (item && adjustedQty !== "0") {
            // Calculate the new quantity
            const quantity = item.quantity + Number(adjustedQty);

            return {
              id: item.id,
              quantity,
            };
          }

          return null;
        })
        .filter((item) => item !== null); // Remove null values from the array

      // Now you can use `changedStock` for your API call to update the stock
      updateStock(changedStock);
      resetChanges();
    }
  };

  const resetChanges = () => {
    setQuantities({});
  };

  const handleIncrease = (itemId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const handleDecrease = (itemId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(
        (prev[itemId] || 0) - 1,
        -stock.find((item) => item.id === itemId).quantity
      ),
    }));
  };
  const handleQuantityChange = (itemId: string, text: string) => {
    // Allow negative sign during typing but sanitize input
    if (text === "-" || text === "0-") {
      setQuantities((prev) => ({
        ...prev,
        [itemId]: "-", // Keep the placeholder as "-" or an empty string
      }));
      return;
    }
    if (text === "") {
      setQuantities((prev) => ({
        ...prev,
        [itemId]: "0", // Keep the placeholder as "-" or an empty string
      }));
      return;
    }

    const parsedValue = parseInt(text, 10);

    // Reset invalid input
    if (isNaN(parsedValue)) {
      setQuantities((prev) => ({
        ...prev,
        [itemId]: 0,
      }));
      return;
    }

    if (!stock) return;
    const item = stock.find((item) => item.id === itemId);
    if (!item) return;

    // Clamp input between -item.quantity and a reasonable maximum (e.g., 9999)
    const clampedValue = Math.min(Math.max(parsedValue, -item.quantity), 9999);
    setQuantities((prev) => ({
      ...prev,
      [itemId]: clampedValue,
    }));
  };

  const filteredUsers = stock
    ? stock.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const renderItem = ({ item }: { item: StockItemModel }) => {
    const adjustedQty: string = !isNaN(Number(quantities[item.id]))
      ? Number(quantities[item.id]).toString()
      : "0"; // Current adjustment
    const newStock = item.quantity + Number(adjustedQty); // Adjusted stock

    return (
      <View style={[styles.userItem, { backgroundColor: PrimaryColor }]}>
        <View>
          <Text style={[styles.itemName, { color: BackgroundColor }]}>
            {item.name}
          </Text>
          <Text style={[styles.itemStock, { color: SecondaryColor }]}>
            Stock: {item.quantity} {item.unit}
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.itemRow}>
            <TouchableOpacity
              style={[]}
              onPress={() => handleDecrease(item.id)}
            >
              <FontAwesome6
                name="square-minus"
                size={45}
                color={SecondaryColor}
              />
            </TouchableOpacity>

            <TextInput
              style={[
                styles.textInput,
                { color: SecondaryColor, borderColor: SecondaryColor },
              ]}
              value={adjustedQty}
              keyboardType="number-pad"
              onChangeText={(text) => handleQuantityChange(item.id, text)}
            />
            <TouchableOpacity
              style={[]}
              onPress={() => handleIncrease(item.id)}
            >
              <FontAwesome6
                name="square-plus"
                size={45}
                color={SecondaryColor}
              />
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.itemStock,
              {
                color:
                  newStock !== item.quantity ? SecondaryColor : "transparent",
                visibility: newStock !== item.quantity ? "visible" : "hidden",
              },
            ]}
          >
            New stock: {newStock} {item.unit}
          </Text>
        </View>
      </View>
    );
  };

  const hasChanges = Object.values(quantities).some((value) => value !== 0);

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
          <SwipeListView
            data={filteredUsers}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.userList}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            renderHiddenItem={(data, rowMap) => (
              <View style={styles.hiddenItemContainer}>
                <TouchableOpacity
                  style={[
                    styles.hiddenButton,
                    styles.hiddenButtonStart,
                    styles.deleteButton,
                  ]}
                  onPress={() => console.log("Delete", data.item.id)}
                >
                  <FontAwesome6
                    name="trash-alt"
                    style={styles.iconStyle}
                    size={36}
                    color="white"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.hiddenButton,
                    styles.hiddenButtonEnd,
                    styles.editButton,
                    { backgroundColor: AccentColor },
                  ]}
                  onPress={() => handleAddEditStockItem(data.item.id)}
                >
                  <FontAwesome6
                    name="edit"
                    style={styles.iconStyle}
                    size={36}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            )}
            leftOpenValue={100}
            rightOpenValue={-100}
            stopLeftSwipe={100}
            stopRightSwipe={-100}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          />
        )}
        {!hasChanges && (
          <AddButton
            onPress={() => handleAddEditStockItem()}
            requiredPermission={["order:create"]}
          />
        )}
        {hasChanges && (
          <View>
            <DefaultButton title="Save" onPress={handleSaveStockItems} />

            <DefaultButton title="Resets" onPress={resetChanges} />
          </View>
        )}
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
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemStock: {
    fontSize: 14,
    marginTop: 5,
    marginRight: 5,
    fontWeight: "bold",
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
    alignSelf: "flex-end",
  },
  itemColumn: {
    flexDirection: "column",
    alignItems: "center",
  },
  icon: {
    fontSize: 24,
    marginHorizontal: 10,
  },
  adjustedQty: {
    fontSize: 40,
    marginHorizontal: 5,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  textInput: {
    width: 60,
    height: 40,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    borderWidth: 3,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  hiddenItemContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 10,
    height: "100%",
  },
  hiddenButton: {
    width: "50%",
    height: "100%",

    justifyContent: "center",
  },
  hiddenButtonStart: {
    alignItems: "flex-start",
  },
  hiddenButtonEnd: {
    alignItems: "flex-end",
  },
  deleteButton: {
    backgroundColor: "red",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  editButton: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  iconStyle: {
    marginHorizontal: 35,
  },
});
