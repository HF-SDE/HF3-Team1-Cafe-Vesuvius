import React, { useEffect, useState } from "react";

import { Tabs } from "expo-router";

import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { useThemeColor } from "@/hooks/useThemeColor";

import { PermissionManager } from "@/utils/permissionManager";

export default function TabLayout() {
  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");
  const AccentColor = useThemeColor({}, "accent");

  const [hasOrderPermission, setHasOrderPermission] = useState(false);
  const [hasReservationPermission, setHasReservationPermission] =
    useState(false);
  const [hasManagementPermission, setHasManagementPermission] = useState(false);

  useEffect(() => {
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
    };

    checkPermissions();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: PrimaryColor,
          height: 88,
          paddingTop: 10,
          borderTopWidth: 0,
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          overflow: "hidden",
        },
        headerStyle: {
          backgroundColor: PrimaryColor,
          elevation: 0,
        },
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
                style={{ color: focused ? AccentColor : SecondaryColor }}
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
                style={{ color: focused ? AccentColor : SecondaryColor }}
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
                style={{ color: focused ? AccentColor : SecondaryColor }}
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
              style={{ color: focused ? AccentColor : SecondaryColor }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
