import { StyleSheet, View, Text, TextInput, Button, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { useUsers } from "@/hooks/useUsers"; // Assuming you have a hook for user management
import TemplateLayout from "@/components/TemplateLayout";

export default function EditCreateUserPage() {
  const { params } = useRoute();
  const { id: userId } = params || {}; // Get the userId from the query params
  const navigation = useNavigation();
  const { users, updateUser, createUser } = useUsers();

  // Find user by ID if editing
  const user = users?.find((user) => user.id === userId) || {
    name: "",
    email: "",
  };

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  useEffect(() => {
    if (userId) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [userId]);

  const handleSave = () => {
    if (userId) {
      updateUser(userId, { name, email });
      Alert.alert("User updated successfully");
    } else {
      createUser({ name, email });
      Alert.alert("User created successfully");
    }
    navigation.goBack(); // Navigate back after saving
  };

  return (
    <TemplateLayout
      pageName="ManagmentPage"
      title={userId ? "Edit User" : "Create User"}
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

        <Button title={userId ? "Save" : "Create"} onPress={handleSave} />
      </View>
    </TemplateLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
  },
});
