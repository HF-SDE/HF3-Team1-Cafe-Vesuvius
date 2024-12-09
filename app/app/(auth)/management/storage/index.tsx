import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ListRenderItemInfo,
  Modal,
} from "react-native";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { useThemeColor } from "@/hooks/useThemeColor";
import { useStock } from "@/hooks/useStock";

import SearchBar from "@/components/SearchBar";
import AddButton from "@/components/AddButton";
import SaveResetButton from "@/components/SaveResetButton";
import TemplateLayout from "@/components/TemplateLayout";
import CheckPermission from "@/components/CheckPermission";
import Pagination from "@/components/Pagination";
import LoadingPage from "@/components/LoadingPage";

import Alert from "@/components/Alert";

import { StockItemModel } from "@/models/StorageModel";

import { PermissionManager } from "@/utils/permissionManager";

import EditCreateStockModal from "./create-edit-stock";

import { RowMap, SwipeListView } from "react-native-swipe-list-view";

export default function ManageUsersPage() {
  const { stock, isLoading, error, updateStock, createStock, deleteStock } =
    useStock();
  const theme = useThemeColor();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [quantities, setQuantities] = useState<Record<string, string>>({});

  const [canDelete, setCanDelete] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemInModal, setItemInModal] = useState<StockItemModel | undefined>(
    undefined
  );

  const filteredStockItems = useMemo(() => {
    return stock
      ? stock.filter((user) =>
          user.name
            ?.toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : [];
  }, [stock, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredStockItems.slice(start, end);
  }, [filteredStockItems, currentPage, itemsPerPage]);

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

  const totalPages = Math.ceil(
    (filteredStockItems?.length || 0) / itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      scrollToTop();
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      scrollToTop();
    }
  };
  const scrollToTop = () => {
    //listViewRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

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
    [stock]
  );

  const handleUpdateStock = useCallback(
    (updatedItem: StockItemModel) => {
      updateStock(updatedItem);
    },
    [stock]
  );
  const handleCreateStock = useCallback(
    (createItem: StockItemModel) => {
      createStock(createItem);
    },
    [stock]
  );
  const handleDeleteStock = useCallback(
    (deleteItem: StockItemModel) => {
      Alert(
        "Confirm Deletion",
        `Are you sure you want to delete ${deleteItem.name}? \nIt will also be removed from all the menu's that uses it!`,
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {},
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              deleteStock(deleteItem);
            },
          },
        ]
      );
    },
    [stock]
  );

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
    setQuantities((prev) => {
      const currentQuantity = Number(prev[itemId]) || 0;

      const newQuantity = Math.min(currentQuantity + 1, 9999);

      return {
        ...prev,
        [itemId]: newQuantity.toString(),
      };
    });
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
              item ? Number(item.quantity) * -1 + 1 || 0 : 0
            )
          ) - 1
        ).toString(),
      }));
    },
    [stock]
  );

  const handleQuantityChange = useCallback(
    (itemId: string, text: string) => {
      text = text.replace(",", ".");
      // Check if the text already has a period or has two digits after the period

      const decimalIndex = text.indexOf(".");
      if (decimalIndex !== -1 && text.length - decimalIndex > 3) {
        // Limit to two decimals
        return;
      }
      if (text === "-" || text === "0-") {
        setQuantities((prev) => ({ ...prev, [itemId]: "-" }));
        return;
      }
      if (text === "-.") {
        setQuantities((prev) => ({ ...prev, [itemId]: "-0." }));
        return;
      }
      if (text === "") {
        setQuantities((prev) => ({ ...prev, [itemId]: "0" }));
        return;
      }
      if (text === ".") {
        setQuantities((prev) => ({ ...prev, [itemId]: "0." }));
        return;
      }
      if (text.split(".").length - 1 >= 2) {
        return;
      }

      if (text.charAt(text.length - 1) === ".") {
        setQuantities((prev) => ({ ...prev, [itemId]: text }));
        return;
      }

      const parsedValue = parseFloat(text);

      if (isNaN(parsedValue)) {
        setQuantities((prev) => ({ ...prev, [itemId]: "0" }));
        return;
      }

      const item = stock?.find((item) => item.id === itemId);

      if (!item) return;

      const clampedValue = Math.min(
        Math.max(parsedValue, -(item.quantity || 0)),
        9999
      );

      const roundedValue = Math.round(clampedValue * 100) / 100;

      setQuantities((prev) => ({ ...prev, [itemId]: roundedValue.toString() }));
    },
    [stock]
  );

  const renderItem = ({ item }: { item: StockItemModel }) => {
    const adjustedQty = quantities[item.id as string]
      ? quantities[item.id as string].toString()
      : "0";
    const newStock = (item.quantity || 0) + Number(adjustedQty);

    return (
      <View style={[styles.userItem, { backgroundColor: theme.primary }]}>
        <View>
          <Text style={[styles.itemName, { color: theme.background }]}>
            {item.name}
          </Text>
          <Text style={[styles.itemStock, { color: theme.secondary }]}>
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
                  color={theme.secondary}
                />
              </TouchableOpacity>
              <TextInput
                style={[
                  styles.textInput,
                  { color: theme.secondary, borderColor: theme.secondary },
                ]}
                value={adjustedQty}
                keyboardType="decimal-pad"
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
                  color={theme.secondary}
                />
              </TouchableOpacity>
            </View>
            <Text
              style={[
                styles.itemStock,
                {
                  color:
                    newStock !== item.quantity
                      ? theme.secondary
                      : "transparent",
                  visibility: newStock !== item.quantity ? "visible" : "hidden",
                },
              ]}
            >
              New stock: {newStock} {item.unit}
            </Text>
          </View>
        </CheckPermission>
      </View>
    );
  };

  const renderHiddenItem = (
    data: ListRenderItemInfo<any>,
    rowMap: RowMap<any>
  ) => {
    if (!stock) {
      return <Text>Loading</Text>;
    }
    return (
      <View style={styles.hiddenItemContainer}>
        <TouchableOpacity
          style={[
            styles.hiddenButton,
            styles.hiddenButtonStart,
            styles.deleteButton,
          ]}
          onPress={() => {
            handleDeleteStock(data.item);
            // Close the row after clicking the delete button
            if (rowMap[data.item.id]) {
              rowMap[data.item.id].closeRow();
            }
          }}
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
            { backgroundColor: theme.accent },
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
            color={theme.text}
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

  const onSwipeValueChange = (swipeData: any) => {};
  console.log(error);

  return (
    <TemplateLayout pageName="StockPage" title="Storage" error={error}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <SearchBar
          //searchQuery={searchQuery}
          //setSearchQuery={setSearchQuery}
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            setCurrentPage(1);
          }}
          placeholder="Search for item"
          loading={isLoading}
        />
        <View style={styles.StockPageNavigator}>
          <Text style={[styles.pageIndicator, { color: theme.text }]}>
            Page {currentPage} of {totalPages}
          </Text>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
          />
        </View>

        {isLoading ? (
          <LoadingPage />
        ) : (
          <SwipeListView
            data={paginatedData}
            renderItem={renderItem}
            renderHiddenItem={(data, rowMap) => renderHiddenItem(data, rowMap)}
            scrollsToTop={true}
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
            // onSwipeValueChange={onSwipeValueChange}
            // onRowOpen={(rowKey, rowMap) => {
            //   console.log(`Row opened: ${rowKey}`);
            //   const direction: string = rowMap[rowKey].previousTrackedDirection;
            //   if (direction === "left") {
            //     if (rowMap[rowKey]) {
            //       rowMap[rowKey].closeRow();
            //     }
            //     handleAddEditStockItem(rowKey);
            //   }
            // }}
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
            style={[styles.modalContent, { backgroundColor: theme.primary }]}
          >
            <EditCreateStockModal
              stockItem={itemInModal}
              onClose={() => setIsModalVisible(false)}
              handleUpdateStock={(updateItem) => handleUpdateStock(updateItem)}
              handleCreateStock={(updateItem) => handleCreateStock(updateItem)}
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
    padding: 0,
    margin: 0,
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
    width: "90%",
    maxWidth: 400,
    minHeight: 380,
    padding: 10,
    borderRadius: 10,
  },
  pageIndicator: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 5,
    position: "absolute",
    alignSelf: "center",
  },
  StockPageNavigator: {
    marginBottom: 15,
  },
});
