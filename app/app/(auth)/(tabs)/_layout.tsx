import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { useThemeColor } from "@/hooks/useThemeColor";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");
  const AccentColor = useThemeColor({}, "accent");

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: PrimaryColor },
        headerStyle: { backgroundColor: PrimaryColor },
        headerTintColor: BackgroundColor,
        tabBarShowLabel: false,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
      }}
    >
      <Tabs.Screen
        name="order"
        options={{
          title: "",
          tabBarIcon: (
            {
              // color
            }
          ) => (
            <Entypo name="list" size={30} style={{ color: SecondaryColor }} />
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
          tabBarIcon: ({ color }) => (
            <Entypo
              name="calendar"
              size={30}
              style={{ color: SecondaryColor }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="managment"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Entypo
              name="info-with-circle"
              size={30}
              style={{ color: SecondaryColor }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <FontAwesome
              name="user"
              size={30}
              style={{ color: SecondaryColor }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
