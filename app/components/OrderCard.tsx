import React, { useEffect, useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { OrderModel } from "@/models/OrderModel";
import { Alert, AlertButton, Pressable, Text, View } from "react-native";
import { formatDistanceToNow } from "date-fns";
import { PermissionManager } from "@/utils/permissionManager";
import apiClient from "@/utils/apiClient";
import TextWithNote from "./TextWithNote";

interface OrderCardProps {
  order: OrderModel;
}

export default function OrderCard({ order }: OrderCardProps) {
  const theme = useThemeColor();

  const [isLoading, setIsLoading] = useState(true);

  const [hasDeliverPermission, setHasDeliverPermission] = useState(false);
  const [hasCompletedPermission, setHasCompletedPermission] = useState(false);

  const statusColors = {
    toPrepare: theme.blue,
    deliver: theme.orange,
    completed: theme.green,
  };

  function onOrderMenuPress(orderMenu: OrderModel["Order_Menus"]["0"]) {
    const alertButtons: AlertButton[] = [{ text: "Cancel", style: "cancel" }];

    const deliverButton = {
      text: "Deliver",
      onPress: () => {
        apiClient.put(`/order/${order.id}`, {
          items: [{ id: orderMenu.id, status: "deliver" }],
        });
      },
    };

    const completedButton = {
      text: "Completed",
      onPress: () => {
        apiClient.put(`/order/${order.id}`, {
          items: [{ id: orderMenu.id, status: "completed" }],
        });
      },
    };

    if (hasDeliverPermission === true && orderMenu.status !== "deliver") {
      alertButtons.push(deliverButton);
    }

    if (hasCompletedPermission === true && orderMenu.status !== "completed") {
      if (
        orderMenu.status === "toPrepare" &&
        !orderMenu.Menu.category.includes("Drink")
      )
        return;

      alertButtons.push(completedButton);
    }

    if (alertButtons.length === 1) return;

    Alert.alert(
      "Change status",
      "Change the status of this order",
      alertButtons,
      { cancelable: true }
    );
  }

  const checkPermissions = async () => {
    const permissionMan = new PermissionManager();
    await permissionMan.init();

    const deliverPermission = permissionMan.hasPermission(
      "order:status:update:deliver"
    );
    const completedPermission = permissionMan.hasPermission(
      "order:status:update:completed"
    );

    setHasDeliverPermission(deliverPermission);
    setHasCompletedPermission(completedPermission);

    setIsLoading(false);
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  if (isLoading) return null;

  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: theme.primary,
        paddingVertical: 20,
        borderRadius: 15,
        gap: 12,
      }}
    >
      <Text
        style={{
          color: theme.background,
          fontSize: 32,
          fontWeight: "bold",
        }}
      >
        Table {order.Table.number}
      </Text>

      {order.Order_Menus.map((orderMenu) => (
        <Pressable
          key={orderMenu.id}
          onPress={() => {
            onOrderMenuPress(orderMenu);
          }}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 7,
            backgroundColor: theme.background,
            borderRadius: 10,
            width: "90%",
          }}
        >
          <TextWithNote
            text={`${orderMenu.Menu.name} x ${orderMenu.quantity}`}
            note={orderMenu?.note}
            color={theme.text}
          />

          <View
            style={{
              width: 30,
              aspectRatio: 1,
              borderRadius: "100%",
              backgroundColor:
                statusColors[orderMenu.status as keyof typeof statusColors],
            }}
          />
        </Pressable>
      ))}

      <Text
        style={{
          color: theme.accent,
          fontSize: 14,
          fontWeight: "bold",
          alignSelf: "flex-start",
          paddingHorizontal: 20,
        }}
      >
        {formatDistanceToNow(order.createdAt)} ago
      </Text>
    </View>
  );
}
