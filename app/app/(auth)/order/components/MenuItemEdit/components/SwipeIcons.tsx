import { useThemeColor } from "@/hooks/useThemeColor";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert, Pressable, StyleSheet, View, Platform } from "react-native";
import { Menu } from "../../../new-order";
import type { CartItem, ICartActions } from "@/types/cartReducer.types";
import { updateStock, useStockContext } from "@/utils/menu";
import { useState } from "react";
import Dialog from "react-native-dialog";
import React from "react";

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

  const { stock, setStock } = useStockContext();

  const [visible, setVisible] = useState(false);
  const [note, setNote] = useState(cartItem.note || "");

  function handleDeleteInstance() {
    cartActions.deleteInstance(cartItem);

    rowMap[cartItem.cartItemId!].closeRow();

    updateStock(cartItem, stock, setStock, false, cartItem.quantity);
  }

  const noteTitle = "Note";
  const noteMessage = "Add a note to this item";

  function addNote() {
    if (Platform.OS === "ios") {
      Alert.prompt(
        noteTitle,
        noteMessage,
        handleNoteChange,
        "plain-text",
        cartItem?.note
      );
    } else {
      setVisible(true);
    }
  }

  function handleNoteChange(note: string) {
    cartActions.updateItem({
      cartItemId: cartItem.cartItemId,
      note: note,
    });
  }

  return (
    <>
      {Platform.OS !== "ios" && (
        <Dialog.Container visible={visible}>
          <Dialog.Title>{noteTitle}</Dialog.Title>
          <Dialog.Description>{noteMessage}</Dialog.Description>
          <Dialog.Input
            placeholder="Enter note"
            defaultValue={cartItem?.note}
            onChangeText={setNote}
          />
          <Dialog.Button label="Cancel" onPress={() => setVisible(false)} />
          <Dialog.Button label="OK" onPress={() => handleNoteChange(note)} />
        </Dialog.Container>
      )}
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
          onPress={addNote}
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
          onPress={handleDeleteInstance}
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
    </>
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
