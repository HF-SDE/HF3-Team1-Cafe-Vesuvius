import React from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import TemplateLayout from "@/components/TemplateLayout";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons"; // Replace with your preferred icon library
import CheckPageAccess from "@/components/CheckPageAccess";

// Define your button data here
const buttonList = [
  { title: "Users", pageName: "UsersPage", route: "", icon: "people" }, // Example MaterialIcons name
  { title: "Menú", pageName: "MenuPage", route: "", icon: "menu" },
  { title: "Stats", pageName: "StatsPage", route: "", icon: "bar-chart" },
  { title: "Storage", pageName: "StockPage", route: "", icon: "inventory" },
];

export default function ManagmentScreen() {
  const PrimaryColor = useThemeColor({}, "primary");
  const navigation = useNavigation();

  return (
    <TemplateLayout pageName="ManagmentPage">
      <View style={styles.content}>
        {buttonList.map((button, index) => (
          <CheckPageAccess pageName={button.pageName}>
            <TouchableOpacity
              key={index}
              style={[styles.button, { backgroundColor: PrimaryColor }]}
              //onPress={() => navigation.navigate(button.route)}
            >
              <View style={styles.buttonContent}>
                {button.icon && (
                  <MaterialIcons
                    name={button.icon}
                    size={40}
                    color="white"
                    style={styles.icon}
                  />
                )}
                <Text style={styles.buttonText}>{button.title}</Text>
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
    paddingVertical: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 40,
    fontWeight: "600",
  },
});
