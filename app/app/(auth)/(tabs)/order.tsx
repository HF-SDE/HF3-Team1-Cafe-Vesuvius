import { StyleSheet, FlatList, TouchableOpacity, View, SafeAreaView  } from "react-native";
import { Text } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useState } from "react";
import { useRouter } from "expo-router";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';



interface OrderItem {
  id: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
}

const sampleOrders: OrderItem[] = [
  { id: '1', items: [{ name: 'Coffee', quantity: 2, price: 3.5 }], total: 7.0 },
  { id: '2', items: [{ name: 'Tea', quantity: 1, price: 2.5 }], total: 2.5 },
  { id: '3', items: [{ name: 'Sandwich', quantity: 3, price: 5.0 }], total: 15.0 },
  { id: '4', items: [{ name: 'Juice', quantity: 1, price: 4.0 }], total: 4.0 },
  { id: '5', items: [{ name: 'Salad', quantity: 1, price: 6.5 }], total: 6.5 },
  { id: '6', items: [{ name: 'Burger', quantity: 2, price: 8.0 }], total: 16.0 },
  { id: '7', items: [{ name: 'Fries', quantity: 3, price: 3.0 }], total: 9.0 },
  { id: '8', items: [{ name: 'Smoothie', quantity: 2, price: 5.5 }], total: 11.0 },
  { id: '9', items: [{ name: 'Pizza', quantity: 1, price: 12.0 }], total: 12.0 },
  { id: '10', items: [{ name: 'Water', quantity: 5, price: 1.0 }], total: 5.0 },
  { id: '11', items: [{ name: 'Soda', quantity: 2, price: 2.5 }], total: 5.0 },
  { id: '12', items: [{ name: 'Pasta', quantity: 1, price: 9.0 }], total: 9.0 },
  { id: '13', items: [{ name: 'Cake', quantity: 2, price: 4.5 }], total: 9.0 },
  { id: '14', items: [{ name: 'Muffin', quantity: 3, price: 2.0 }], total: 6.0 },
  { id: '15', items: [{ name: 'Burrito', quantity: 1, price: 7.5 }], total: 7.5 },
  { id: '16', items: [{ name: 'Tacos', quantity: 2, price: 3.0 }], total: 6.0 },
  { id: '17', items: [{ name: 'Quesadilla', quantity: 1, price: 6.0 }], total: 6.0 },
  { id: '18', items: [{ name: 'Waffle', quantity: 2, price: 4.0 }], total: 8.0 },
  { id: '19', items: [{ name: 'Donut', quantity: 4, price: 1.5 }], total: 6.0 },
  { id: '20', items: [{ name: 'Ice Cream', quantity: 1, price: 3.0 }], total: 3.0 },
  { id: '21', items: [{ name: 'Bagel', quantity: 2, price: 2.0 }], total: 4.0 },
  { id: '22', items: [{ name: 'Falafel', quantity: 3, price: 2.5 }], total: 7.5 },
  { id: '23', items: [{ name: 'Sushi', quantity: 5, price: 2.0 }], total: 10.0 },
  { id: '24', items: [{ name: 'Noodles', quantity: 1, price: 5.0 }], total: 5.0 },
  { id: '25', items: [{ name: 'Ramen', quantity: 2, price: 6.5 }], total: 13.0 },
  { id: '26', items: [{ name: 'Steak', quantity: 1, price: 15.0 }], total: 15.0 },
  { id: '27', items: [{ name: 'Fish', quantity: 2, price: 9.0 }], total: 18.0 },
  { id: '28', items: [{ name: 'Chicken Wings', quantity: 6, price: 1.5 }], total: 9.0 },
  { id: '29', items: [{ name: 'Pancakes', quantity: 3, price: 3.5 }], total: 10.5 },
  { id: '30', items: [{ name: 'Hot Dog', quantity: 2, price: 3.0 }], total: 6.0 },
];


export default function OrderOverview() {
  const router = useRouter();
  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");
  const AccentColor = useThemeColor({}, "accent");

  const [orders, setOrders] = useState<OrderItem[]>(sampleOrders);

  const handleAddOrder = () => {
    router.push("/order/add-order");
  };

  const renderOrderItem = ({ item }: { item: OrderItem }) => (
    <View style={styles.orderItem}>
      <Text style={[styles.orderText, { color: TextColor }]}>
        Order #{item.id}: {item.items.map(i => `${i.quantity} x ${i.name}`).join(', ')} - Total: ${item.total.toFixed(2)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView  style={[styles.container, { backgroundColor: SecondaryColor }]}>
      <Text style={[styles.title, { color: TextColor }]}>Order Overview</Text>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        style={styles.orderList}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity style={[styles.addButton, { backgroundColor: PrimaryColor}]} onPress={handleAddOrder}>
        <FontAwesome6 name="plus" size={60} color={SecondaryColor } />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
    justifyContent: 'center',
    alignItems: 'center',
    
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
  },
});