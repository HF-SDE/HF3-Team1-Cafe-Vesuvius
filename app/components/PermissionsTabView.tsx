// PermissionsTabView.tsx
import React, { useState } from "react";
import { StyleSheet, View, Text, FlatList, Dimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Switch from "@/components/Switch";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Permission } from "@/models/PermissionModel";
import CheckPermission from "@/components/CheckPermission";

interface PermissionsTabViewProps {
  id: string | undefined;
  permissions: Permission[];
  userPermissions: Permission[];
  onPermissionToggle?: (permissionId: string, isEnabled: boolean) => void;
}

const PermissionsTabView: React.FC<PermissionsTabViewProps> = ({
  id,
  permissions,
  userPermissions,
  onPermissionToggle,
}) => {
  const [index, setIndex] = useState(0);

  const theme = useThemeColor();

  // Define categories based on permission prefixes
  const categories = Array.from(
    new Set(permissions.map((permission) => permission.code.split(":")[0]))
  )
    .map((key) => ({
      key,
      title: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize category names
    }))
    .sort((a, b) => a.key.localeCompare(b.key));

  const renderPermissionsForCategory = (category: string) => {
    const filteredPermissions = permissions.filter((permission) =>
      permission.code.startsWith(category + ":")
    );

    return (
      <FlatList
        data={filteredPermissions}
        keyExtractor={(item) => item.permissionId}
        renderItem={renderPermissionItem}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  const renderPermissionItem = ({ item }: { item: Permission }) => {
    const isActive = userPermissions.some(
      (permission) => permission.permissionId === item.permissionId
    );
    return (
      <View
        style={[styles.permissionItem, { borderBottomColor: theme.primary }]}
      >
        <Text style={[styles.permissionDescription, { color: theme.text }]}>
          {item.description}
        </Text>
        <CheckPermission
          requiredPermission={[
            id !== "new"
              ? "administrator:users:update"
              : "administrator:users:create",
          ]}
          showIfNotPermitted
        >
          <Switch
            value={isActive}
            onValueChange={(newValue) =>
              onPermissionToggle?.(item.permissionId, newValue)
            }
          />
        </CheckPermission>
      </View>
    );
  };

  const renderScene = categories.reduce((scenes, category) => {
    scenes[category.key] = () => renderPermissionsForCategory(category.key);
    return scenes;
  }, {} as { [key: string]: () => React.ReactNode });

  if (!permissions || !userPermissions || permissions.length === 0) {
    return <Text>Loading</Text>;
  }

  return (
    <TabView
      navigationState={{ index, routes: categories }}
      renderScene={SceneMap(renderScene)}
      onIndexChange={setIndex}
      initialLayout={{ width: Dimensions.get("window").width }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={[
            styles.tabIndicator,
            { backgroundColor: theme.primary },
          ]}
          style={[styles.tabBar, { backgroundColor: theme.accent }]}
          labelStyle={[styles.tabLabel, { color: theme.text }]}
          scrollEnabled={true}
          activeColor={theme.text}
          inactiveColor={theme.primary}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  permissionItem: {
    padding: 10,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  permissionDescription: {
    fontSize: 14,
  },
  tabBar: {
    borderRadius: 5,
    elevation: 0,
  },
  tabIndicator: {
    height: 3,
  },
  tabLabel: {
    fontSize: 14,
  },
});

export default PermissionsTabView;
