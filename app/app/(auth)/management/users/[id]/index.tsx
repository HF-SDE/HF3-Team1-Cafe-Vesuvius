import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  FlatList,
  ScrollView,
} from "react-native";

import { useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";

import { useUsers } from "@/hooks/useUsers";
import { usePermissions } from "@/hooks/usePermissions";
import { useThemeColor } from "@/hooks/useThemeColor";

import TemplateLayout from "@/components/TemplateLayout";
import Button from "@/components/DefaultButton";
import TextInput from "@/components/TextInput";
import Switch from "@/components/Switch";
import PermissionsTabView from "@/components/PermissionsTabView";

import { UserProfile } from "@/models/userModels";

export default function EditCreateUserPage() {
  const { id } = useLocalSearchParams();

  const navigation = useNavigation();

  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");

  const { users, isLoading, error, updateUser, createUser } = useUsers(
    id as string
  );
  const { permissions } = usePermissions();

  const [user, setUser] = useState<UserProfile>({
    id: "",
    username: "",
    name: "",
    email: "",
    initials: "",
    active: true,
    permissions: [] as { code: string; description: string }[],
  });

  const [changedFields, setChangedFields] = useState<{ [key: string]: any }>(
    {}
  );

  useEffect(() => {
    if (users) {
      const foundUser = users[0];

      if (id && foundUser) {
        setUser(foundUser);
      }
    }
  }, [id, users]);

  const handleSave = () => {
    const changedFieldsCount = Object.keys(changedFields).length;

    if (changedFieldsCount === 0) {
      console.log("No changes");

      navigation.goBack();
    } else {
      console.log("Update/Create");

      if (id) {
        // Update user logic here
        updateUser(user);
        console.log(changedFields);
      } else {
        // Create new user logic here
      }
    }
  };

  const handleChange = (field: keyof UserProfile, value: string | boolean) => {
    if (value !== changedFields[field]) {
      const origValue = user[field] || "";
      setChangedFields((prev) => ({
        ...prev,
        [field]: origValue,
      }));
    } else {
      // If the value is changed back to original, remove from changedFields
      const updatedChangedFields = { ...changedFields };
      delete updatedChangedFields[field];
      setChangedFields(updatedChangedFields);
    }

    setUser((prevUser) => ({
      ...prevUser,
      [field]: value,
    }));
  };

  const handlePermissionToggle = (
    permissionCode: string,
    isEnabled: boolean
  ) => {
    if (isEnabled !== changedFields[permissionCode]) {
      const origValue = user.permissions.some(
        (permission) => permission.code === permissionCode
      );
      setChangedFields((prev) => ({
        ...prev,
        [permissionCode]: origValue,
      }));
    } else {
      // If the value is changed back to original, remove from changedFields
      const updatedChangedFields = { ...changedFields };
      delete updatedChangedFields[permissionCode];
      setChangedFields(updatedChangedFields);
    }
    setUser((prevUser) => {
      const updatedPermissions = isEnabled
        ? [...prevUser.permissions, { code: permissionCode, description: "" }]
        : prevUser.permissions.filter(
            (permission) => permission.code !== permissionCode
          );
      return { ...prevUser, permissions: updatedPermissions };
    });
  };

  return (
    <TemplateLayout
      pageName="ManagementPage"
      title={id !== "new" ? "Edit User" : "Create User"}
      buttonTitle="Cancel"
    >
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          label="Username"
          value={user.username}
          onChangeText={(value) => handleChange("username", value)}
          clearTextOnFocus={false}
        />
        <TextInput
          style={styles.input}
          label="Name"
          value={user.name}
          onChangeText={(value) => handleChange("name", value)}
          clearTextOnFocus={false}
        />
        <TextInput
          style={styles.input}
          label="Email"
          value={user.email}
          onChangeText={(value) => handleChange("email", value)}
          inputMode="email"
          clearTextOnFocus={false}
        />
        <View style={styles.initialsActiveContainer}>
          <TextInput
            style={[styles.input, styles.initialsInput]}
            label="Initials"
            value={user.initials}
            onChangeText={(value) => handleChange("initials", value)}
            clearTextOnFocus={false}
          />
          <View style={styles.activeSwitchContainer}>
            <Text style={[styles.permissionsTitle, { color: TextColor }]}>
              Active
            </Text>

            <Switch
              onValueChange={(newValue) => handleChange("active", newValue)}
              value={user.active}
            />
          </View>
        </View>

        <Text style={{ color: TextColor, fontSize: 18, fontWeight: "bold" }}>
          Permissions
        </Text>

        <PermissionsTabView
          permissions={permissions ? permissions : []}
          userPermissions={user.permissions ? user.permissions : []}
          onPermissionToggle={handlePermissionToggle}
        />

        <Button title="Reset password" onPress={() => navigation.goBack()} />

        <View style={styles.buttonContainer}>
          <Button title="Cancel" onPress={() => navigation.goBack()} />

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
    paddingBottom: 100,
  },
  input: {
    height: 40,
    marginBottom: 15,
  },
  initialsInput: {
    maxWidth: "50%",
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
  },
  initialsActiveContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  activeSwitchContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    alignSelf: "center",
  },
});
