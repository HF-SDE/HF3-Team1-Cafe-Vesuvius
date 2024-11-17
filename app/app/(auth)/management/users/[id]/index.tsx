import { StyleSheet, View, Text, TextInput, Button, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { useUsers } from "@/hooks/useUsers"; // Assuming you have a hook for user management
import TemplateLayout from "@/components/TemplateLayout";
import { useLocalSearchParams, Link } from "expo-router";

export default function EditCreateUserPage() {
  const route = useRoute();
  const { id } = useLocalSearchParams();

  const { users, updateUser, createUser } = useUsers();

  // Find user by ID if editing
  const user = users?.find((user) => user.id === id) || {
    name: "",
    email: "",
  };

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  useEffect(() => {
    if (id) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [id]);

  const handleSave = () => {
    if (id) {
      updateUser(id, { name, email });
      Alert.alert("User updated successfully");
    } else {
      createUser({ name, email });
      Alert.alert("User created successfully");
    }
  };

  return (
    <TemplateLayout
      pageName="ManagmentPage"
      title={id !== "new" ? "Edit User" : "Create User"}
      buttonTitle="Cancel"
    >
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />

        <Button title={id !== "new" ? "Save" : "Create"} onPress={handleSave} />
        <View style={styles.navigationButton}>
          <Link
            href={`/management/users/${id}/permissions`}
            style={styles.link}
          >
            <Text style={styles.linkText}>Go to Permissions</Text>
          </Link>
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
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
  },
  navigationButton: {
    marginTop: 20,
  },
  link: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
  },
  linkText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
});
