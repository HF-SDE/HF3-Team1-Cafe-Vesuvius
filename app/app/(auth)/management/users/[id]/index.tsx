import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
  FlatList,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { useUsers } from "@/hooks/useUsers"; // Assuming you have a hook for user management
import { usePermissions } from "@/hooks/usePermissions";
import TemplateLayout from "@/components/TemplateLayout";
import { useLocalSearchParams } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import Button from "@/components/DefaultButton";

import Switch from "@/components/Switch";

export default function EditCreateUserPage() {
  const route = useRoute();
  const { id } = useLocalSearchParams();

  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");

  const { users, isLoading, error } = useUsers(id as string);
  const { permissions } = usePermissions();

  const [user, setUser] = useState({
    username: "",
    name: "",
    email: "",
    initials: "",
    active: true,
    permissions: [] as { code: string; description: string }[], // Add permissions to state
  });

  useEffect(() => {
    if (users) {
      const foundUser = users[0] || {
        username: "",
        name: "",
        email: "",
        initials: "",
        active: true,
        permissions: [], // Default empty permissions
      };

      if (id && foundUser) {
        setUser({
          ...foundUser, // Spread the found user's data
        });
      }
    }
  }, [id, users]);

  const handleSave = () => {
    if (id) {
      // Update user logic here
      Alert.alert("User updated successfully");
    } else {
      // Create new user logic here
      Alert.alert("User created successfully");
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setUser((prevUser) => ({
      ...prevUser,
      [field]: value,
    }));
  };

  const handlePermissionToggle = (
    permissionCode: string,
    isEnabled: boolean
  ) => {
    setUser((prevUser) => {
      const updatedPermissions = isEnabled
        ? [...prevUser.permissions, { code: permissionCode, description: "" }]
        : prevUser.permissions.filter(
            (permission) => permission.code !== permissionCode
          );
      return { ...prevUser, permissions: updatedPermissions };
    });
  };

  // Render permission item
  const renderPermissionItem = ({
    item,
  }: {
    item: { code: string; description: string };
  }) => {
    const isActive = user.permissions.some(
      (permission) => permission.code === item.code
    );
    return (
      <View style={styles.permissionItem}>
        <Text style={styles.permissionDescription}>{item.description}</Text>
        <Switch
          value={isActive}
          onValueChange={(newValue) =>
            handlePermissionToggle(item.code, newValue)
          }
        />
      </View>
    );
  };

  return (
    <TemplateLayout
      pageName="ManagementPage"
      title={id !== "new" ? "Edit User" : "Create User"}
      buttonTitle="Cancel"
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={user.username}
            onChangeText={(value) => handleChange("username", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={user.name}
            onChangeText={(value) => handleChange("name", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={user.email}
            onChangeText={(value) => handleChange("email", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Initials"
            value={user.initials}
            onChangeText={(value) => handleChange("initials", value)}
          />
          <Switch
            onValueChange={(newValue) => handleChange("active", newValue)}
            value={user.active}
          />
          <View style={styles.permissionsContainer}>
            <Text style={styles.permissionsTitle}>Permissions</Text>
            {isLoading ? (
              <Text>Loading...</Text>
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              <FlatList
                data={permissions}
                keyExtractor={(item) => item.code}
                renderItem={renderPermissionItem}
              />
            )}
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button title="Cancel" onPress={handleSave} />
          <Button
            title={id !== "new" ? "Save" : "Create"}
            onPress={handleSave}
          />
        </View>
      </View>
    </TemplateLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
  },
  permissionsContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  permissionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  permissionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  permissionDescription: {
    marginTop: 5,
    fontSize: 14,
    color: "#555",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
});
