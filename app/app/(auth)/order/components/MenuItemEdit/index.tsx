import { useThemeColor } from "@/hooks/useThemeColor";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import FooterButtons from "../FooterButtons";
import { Menu } from "../../new-order";
import { SwipeListView } from "react-native-swipe-list-view";
import SwipeRow from "./components/SwipeRow";
import SwipeIcons from "./components/SwipeIcons";
import type { CartItem, ICartActions } from "@/types/cartReducer.types";
import { canBeMade, updateStock, useStockContext } from "@/utils/menu";

interface INoteModal {
  show: boolean;
  setShow: (show: boolean) => void;
  menuItem: Menu;
  cartItems: CartItem<Menu>[];
  cartActions: ICartActions<Menu>;
}

export default function MenuItemEditModal({
  show,
  setShow,
  menuItem,
  cartItems,
  cartActions,
}: INoteModal) {
  const theme = useThemeColor();

  const { stock, setStock } = useStockContext();

  const cantBeMade = !canBeMade(menuItem, stock);

  function handleAddInstance() {
    if (cantBeMade) return;

    const addItem = { id: menuItem.id, item: menuItem, quantity: 1 };

    cartActions.addInstance(addItem);

    updateStock(addItem, stock, setStock);
  }

  function handleCancel() {
    setShow(false);
  }

  function handleConfirm() {
    setShow(false);
  }

  return (
    <Modal
      animationType="slide"
      visible={show}
      presentationStyle="formSheet"
      onDismiss={() => setShow(false)}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View>
          <Text style={[styles.h1, { color: theme.text }]}>
            {menuItem?.name}
          </Text>
        </View>

        <View
          style={{
            width: "100%",
            height: 1,
            backgroundColor: theme.text,
            marginVertical: 14,
          }}
        />

        <View>
          <SwipeListView
            data={cartItems}
            keyExtractor={({ cartItemId }) => cartItemId!}
            contentContainerStyle={{ gap: 10 }}
            renderHiddenItem={({ item }, rowMap) => (
              <SwipeIcons
                cartActions={cartActions}
                rowMap={rowMap}
                cartItem={item}
              />
            )}
            renderItem={({ item: cartItem }) => (
              <SwipeRow cartItem={cartItem} cartActions={cartActions} />
            )}
            leftOpenValue={75}
            rightOpenValue={-75}
            stopLeftSwipe={100}
            stopRightSwipe={-100}
          />
        </View>

        <Pressable
          style={{
            height: 60,
            width: "70%",
            backgroundColor: theme.primary,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            marginTop: 20,
            position: "absolute",
            bottom: 110,
            opacity: cantBeMade ? 0.5 : 1,
          }}
          onPress={handleAddInstance}
          disabled={cantBeMade}
        >
          <Text
            style={{
              color: theme.background,
              fontSize: 20,
            }}
          >
            Add instance
          </Text>
        </Pressable>

        <FooterButtons
          confirmText="Save"
          cancelText="Close"
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    display: "flex",
  },
  h1: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    width: "50%",
  },
  button: {
    flex: 1,
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 50,
    margin: 5,
  },
});
