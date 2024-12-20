import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  KeyboardAvoidingView,
  FlatList,
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
import CheckPermission from "@/components/CheckPermission";

import SetPasswordModal from "./set-password";

import { UserProfile } from "@/models/userModels";
import { Permission } from "@/models/PermissionModel";

import { useLogedInUser } from "@/hooks/useLogedInUser";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import { UserSchema } from "@/schemas/UserSchema";

type EditCreateUserRouteParams = {
  id: string | "new" | undefined;
};

export default function EditCreateUserPage() {
  const route =
    useRoute<RouteProp<{ params: EditCreateUserRouteParams }, "params">>();
  const { id } = route.params || { id: undefined };

  const navigation = useNavigation();

  const theme = useThemeColor();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const { users, isLoading, error, updateUser, createUser } = useUsers(
    id as string
  );
  const { permissions } = usePermissions();

  const currentUser = useLogedInUser();

  const [user, setUser] = useState<UserProfile>({
    id: "",
    username: "",
    name: "",
    email: "",
    initials: "",
    active: true,
    password: "",
    UserPermissions: [] as {
      permissionId: string;
      code: string;
      description: string;
      assignedBy: string;
    }[],
  });

  const [changedFields, setChangedFields] = useState<{ [key: string]: any }>(
    {}
  );

  useEffect(() => {
    if (users) {
      const foundUser = users[0];

      if (id && foundUser) {
        const minimalPermissions = foundUser.UserPermissions?.map(
          (permission) => ({
            permissionId: permission.permissionId,
            assignedBy: permission.assignedBy,
          })
        );

        setUser({ ...foundUser, UserPermissions: minimalPermissions });
      }
    }
  }, [id, users]);

  const isValidate = async (): Promise<boolean> => {
    // Validate user data before proceeding
    const { error } = UserSchema.validate(user, { abortEarly: false });

    if (error) {
      // Extract all error messages and show them in an alert
      const messages = error.details.map((detail) => detail.path.join("."));
      setErrorMessages(messages);

      //Alert.alert("Validation Error", errorMessages);
      console.log(error);

      return false;
    } else {
      return true;
    }
  };

  const handleSave = async () => {
    const changedFieldsCount = Object.keys(changedFields).length;

    if (changedFieldsCount === 0 && id !== "new") {
      navigation.goBack();
      return;
    }

    if (!(await isValidate())) {
      return;
    }

    try {
      if (id !== "new") {
        // Update user logic here
        await updateUser(user);
      } else {
        // Create new user logic here
        await createUser(user);
      }
      navigation.goBack();
    } catch (error) {
      //Alert.alert("Save Error", "An error occurred while saving user data.");
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

  const handlePermissionToggle = (permissionId: string, isEnabled: boolean) => {
    if (isEnabled !== changedFields[permissionId]) {
      const origValue = user.UserPermissions.some(
        (permission) => permission.permissionId === permissionId
      );
      setChangedFields((prev) => ({
        ...prev,
        [permissionId]: origValue,
      }));
    } else {
      // If the value is changed back to original, remove from changedFields
      const updatedChangedFields = { ...changedFields };
      delete updatedChangedFields[permissionId];
      setChangedFields(updatedChangedFields);
    }

    setUser((prevUser) => {
      const updatedPermissions = isEnabled
        ? [
            ...prevUser.UserPermissions,
            {
              permissionId: permissionId,
              assignedBy: currentUser ? currentUser.toString() : "unknown",
            } as Permission,
          ]
        : prevUser.UserPermissions.filter(
            (permission) => permission.permissionId !== permissionId
          );
      return { ...prevUser, UserPermissions: updatedPermissions };
    });
  };

  return (
    <TemplateLayout
      pageName="ManagementPage"
      title={id !== "new" ? "Edit User" : "Create User"}
      buttonTitle="Cancel"
      error={error}
    >
      <KeyboardAvoidingView style={styles.container}>
        {/* Field Above the FlatList */}
        <View>
          <CheckPermission
            requiredPermission={[
              id !== "new"
                ? "administrator:users:update"
                : "administrator:users:create",
            ]}
            showIfNotPermitted
          >
            <TextInput
              style={styles.input}
              label="Username"
              value={user.username}
              onChangeText={(value) => handleChange("username", value)}
              clearTextOnFocus={false}
              isHighlighted={errorMessages.includes("username")}
            />
            <TextInput
              style={styles.input}
              label="Name"
              value={user.name}
              onChangeText={(value) => handleChange("name", value)}
              clearTextOnFocus={false}
              isHighlighted={errorMessages.includes("name")}
            />
            <TextInput
              style={styles.input}
              label="Email"
              value={user.email}
              onChangeText={(value) => handleChange("email", value)}
              inputMode="email"
              clearTextOnFocus={false}
              isHighlighted={errorMessages.includes("email")}
            />
            <View style={styles.initialsActiveContainer}>
              <TextInput
                style={[styles.input, styles.initialsInput]}
                label="Initials"
                value={user.initials}
                onChangeText={(value) => handleChange("initials", value)}
                clearTextOnFocus={false}
                maxLength={4}
                isHighlighted={errorMessages.includes("initials")}
              />
              <View style={styles.activeSwitchContainer}>
                <Text style={[styles.activeLabel, { color: theme.text }]}>
                  Active
                </Text>

                <Switch
                  onValueChange={(newValue) => handleChange("active", newValue)}
                  value={user.active}
                />
              </View>
            </View>
          </CheckPermission>
          <View
            style={[
              styles.buttonContainer,
              { backgroundColor: theme.background },
            ]}
          >
            <CheckPermission
              requiredPermission={[
                id !== "new"
                  ? "administrator:users:update"
                  : "administrator:users:create",
              ]}
            >
              <Button
                title={id !== "new" ? "Reset password" : "Create password"}
                onPress={() => setIsModalVisible(true)}
                isHighlighted={errorMessages.includes("password")}
                noMargin
              />
            </CheckPermission>
          </View>
        </View>

        {/* FlatList Section */}
        <Text
          style={[
            styles.permissionsTitle,
            { color: theme.text, borderBottomColor: theme.primary },
          ]}
        >
          Permissions
        </Text>
        <PermissionsTabView
          id={id}
          permissions={permissions ? permissions : []}
          userPermissions={user.UserPermissions ? user.UserPermissions : []}
          onPermissionToggle={handlePermissionToggle}
        />

        {/* Field Below the FlatList */}
        <View style={styles.footer}>
          <Button title="Cancel" onPress={() => navigation.goBack()} />

          <CheckPermission
            requiredPermission={[
              id !== "new"
                ? "administrator:users:update"
                : "administrator:users:create",
            ]}
          >
            <Button
              title={id !== "new" ? "Save" : "Create"}
              onPress={handleSave}
            />
          </CheckPermission>
        </View>
      </KeyboardAvoidingView>
      <Modal
        animationType="none"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)} // Close modal on Android back button
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { backgroundColor: theme.primary }]}
          >
            <SetPasswordModal
              onClose={() => setIsModalVisible(false)}
              onSetPassword={(newPassword) => {
                handleChange("password", newPassword);
                setIsModalVisible(false);
                isValidate();
              }}
            />
          </View>
        </View>
      </Modal>
    </TemplateLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "space-between",
  },

  initialsInput: {
    maxWidth: "50%",
  },

  permissionsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 15,
    borderBottomWidth: 5,
    textAlign: "center",
  },

  activeLabel: {
    fontSize: 16,
    fontWeight: "bold",
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    maxWidth: 400,
    minHeight: 340,
    padding: 10,
    borderRadius: 10,
  },

  footer: {
    display: "flex",
    flexDirection: "row",
  },
  input: {
    height: 40,
    marginBottom: 15,
  },
});
