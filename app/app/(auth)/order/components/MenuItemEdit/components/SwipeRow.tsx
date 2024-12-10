import { useThemeColor } from "@/hooks/useThemeColor";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Menu } from "../../../new-order";
import type { CartItem, ICartActions } from "@/types/cartReducer.types";
import TextWithNote from "@/components/TextWithNote";

interface ISwipeRow {
  cartItem: CartItem<Menu>;
  cartActions: ICartActions<Menu>;
}

export default function SwipeRow({ cartItem, cartActions }: ISwipeRow) {
  const theme = useThemeColor();

  function handleNoteChange(note: string) {
    cartActions.updateItem({
      cartItemId: cartItem.cartItemId,
      note: note,
    });
  }

  return (
    <Pressable
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        borderRadius: 10,
        paddingHorizontal: 10,
        borderColor: theme.green,
        backgroundColor: theme.primary,
      }}
      onPress={() => {
        Alert.prompt(
          "Note",
          "Add a note to this item",
          handleNoteChange,
          "plain-text",
          cartItem?.note
        );
      }}
    >
      <View style={{ display: "flex", justifyContent: "center" }}>
        <TextWithNote
          text={`${cartItem.item?.name} x ${cartItem.quantity}`}
          note={cartItem?.note}
          color={theme.accent}
        />
      </View>

      <View style={[styles.buttonContainer]}>
        <Pressable
          onPress={() => {
            cartActions.removeItem({
              cartItemId: cartItem.cartItemId,
            });
          }}
          style={[styles.button, { backgroundColor: theme.accent }]}
        >
          <FontAwesome6 name="minus" size={24} color={theme.text} />
        </Pressable>

        <Pressable
          onPress={() => {
            cartActions.addItem({ cartItemId: cartItem.cartItemId });
          }}
          style={[styles.button, { backgroundColor: theme.accent }]}
        >
          <FontAwesome6 name="plus" size={24} color={theme.text} />
        </Pressable>
      </View>
    </Pressable>
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
