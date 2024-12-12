import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const theme = useThemeColor();

  // Define categories based on permission prefixes
  const categories = Array.from(
    new Set(
      permissions.map((permission) => (permission.code as string).split(":")[0])
    )
  )
    .map((key) => ({
      key,
      title: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize category names
    }))
    .sort((a, b) => a.key.localeCompare(b.key));

  useEffect(() => {
    if (categories.length > 0 && selectedCategory === null) {
      setSelectedCategory(categories[0].key); // Only set this if no category is selected
    }
  }, [categories, selectedCategory]);

  const renderPermissionsForCategory = (category: string) => {
    const filteredPermissions = permissions.filter((permission) =>
      (permission.code as string).startsWith(category + ":")
    );

    return (
      <View style={{}}>
        <FlatList
          data={filteredPermissions}
          keyExtractor={(item) => item.permissionId}
          renderItem={renderPermissionItem}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
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

  if (!permissions || !userPermissions || permissions.length === 0) {
    return <Text>Loading</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.key}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryItem,
              {
                borderColor: theme.primary,
                borderBottomWidth: selectedCategory === item.key ? 3 : 0,
              },
            ]}
            onPress={() =>
              setSelectedCategory(
                selectedCategory === item.key ? null : item.key
              )
            }
          >
            <Text style={[styles.categoryTitle, { color: theme.text }]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
      />
      {selectedCategory && (
        <View style={styles.permissionsContainer}>
          {renderPermissionsForCategory(selectedCategory)}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  categoryItem: {
    marginVertical: 10,

    padding: 5,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  permissionsContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
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
  headerText: {
    fontSize: 18,
    padding: 10,
    fontWeight: "bold",
  },
});

export default PermissionsTabView;
