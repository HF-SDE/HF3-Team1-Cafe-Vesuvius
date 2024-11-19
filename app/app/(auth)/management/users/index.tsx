import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import TemplateLayout from "@/components/TemplateLayout";
import { useUsers } from "@/hooks/useUsers";
import AddButton from "@/components/AddButton";
import { router } from "expo-router";

export default function ManageUsersPage() {
  const { users, isLoading, error } = useUsers();
  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState("");

  const handleAddUser = () => {
    // Navigate to the edit/create user page (replace with your navigation logic)
    router.navigate("/management/users/new");
  };

  // Filter users based on the search query (case-insensitive)
  const filteredUsers = users
    ? users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleUserPress = (userId: string) => {
    // Navigate to the edit/create page for a specific user
    router.navigate(`/management/users/${userId}`);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleUserPress(item.id)}>
      <View style={[styles.userItem, { backgroundColor: PrimaryColor }]}>
        <Text style={[styles.userName, { color: SecondaryColor }]}>
          {item.name}
        </Text>
        <Text style={[styles.userEmail, { color: SecondaryColor }]}>
          {item.email}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <TemplateLayout pageName="UsersPage" title="Users">
      <View style={[styles.container, { backgroundColor: BackgroundColor }]}>
        <TextInput
          style={[
            styles.input,
            { color: TextColor, borderColor: SecondaryColor },
          ]}
          placeholder="Search users"
          placeholderTextColor={SecondaryColor}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {isLoading ? (
          <Text style={[styles.loadingText, { color: TextColor }]}>
            Loading...
          </Text>
        ) : error ? (
          <Text style={[styles.errorText, { color: TextColor }]}>
            {error.message}
          </Text>
        ) : (
          <FlatList
            data={filteredUsers}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.userList}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          />
        )}

        <AddButton
          onPress={handleAddUser}
          requiredPermission={["order:create"]}
        />
      </View>
    </TemplateLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "space-between",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  userList: {
    flexGrow: 1,
  },
  userItem: {
    padding: 15,
    borderRadius: 10, // Add rounded corners here
    marginBottom: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    marginTop: 5,
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
    color: "red",
  },
});
