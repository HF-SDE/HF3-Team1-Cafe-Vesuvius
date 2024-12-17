import React, { useState } from "react";
import { StyleSheet, FlatList, SafeAreaView, Text } from "react-native";
import { useRouter } from "expo-router";
import TemplateLayout from "@/components/TemplateLayout";
import AddButton from "@/components/AddButton";
import { useData } from "@/hooks/useData";
import OrderCard from "@/components/OrderCard";
import SearchBar from "@/components/SearchBar";
import { OrderModel } from "@/models/OrderModel";
import LoadingPage from "@/components/LoadingPage";

export default function OrderOverview() {
  const router = useRouter();

  const [orders, setOrders, isLoading] = useData<OrderModel>("/order");

  const [searchQuery, setSearchQuery] = useState("");

  const handleAddOrder = () => {
    router.push("/order/new-order");
  };

  function filterOrders(orders: OrderModel[]) {
    orders = orders.filter(
      ({ Order_Menus: OM }) => !OM.every(({ status }) => status === "completed")
    );

    return orders.filter(
      (order) =>
        order.Order_Menus.some(
          ({ Menu }) =>
            Menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            Menu.category
              .join("")
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        ) || order.Table.number.toString() === searchQuery
    );
  }

  return (
    <TemplateLayout pageName="OrderPage">
      <SafeAreaView style={[styles.container]}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        {isLoading && <LoadingPage />}
        {!isLoading && orders.length === 0 && <Text>No orders found</Text>}
        {!isLoading && orders.length > 0 && (
          <FlatList
            data={filterOrders(orders)}
            renderItem={({ item }) => <OrderCard order={item} />}
            keyExtractor={(item) => item.id}
            style={styles.orderList}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 22 }}
          />
        )}
        <AddButton
          onPress={handleAddOrder}
          requiredPermission={["order:create"]}
        />
      </SafeAreaView>
    </TemplateLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  orderList: {
    flex: 1,
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
