import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable  } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { useThemeColor } from "@/hooks/useThemeColor";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
// function TabBarIcon(props: {
//   name: React.ComponentProps<typeof FontAwesome>["name"];
//   color: string;
// }) {
//   return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
// }

export default function TabLayout() {
  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");
  const AccentColor = useThemeColor({}, "accent");

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
          overflow: 'hidden',
        },

        headerStyle: { backgroundColor: PrimaryColor },
        headerTintColor: BackgroundColor,
        tabBarShowLabel: false,
        headerTitleAlign: "center",
        headerTitleStyle: { fontWeight: "bold", fontSize: 25 },
        headerShadowVisible: false,

        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
      }}
    >
      <Tabs.Screen
        name="order"
        options={{
          title: "",
          headerTitle: "Order",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="list"
              size={42}
              style={{ color: focused ? AccentColor : SecondaryColor }}
            />
          ),
          // headerRight: () => (
          //   <Link href="/modal" asChild>
          //     <Pressable>
          //       {({ pressed }) => (
          //         <FontAwesome
          //           name="info-circle"
          //           size={24}
          //           style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
          //         />
          //       )}
          //     </Pressable>
          //   </Link>
          // ),
        }}
      />
      <Tabs.Screen
        name="reservations"
        options={{
          title: "",
          headerTitle: "Reservartions",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="calendar"
              size={38}
              style={{ color: focused ? AccentColor : SecondaryColor }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="managment"
        options={{
          title: "",
          headerTitle: "Management",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="info-with-circle"
              size={38}
              style={{ color: focused ? AccentColor : SecondaryColor }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          headerTitle: "Profile",
          headerShown: false,
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
