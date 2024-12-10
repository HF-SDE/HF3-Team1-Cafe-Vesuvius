import { useThemeColor } from "@/hooks/useThemeColor";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MenuItemEdit from "./MenuItemEdit";
import { useState } from "react";
import { CartItem, ICartActions } from "@/types/cartReducer.types";
import { Menu } from "../new-order";

interface IMenuItem {
  menuItem: Menu;
  cartActions: ICartActions<Menu>;
}

export default function MenuItem({ menuItem, cartActions }: IMenuItem) {
  const theme = useThemeColor();

  const [showModal, setShowModal] = useState(false);

  function addNote() {
    if (!cartActions.getCartItemQuantity(menuItem)) return;

    setShowModal(true);
  }

  function getImage() {
    const images = require.context(
      "../../../../assets/images/menu",
      true,
      /\.webp$/
    );

    const image = images(`./${menuItem.name}.webp`);

    return image;
  }

  const image = getImage();

  const cartItem = cartActions.getCartItems(menuItem.id)[0];

  return (
    <View>
      <TouchableOpacity
        onPress={() =>
          cartActions.addItem({
            cartItemId: cartItem?.cartItemId,
            item: menuItem,
            id: menuItem.id,
          })
        }
        onLongPress={() => addNote()}
      >
        <Image source={image} style={[styles.image]} />

        <Text
          style={[
            styles.itemName,
            { color: theme.text, backgroundColor: theme.accent },
          ]}
        >
          {menuItem.name}
        </Text>

        {cartActions.getCartItemQuantity(menuItem) > 0 && (
          <View style={[styles.quantity, { backgroundColor: theme.orange }]}>
            <Text
              style={{
                color: theme.background,
                fontSize: 20,
                padding: 5,
              }}
            >
              {cartActions.getCartItemQuantity(menuItem)}
            </Text>
          </View>
        )}

        <MenuItemEdit
          show={showModal}
          setShow={setShowModal}
          menuItem={menuItem}
          cartItems={cartActions.getCartItems(menuItem)}
          cartActions={cartActions}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 180,
    aspectRatio: 1,
    borderWidth: 2,
    borderRadius: 10,
  },
  itemName: {
    fontSize: 16,
    position: "absolute",
    bottom: 5,
    alignSelf: "center",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 2,
  },
  quantity: {
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 20,
    borderWidth: 2,
    aspectRatio: 1,
  },
});
