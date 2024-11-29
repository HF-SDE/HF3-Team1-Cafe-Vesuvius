import React from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { OrderModel } from "@/models/OrderModel";
import { Pressable, Text, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface OrderCardProps {
  order: OrderModel;
}

export default function OrderCard({ order }: OrderCardProps) {
  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");

  const statusColors = {
    cook: "#007FFF",
    deliver: "orange",
    completed: "green",
  };

  return (
    <Pressable
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: PrimaryColor,
        paddingVertical: 20,
        borderRadius: 20,
        gap: 12,
      }}
    >
      <Text
        style={{
          color: BackgroundColor,
          fontSize: 38,
          fontWeight: "bold",
        }}
      >
        Table {order.Table.number}
      </Text>

      {order.Order_Menus.map((orderMenu) => (
        <View
          key={orderMenu.id}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 10,
            backgroundColor: BackgroundColor,
            borderRadius: 50,
            width: "90%",
          }}
        >
          <Text
            style={{ color: TextColor, fontSize: 19, paddingHorizontal: 5 }}
          >
            {orderMenu.Menu.name} x {orderMenu.quantity}
          </Text>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 5,
            }}
          >
            {orderMenu.note && (
              <MaterialCommunityIcons
                name="note-text-outline"
                size={28}
                color="black"
              />
            )}

            <View
              style={{
                width: 30,
                aspectRatio: 1,
                borderRadius: 1000000,
                backgroundColor:
                  statusColors[orderMenu.status as keyof typeof statusColors],
              }}
            />
          </View>
        </View>
      ))}
    </Pressable>
  );
}
