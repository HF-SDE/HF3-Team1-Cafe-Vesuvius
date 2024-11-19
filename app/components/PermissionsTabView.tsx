// PermissionsTabView.tsx
import React, { useState } from "react";
import { StyleSheet, View, Text, FlatList, Dimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Switch from "@/components/Switch";

interface Permission {
  code: string;
  description: string;
}

interface PermissionsTabViewProps {
  permissions: Permission[];
  userPermissions: Permission[];
  onPermissionToggle?: (permissionCode: string, isEnabled: boolean) => void;
}

const PermissionsTabView: React.FC<PermissionsTabViewProps> = ({
  permissions,
  userPermissions,
  onPermissionToggle,
}) => {
  const [index, setIndex] = useState(0);

  // Define categories based on permission prefixes
  const categories = Array.from(
    new Set(permissions.map((permission) => permission.code.split(":")[0]))
  ).map((key) => ({
    key,
    title: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize category names
  }));

  const renderPermissionsForCategory = (category: string) => {
    const filteredPermissions = permissions.filter((permission) =>
      permission.code.startsWith(category + ":")
    );

    return (
      <FlatList
        data={filteredPermissions}
        keyExtractor={(item) => item.code}
        renderItem={renderPermissionItem}
      />
    );
  };

  const renderPermissionItem = ({ item }: { item: Permission }) => {
    const isActive = userPermissions.some(
      (permission) => permission.code === item.code
    );
    return (
      <View style={styles.permissionItem}>
        <Text style={styles.permissionDescription}>{item.description}</Text>
        <Switch
          value={isActive}
          onValueChange={(newValue) =>
            onPermissionToggle?.(item.code, newValue)
          }
        />
      </View>
    );
  };

  const renderScene2 = categories.reduce((scenes, category) => {
    scenes[category.key] = () => renderPermissionsForCategory(category.key);
    return scenes;
  }, {} as { [key: string]: () => React.ReactNode });

  const renderScene = ({
    route,
  }: {
    route: { key: string; title: string };
  }) => {
    return renderPermissionsForCategory(route.key);
  };

  return (
    <TabView
      navigationState={{ index, routes: categories }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: Dimensions.get("window").width }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={styles.tabIndicator}
          style={styles.tabBar}
          labelStyle={styles.tabLabel}
          scrollEnabled={true}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  permissionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  permissionDescription: {
    fontSize: 14,
    color: "#555",
  },
  tabBar: {
    backgroundColor: "#000",
  },
  tabIndicator: {
    backgroundColor: "#007aff",
    height: 3,
  },
  tabLabel: {
    color: "#333",
    fontSize: 14,
  },
});

export default PermissionsTabView;
