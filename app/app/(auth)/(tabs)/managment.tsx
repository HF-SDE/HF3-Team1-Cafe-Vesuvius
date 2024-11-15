import React from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import TemplateLayout from "@/components/TemplateLayout";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons"; // Replace with your preferred icon library
import CheckPageAccess from "@/components/CheckPageAccess";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";

// Define your button data here
const buttonList = [
  {
    title: "Users",
    pageName: "UsersPage",
    route: "/managment/users",
    icon: "users",
  }, // Example MaterialIcons name
  {
    title: "Menú",
    pageName: "MenuPage",
    route: "/managment/menu",
    icon: "table-list",
  },
  {
    title: "Stats",
    pageName: "StatsPage",
    route: "/managment/statistics",
    icon: "chart-simple",
  },
  {
    title: "Storage",
    pageName: "StockPage",
    route: "/managment/storage",
    icon: "warehouse",
  },
];

export default function ManagmentScreen() {
  const router = useRouter();

  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");
  const AccentColor = useThemeColor({}, "accent");

  return (
    <TemplateLayout pageName="ManagmentPage">
      <View style={styles.content}>
        {buttonList.map((button, index) => (
          <CheckPageAccess pageName={button.pageName}>
            <TouchableOpacity
              key={index}
              style={[styles.button, { backgroundColor: PrimaryColor }]}
              onPress={() => router.push(button.route)}
            >
              <View style={styles.buttonContent}>
                {button.icon && (
                  <FontAwesome6
                    name={button.icon}
                    size={50}
                    color={BackgroundColor}
                    style={styles.icon}
                  />
                )}
                <Text style={[styles.buttonText, { color: BackgroundColor }]}>
                  {button.title}
                </Text>
              </View>
            </TouchableOpacity>
          </CheckPageAccess>
        ))}
      </View>
    </TemplateLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "stretch",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  icon: {
    marginRight: 20,
    width: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 50,
    fontWeight: "bold",
    flex: 1,
  },
});
