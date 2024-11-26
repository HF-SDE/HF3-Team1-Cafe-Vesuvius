import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ListRenderItemInfo,
  Modal,
} from "react-native";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";

import { RelativePathString } from "expo-router";
import { RowMap, SwipeListView } from "react-native-swipe-list-view";

import { useThemeColor } from "@/hooks/useThemeColor";
import { useStock } from "@/hooks/useStock";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import SearchBar from "@/components/SearchBar";
import AddButton from "@/components/AddButton";
import SaveResetButton from "@/components/SaveResetButton";
import TemplateLayout from "@/components/TemplateLayout";
import CheckPermission from "@/components/CheckPermission";

import { StockItemModel } from "../../../../models/StorageModel";

import { PermissionManager } from "@/utils/permissionManager";

import EditCreateStockModal from "./create-edit-stock";

export default function ManageUsersPage() {
  const { stock, isLoading, error, updateStock } = useStock();
  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");
  const AccentColor = useThemeColor({}, "accent");

  const [searchQuery, setSearchQuery] = useState("");
  const [quantities, setQuantities] = useState<Record<string, string>>({});

  const [canDelete, setCanDelete] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemInModal, setItemInModal] = useState<StockItemModel | undefined>(
    undefined
  );

  useEffect(() => {
    const checkPermissions = async () => {
      const permissionMan = new PermissionManager();
      await permissionMan.init();

      // Check permissions for left and right swipe
      setCanDelete(permissionMan.hasAllPermissions(["stock:delete"]));
      setCanEdit(permissionMan.hasAllPermissions(["stock:update"]));
    };

    checkPermissions();
  }, []);

  const handleAddEditStockItem = useCallback(
    async (id?: string) => {
      if (!stock || stock.length === 0) {
        console.error("Stock data is not loaded yet.");
        return;
      }

      const itemToShow = id ? stock.find((item) => item.id === id) : undefined;

      setItemInModal(itemToShow);
      setIsModalVisible(true);
    },
    [stock] // Ensure the callback updates if stock changes
  );

  const handleDeleteStockItem = useCallback(() => {}, []);

  const handleSaveStockItems = useCallback(() => {
    if (hasChanges) {
      const changedStock: StockItemModel[] = Object.keys(quantities)
        .map((itemId) => {
          const adjustedQty = quantities[itemId];
          if (!stock) return null;
          const item = stock.find((item) => item.id === itemId);
          if (item && adjustedQty !== "0") {
            const quantity = (item.quantity || 0) + Number(adjustedQty);
            return { id: item.id, quantity };
          }
          return null;
        })
        .filter((item) => item !== null);
      updateStock(changedStock);
      resetChanges();
    }
  }, [quantities, stock]);

  const resetChanges = useCallback(() => {
    setQuantities({});
  }, []);

  const handleIncrease = useCallback((itemId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: ((Number(prev[itemId]) || 0) + 1).toString(),
    }));
  }, []);

  const handleDecrease = useCallback(
    (itemId: string) => {
      const item = stock?.find((item) => item.id === itemId);

      setQuantities((prev) => ({
        ...prev,
        [itemId]: (
          Number(
            Math.max(
              Number(prev[itemId]) || 0,
              item ? Number(item.quantity) * -1 || 0 : 0
            )
          ) - 1
        ).toString(),
      }));
    },
    [stock]
  );

  const handleQuantityChange = useCallback(
    (itemId: string, text: string) => {
      if (text === "-" || text === "0-") {
        setQuantities((prev) => ({ ...prev, [itemId]: "-" }));
        return;
      }
      if (text === "") {
        setQuantities((prev) => ({ ...prev, [itemId]: "0" }));
        return;
      }

      const parsedValue = parseInt(text, 10);
      if (isNaN(parsedValue)) {
        setQuantities((prev) => ({ ...prev, [itemId]: "0" }));
        return;
      }

      if (!stock) {
        return;
      }

      const item = stock.find((item) => item.id === itemId);
      if (!item || !item.quantity) return;

      const clampedValue = Math.min(
        Math.max(parsedValue, -item.quantity),
        9999
      );
      setQuantities((prev) => ({ ...prev, [itemId]: clampedValue.toString() }));
    },
    [stock]
  );

  const filteredUsers = useMemo(() => {
    return stock
      ? stock.filter((user) =>
          user.name
            ?.toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : [];
  }, [stock, searchQuery]);

  const renderItem = useCallback(
    ({ item }: { item: StockItemModel }) => {
      const adjustedQty = quantities[item.id as string]
        ? quantities[item.id as string].toString()
        : "0";
      const newStock = (item.quantity || 0) + Number(adjustedQty);

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
          <CheckPermission requiredPermission={["stock:update"]}>
            <View style={styles.inputContainer}>
              <View style={styles.itemRow}>
                <TouchableOpacity
                  onPress={() => handleDecrease(item.id as string)}
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
                  onChangeText={(text) =>
                    handleQuantityChange(item.id as string, text)
                  }
                />
                <TouchableOpacity
                  onPress={() => handleIncrease(item.id as string)}
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
                      newStock !== item.quantity
                        ? SecondaryColor
                        : "transparent",
                    visibility:
                      newStock !== item.quantity ? "visible" : "hidden",
                  },
                ]}
              >
                New stock: {newStock} {item.unit}
              </Text>
            </View>
          </CheckPermission>
        </View>
      );
    },
    [quantities, PrimaryColor, BackgroundColor, SecondaryColor]
  );

  const renderHiddenItem = (
    data: ListRenderItemInfo<any>,
    rowMap: RowMap<any>
  ) => {
    // rowMap[data.item.id] = rowMap[data.item.id] || data.item.id;

    return (
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
          onPress={() => {
            handleAddEditStockItem(data.item.id);
            // Close the row after clicking the edit button
            if (rowMap[data.item.id]) {
              rowMap[data.item.id].closeRow();
            }
          }}
        >
          <FontAwesome6
            name="edit"
            style={styles.iconStyle}
            size={36}
            color="white"
          />
        </TouchableOpacity>
      </View>
    );
  };

  const hasChanges = useMemo(
    () => Object.values(quantities).some((value) => value !== "0"),
    [quantities]
  );

  const animationIsRunning = useRef(false);

  const onSwipeValueChange = (swipeData: any) => {
    const { key, value, setValue } = swipeData;

    if (value <= -150 && !animationIsRunning.current) {
      animationIsRunning.current = true;

      //handleAddEditStockItem(key);

      animationIsRunning.current = false;
    }
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
          <SwipeListView
            data={filteredUsers}
            renderItem={renderItem}
            renderHiddenItem={(data, rowMap) => renderHiddenItem(data, rowMap)}
            leftOpenValue={100}
            rightOpenValue={-100}
            stopLeftSwipe={150}
            stopRightSwipe={-150}
            disableLeftSwipe={!canEdit}
            disableRightSwipe={!canDelete}
            keyExtractor={(item) => item.id as string}
            contentContainerStyle={styles.userList}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            onSwipeValueChange={onSwipeValueChange}
            onRowOpen={(rowKey, rowMap) => {
              console.log(`Row opened: ${rowKey}`);
              if (rowMap[rowKey]) {
                rowMap[rowKey].closeRow();
              }
              handleAddEditStockItem(rowKey);
            }}
          />
        )}
        {!hasChanges && (
          <AddButton
            onPress={() => handleAddEditStockItem()}
            requiredPermission={["stock:create"]}
          />
        )}
        {hasChanges && (
          <SaveResetButton
            requiredPermission={["stock:update"]}
            onPressSave={handleSaveStockItems}
            onPressReset={resetChanges}
          />
        )}
      </View>
      <Modal
        animationType="none"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)} // Close modal on Android back button
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { backgroundColor: PrimaryColor }]}
          >
            <EditCreateStockModal
              stockItem={itemInModal}
              onClose={() => setIsModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
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
    height: 100,
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
    height: 100,
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

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,

    padding: 10,
    borderRadius: 10,
  },
});
