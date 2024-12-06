import { useThemeColor } from "@/hooks/useThemeColor";
import { MenuModel } from "@/models/MenuModel";
import { FontAwesome6 } from "@expo/vector-icons";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MenuItemEdit from "./MenuItemEdit";
import { useState } from "react";
import { CartItem } from "@/reducers/cartReducer";

type Menu = Required<MenuModel>;

interface IMenuItem {
  menuItem: Menu;
  cartActions: any; // TODO: Add type
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

  const cartItem = cartActions.getCartItem(menuItem.id) as CartItem<Menu>;

  return (
    <View>
      <TouchableOpacity
        onPress={() =>
          cartActions.addItem(
            cartItem
              ? { cartItemId: cartItem.cartItemId, item: menuItem }
              : { id: menuItem.id, item: menuItem }
          )
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

      {/* <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: 10,
          gap: 15,
        }}
      >
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.secondary }]}
          onPress={() => cartActions.removeItem(menuItem)}
        >
          <FontAwesome6 name="minus" size={30} color="black" />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 40,
            color: theme.background,
            textAlign: "center",
            width: 40,
          }}
        >
          {cartActions.getCartItem(menuItem)?.quantity ?? 0}
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.secondary }]}
          onPress={() => cartActions.addItem(menuItem)}
        >
          <FontAwesome6 name="plus" size={30} color="black" />
        </TouchableOpacity>
      </View> */}
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
