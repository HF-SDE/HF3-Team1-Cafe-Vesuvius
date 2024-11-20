// PermissionsTabView.tsx
import React, { useState } from "react";
import { StyleSheet, View, Text, FlatList, Dimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Switch from "@/components/Switch";
import { useThemeColor } from "@/hooks/useThemeColor";

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

  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");
  const AccentColor = useThemeColor({}, "accent");

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
        keyExtractor={(item) => item.code}
        renderItem={renderPermissionItem}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  const renderPermissionItem = ({ item }: { item: Permission }) => {
    const isActive = userPermissions.some(
      (permission) => permission.code === item.code
    );
    return (
      <View
        style={[styles.permissionItem, { borderBottomColor: PrimaryColor }]}
      >
        <Text style={[styles.permissionDescription, { color: TextColor }]}>
          {item.description}
        </Text>
        <Switch
          value={isActive}
          onValueChange={(newValue) =>
            onPermissionToggle?.(item.code, newValue)
          }
        />
      </View>
    );
  };

  const renderScene = categories.reduce((scenes, category) => {
    scenes[category.key] = () => renderPermissionsForCategory(category.key);
    return scenes;
  }, {} as { [key: string]: () => React.ReactNode });

  const renderScene1 = ({
    route,
  }: {
    route: { key: string; title: string };
  }) => {
    return renderPermissionsForCategory(route.key);
  };

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
            { backgroundColor: PrimaryColor },
          ]}
          style={[styles.tabBar, { backgroundColor: AccentColor }]}
          labelStyle={[styles.tabLabel, { color: TextColor }]}
          scrollEnabled={true}
          activeColor={TextColor}
          inactiveColor={PrimaryColor}
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
    // color: "#333",
    fontSize: 14,
  },
});

export default PermissionsTabView;
