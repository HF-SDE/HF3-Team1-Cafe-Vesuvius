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
    route: "/management/users",
    icon: "users",
    size: 48,
  }, // Example MaterialIcons name
  {
    title: "Menu",
    pageName: "MenuPage",
    route: "management/menu",
    icon: "table-list",
    size: 62,
  },
  {
    title: "Stats",
    pageName: "StatsPage",
    route: "/management/statistics",
    icon: "chart-simple",
    size: 62,
  },
  {
    title: "Storage",
    pageName: "StockPage",
    route: "/management/storage",
    icon: "warehouse",
    size: 48,
  },
];

export default function ManagementScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");
  const AccentColor = useThemeColor({}, "accent");

  return (
    <TemplateLayout pageName="ManagementPage">
      <View style={styles.content}>
        {buttonList.map((button, index) => (
          <CheckPageAccess pageName={button.pageName}>
            <TouchableOpacity
              key={index}
              style={[styles.button, { backgroundColor: PrimaryColor }]}
              onPress={() => router.navigate(button.route)}
            >
              <View style={styles.buttonContent}>
                {button.icon && (
                  <FontAwesome6
                    name={button.icon}
                    size={button.size}
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
    width: 70,
    marginRight: 20,
    justifyContent: "center",
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 50,
    fontWeight: "bold",
    flex: 1,
  },
});
