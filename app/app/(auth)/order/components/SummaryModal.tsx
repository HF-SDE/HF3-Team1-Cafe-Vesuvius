import { useThemeColor } from "@/hooks/useThemeColor";
import { Table } from "@/models/TableModels";
import apiClient from "@/utils/apiClient";
import { useNavigation } from "expo-router";
import { Modal, StyleSheet, Text, View } from "react-native";
import FooterButtons from "./FooterButtons";
import { Menu } from "../new-order";
import type { CartItem } from "@/types/cartReducer.types";

interface IConfirmModal {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  selectedTable: Table;
  selectedMenuItems: CartItem<Menu>[];
}

export default function SummaryModal({
  showModal,
  setShowModal,
  selectedTable,
  selectedMenuItems,
}: IConfirmModal) {
  const navigation = useNavigation();
  const theme = useThemeColor();

  async function submitOrder() {
    const newOrder = {
      tableId: selectedTable?.id,
      items: selectedMenuItems.map((item) => ({
        menuItemId: item.id,
        quantity: item.quantity,
        note: item.note,
      })),
    };

    const response = await apiClient.post("/order", newOrder);

    if (response.status === 201) {
      navigation.goBack();
    } else {
      console.error("Failed to submit order");
    }
  }

  return (
    <Modal
      animationType="slide"
      visible={showModal}
      presentationStyle="formSheet"
    >
      <View
        style={[
          styles.container,
          { paddingBottom: 100, backgroundColor: theme.background },
        ]}
      >
        <View
          style={{
            backgroundColor: theme.background,
            padding: 20,
            borderRadius: 10,
          }}
        >
          <Text style={[styles.h1, { color: theme.text }]}>Order Summary</Text>
          <Text style={{ fontSize: 26, color: theme.text }}>
            Table: {selectedTable?.number}
          </Text>

          <View
            style={{
              borderBottomColor: theme.text,
              borderBottomWidth: 1,
              marginVertical: 10,
            }}
          />

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 24, color: theme.text }}>Items</Text>

            <Text style={{ fontSize: 20, color: theme.text }}>Price</Text>
          </View>
          <View style={{ gap: 10 }}>
            {selectedMenuItems.map((item, i) => (
              <View key={i}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontSize: 18, color: theme.text }}>
                    {item.quantity} x {item.item?.name}
                  </Text>

                  <Text style={{ fontSize: 16, color: theme.text }}>
                    {item.item?.price} kr.
                  </Text>
                </View>

                {item.note && (
                  <Text style={{ fontSize: 14, color: theme.text }}>
                    Note: {item.note}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>

        <Text
          style={{
            fontSize: 24,
            color: theme.text,
            textAlign: "right",
            fontWeight: "bold",
          }}
        >
          Total:{" "}
          {selectedMenuItems.reduce(
            (acc, item) => acc + item.quantity * (item.item?.price ?? 1),
            0
          )}{" "}
          kr.
        </Text>

        <FooterButtons
          cancelText="Cancel"
          confirmText="Submit"
          onCancel={() => setShowModal(false)}
          onConfirm={submitOrder}
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
    justifyContent: "space-between",
  },
  h1: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "bold",
  },
});
