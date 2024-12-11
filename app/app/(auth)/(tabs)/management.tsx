import React from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";

import TemplateLayout from "@/components/TemplateLayout";
import CheckPageAccess from "@/components/CheckPageAccess";

import { useThemeColor } from "@/hooks/useThemeColor";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { RelativePathString, useRouter } from "expo-router";

import {
  triggerHapticFeedback,
  ImpactFeedbackStyle,
} from "@/utils/hapticFeedback";

// Define the button to show
const buttonList = [
  {
    title: "Users",
    pageName: "UsersPage",
    route: "/management/users" as RelativePathString,
    icon: "users",
    size: 48,
  },
  {
    title: "Menu",
    pageName: "MenuPage",
    route: "management/menu" as RelativePathString,
    icon: "table-list",
    size: 62,
  },
  {
    title: "Stats",
    pageName: "StatsPage",
    route: "/management/statistics" as RelativePathString,
    icon: "chart-simple",
    size: 62,
  },
  {
    title: "Storage",
    pageName: "StockPage",
    route: "/management/storage" as RelativePathString,
    icon: "warehouse",
    size: 48,
  },
];

export default function ManagementScreen() {
  const router = useRouter();

  const theme = useThemeColor();

  return (
    <TemplateLayout pageName="ManagementPage">
      <View style={styles.content}>
        {buttonList.map((button, index) => (
          <CheckPageAccess pageName={button.pageName} key={button.pageName}>
            <TouchableOpacity
              key={index}
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={() => {
                triggerHapticFeedback();
                router.navigate(button.route);
              }}
            >
              <View style={styles.buttonContent}>
                {button.icon && (
                  <FontAwesome6
                    name={button.icon}
                    size={button.size}
                    color={theme.secondary}
                    style={styles.icon}
                  />
                )}
                <Text style={[styles.buttonText, { color: theme.secondary }]}>
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
    gap: 25,
    marginBottom: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
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
