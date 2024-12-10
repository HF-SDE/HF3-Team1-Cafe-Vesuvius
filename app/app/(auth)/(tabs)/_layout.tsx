import React, { useEffect, useState } from "react";

import { Tabs } from "expo-router";

import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { useThemeColor } from "@/hooks/useThemeColor";

import { PermissionManager } from "@/utils/permissionManager";
import HeaderBackground from "@/components/HeaderBackground";
import LoadingPage from "@/components/LoadingPage";

export default function TabLayout() {
  const theme = useThemeColor();

  const [isLoading, setIsLoading] = useState(true);

  const [hasOrderPermission, setHasOrderPermission] = useState(false);
  const [hasReservationPermission, setHasReservationPermission] =
    useState(false);
  const [hasManagementPermission, setHasManagementPermission] = useState(false);

  const checkPermissions = async () => {
    const permissionMan = new PermissionManager();
    await permissionMan.init();

    const orderPermission = await permissionMan.hasPageAccess("OrderPage");
    setHasOrderPermission(orderPermission);

    const reservationPermission = await permissionMan.hasPageAccess(
      "ReservationPage"
    );
    setHasReservationPermission(reservationPermission);

    const managementPermission = await permissionMan.hasPageAccess(
      "ManagementPage"
    );
    setHasManagementPermission(managementPermission);

    setIsLoading(false);
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  if (isLoading) return <LoadingPage />;

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.primary,
          height: 88,
          paddingTop: 10,
          borderTopWidth: 0,
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          overflow: "hidden",
        },
        headerBackground: () => <HeaderBackground />,
        tabBarShowLabel: false,
        headerTitleAlign: "center",
        tabBarItemStyle: { display: "none" },
        tabBarIconStyle: {
          height: 50,
          width: 50,
        },
      }}
    >
      {hasOrderPermission && (
        <Tabs.Screen
          name="order"
          options={{
            title: "",
            headerTitle: "Order",
            headerShown: true,
            tabBarItemStyle: { display: "flex" },
            tabBarIcon: ({ focused }) => (
              <Entypo
                name="list"
                size={42}
                style={{ color: focused ? theme.accent : theme.secondary }}
              />
            ),
          }}
        />
      )}
      {hasReservationPermission && (
        <Tabs.Screen
          name="reservations"
          options={{
            title: "",
            headerTitle: "Reservations",
            headerShown: true,
            tabBarItemStyle: { display: "flex" },
            tabBarIcon: ({ focused }) => (
              <Entypo
                name="calendar"
                size={38}
                style={{ color: focused ? theme.accent : theme.secondary }}
              />
            ),
          }}
        />
      )}
      {hasManagementPermission && (
        <Tabs.Screen
          name="management"
          options={{
            title: "",
            headerTitle: "Management",
            headerShown: true,
            tabBarItemStyle: { display: "flex" },
            tabBarIcon: ({ focused }) => (
              <Entypo
                name="info-with-circle"
                size={38}
                style={{ color: focused ? theme.accent : theme.secondary }}
              />
            ),
          }}
        />
      )}
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          headerTitle: "Profile",
          headerShown: true,
          tabBarItemStyle: { display: "flex" },
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="user"
              size={38}
              style={{ color: focused ? theme.accent : theme.secondary }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
