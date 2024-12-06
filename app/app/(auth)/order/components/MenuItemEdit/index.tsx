import { useThemeColor } from "@/hooks/useThemeColor";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import FooterButtons from "../FooterButtons";
import { CartItem } from "@/reducers/cartReducer";
import { TextInput } from "react-native-paper";
import { useEffect, useState } from "react";
import { Menu } from "../../new-order";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { SwipeListView } from "react-native-swipe-list-view";
import SwipeRow from "./components/SwipeRow";
import SwipeIcons from "./components/SwipeIcons";
import { ICartActions } from "@/actions/cartActions";

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
            renderHiddenItem={(data, rowMap) => (
              <SwipeIcons
                cartActions={cartActions}
                rowMap={rowMap}
                cartItem={data?.item}
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
          }}
          onPress={() => {
            cartActions.addInstance({ id: menuItem.id, item: menuItem });
          }}
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
