import React, { useEffect, useState, useLayoutEffect } from "react";
import { StyleSheet, SafeAreaView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { PermissionManager } from "@/utils/permissionManager";

type TemplateLayoutProps = {
  children: React.ReactNode; // Content to render within the template
  pageName: string; // Page name for permission checking
  title?: string; // Optional title to display
};

const TemplateLayout: React.FC<TemplateLayoutProps> = ({
  children,
  pageName,
  title,
}) => {
  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");
  const navigation = useNavigation();

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title,
      headerBackTitle: "Back",
      headerTitleAlign: "center",
      headerStyle: { backgroundColor: PrimaryColor },
      headerTintColor: BackgroundColor,
    });
  }, [navigation, title]);

  useEffect(() => {
    const checkPermission = async () => {
      const permissionManager = new PermissionManager();
      await permissionManager.init();

      const accessGranted = await permissionManager.hasPageAccess(pageName);
      setHasAccess(accessGranted);

      if (!accessGranted) {
        router.replace("/"); // Redirect if access is denied
      }
    };

    checkPermission();
  }, [pageName]);

  if (hasAccess === null) {
    return null; // Or a loading spinner
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: BackgroundColor, borderColor: BackgroundColor },
      ]}
    >
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TemplateLayout;
