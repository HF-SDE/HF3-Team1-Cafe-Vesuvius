import { useThemeColor } from "@/hooks/useThemeColor";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { Menu } from "../../../new-order";
import { CartItem } from "@/reducers/cartReducer";
import { ICartActions } from "@/actions/cartActions";

interface ISwipeIcons {
  cartActions: ICartActions<Menu>;
  rowMap: any;
  cartItem: CartItem<Menu>;
}

export default function SwipeIcons({
  cartActions,
  rowMap,
  cartItem,
}: ISwipeIcons) {
  const theme = useThemeColor();

  function handleNoteChange(note: string) {
    cartActions.updateItem({
      cartItemId: cartItem.cartItemId,
      note: note,
    });
  }

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        borderRadius: 10,
        width: "100%",
        margin: 0,
        height: "100%",
      }}
    >
      <Pressable
        onPress={() =>
          Alert.prompt(
            "Note",
            "Add a note to this item",
            handleNoteChange,
            "plain-text",
            cartItem?.note
          )
        }
        style={[
          styles.button,
          {
            margin: 0,
            height: "100%",
            width: "25%",
            paddingHorizontal: 24,
            backgroundColor: theme.green,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={cartItem?.note ? "note-edit" : "note-plus"}
          size={32}
          color="white"
          style={{ alignSelf: "flex-start" }}
        />
      </Pressable>

      <Pressable
        onPress={() => {
          cartActions.deleteInstance({
            cartItemId: cartItem.cartItemId,
          });

          rowMap[cartItem.cartItemId!].closeRow();
        }}
        style={[
          styles.button,
          {
            margin: 0,
            height: "100%",
            width: "25%",
            backgroundColor: theme.red,
            paddingHorizontal: 24,
          },
        ]}
      >
        <FontAwesome6
          name="trash-alt"
          size={28}
          color="white"
          style={{ alignSelf: "flex-end" }}
        />
      </Pressable>
    </View>
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
