import {
  StyleSheet,
  View,
  Text,
  Alert,
  FlatList,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { useMenu } from "@/hooks/useMenu"; // Assuming you have a hook for user management
import { usePermissions } from "@/hooks/usePermissions";
import TemplateLayout from "@/components/TemplateLayout";
import { useLocalSearchParams } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import Button from "@/components/DefaultButton";
import TextInput from "@/components/TextInput";
import { useNavigation } from "@react-navigation/native";

import Switch from "@/components/Switch";

import PermissionsTabView from "@/components/PermissionsTabView";

export default function EditCreateUserPage() {
  const route = useRoute();
  const { id } = useLocalSearchParams();

  const navigation = useNavigation();

  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");

  const { menu, isLoading, error } = useMenu(id as string);
  const { permissions } = usePermissions();

  const [menuItem, setMenuItem] = useState({
    id: "",
    name: "",
    price: 0,
    category: [],
  });

  const [changedFields, setChangedFields] = useState<{ [key: string]: any }>(
    {}
  );

  useEffect(() => {
    if (menu) {
      const foundMenuItem = menu[0];

      if (id && foundMenuItem) {
        setMenuItem(foundMenuItem);
      }
    }
  }, [id, menu]);

  const handleSave = () => {
    const changedFieldsCount = Object.keys(changedFields).length;

    if (changedFieldsCount === 0) {
      console.log("No changes");

      navigation.goBack();
    } else {
      console.log("Update/Create");

      if (id) {
        // Update user logic here
        //updateUser(user);
        console.log(changedFields);
      } else {
        // Create new user logic here
      }
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    if (value !== changedFields[field]) {
      const origValue = menuItem[field] || "";
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

    setMenuItem((prevUser) => ({
      ...prevUser,
      [field]: value,
    }));
  };

  return (
    <TemplateLayout
      pageName="ManagementPage"
      title={id !== "new" ? "Edit Menu Item" : "Create Menu Item"}
      buttonTitle="Cancel"
    >
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          label="Name"
          value={menuItem.name}
          onChange={(value) => handleChange("username", value)}
          clearTextOnFocus={false}
        />
        <TextInput
          style={styles.input}
          label="Price"
          value={menuItem.price.toString()}
          onChange={(value) => handleChange("name", value)}
          clearTextOnFocus={false}
        />

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
    paddingBottom: 100, // Ensure space for buttons at the bottom
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
    // paddingTop: 20,
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
