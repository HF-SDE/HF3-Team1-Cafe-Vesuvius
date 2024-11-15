import React, { useState } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";
import { Text } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import CheckPermission from "@/components/CheckPermission";
import TemplateLayout from "@/components/TemplateLayout";

interface OrderItem {
  id: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
}

const sampleOrders: OrderItem[] = [
  { id: "1", items: [{ name: "Coffee", quantity: 2, price: 3.5 }], total: 7.0 },
  { id: "2", items: [{ name: "Tea", quantity: 1, price: 2.5 }], total: 2.5 },
  {
    id: "3",
    items: [{ name: "Sandwich", quantity: 3, price: 5.0 }],
    total: 15.0,
  },
  // Add more sample orders as needed
];

export default function OrderOverview() {
  const router = useRouter();
  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");

  const [orders, setOrders] = useState<OrderItem[]>(sampleOrders);

  const handleAddOrder = () => {
    router.push("/reservation/new-reservation");
  };

  const renderOrderItem = ({ item }: { item: OrderItem }) => (
    <View style={styles.orderItem}>
      <Text style={[styles.orderText, { color: TextColor }]}>
        Order #{item.id}:{" "}
        {item.items.map((i) => `${i.quantity} x ${i.name}`).join(", ")} - Total:
        ${item.total.toFixed(2)}
      </Text>
    </View>
  );

  return (
    <TemplateLayout pageName="ReservationPage">
      <SafeAreaView style={[styles.container]}>
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          style={styles.orderList}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
        <CheckPermission requiredPermission={["reservation:create"]}>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: PrimaryColor }]}
            onPress={handleAddOrder}
          >
            <FontAwesome6 name="plus" size={60} color={SecondaryColor} />
          </TouchableOpacity>
        </CheckPermission>
      </SafeAreaView>
    </TemplateLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  orderList: {
    flex: 1,
  },
  orderItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  orderText: {
    fontSize: 16,
  },
  addButton: {
    width: 70,
    height: 70,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
  },
});
