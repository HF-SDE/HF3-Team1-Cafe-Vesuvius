import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import TemplateLayout from "@/components/TemplateLayout";
import { useUsers } from "@/hooks/useUsers";
import AddButton from "@/components/AddButton";
import LoadingPage from "@/components/LoadingPage";
import { router } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SearchBar from "@/components/SearchBar"; // Import the SearchBar
import { UserProfile } from "@/models/userModels";

export default function ManageUsersPage() {
  const { users, isLoading, error, refreshUsers } = useUsers(); // Assume refresh is available
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const navigation = useNavigation();

  const theme = useThemeColor();

  useEffect(() => {
    if (users) {
      filterUsers(searchQuery); // Filter on initial load
    }
  }, [users]);

  const handleAddUser = () => {
    // Navigate to the edit/create user page
    router.navigate("/management/users/new");
  };

  const handleUserPress = (userId: string) => {
    router.navigate(`/management/users/${userId}`);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // Trigger the refetch whenever the screen comes into focus
      refreshUsers();
    });

    // Cleanup the listener
    return unsubscribe;
  }, [navigation]);

  const filterUsers = (query: string) => {
    const text = query.toLowerCase();
    if (text.length > 0) {
      const filteredData = users?.filter(
        (user) =>
          user.name.toLowerCase().includes(text) ||
          user.email.toLowerCase().includes(text)
      );
      setFilteredUsers(filteredData);
    } else {
      setFilteredUsers(users); // Reset to all users if query is too short
    }
    setSearchQuery(query);
  };

  const renderItem = ({ item }: { item: UserProfile }) => (
    <TouchableOpacity onPress={() => handleUserPress(item.id)}>
      <View style={[styles.userItem, { backgroundColor: theme.primary }]}>
        <View>
          <Text style={[styles.userName, { color: theme.background }]}>
            {item.name}
          </Text>
          <Text style={[styles.userEmail, { color: theme.accent }]}>
            {item.email}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          {!item.active && (
            <MaterialIcons
              name="cancel"
              size={52}
              color="red"
              style={{ paddingRight: 10 }}
            />
          )}

          <FontAwesome6 name="edit" size={48} color={theme.secondary} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <TemplateLayout pageName="UsersPage" title="Users" error={error}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <SearchBar
          value={searchQuery}
          placeholder="Search users by name or email"
          loading={isLoading}
          onChange={(e) => filterUsers(e.nativeEvent.text)} // Handles text changes
          onClearIconPress={() => filterUsers("")} // Resets on clear
        />
        {isLoading ? (
          <LoadingPage />
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
          requiredPermission={["administrator:users:create"]}
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
  userList: {
    flexGrow: 1,
  },
  userItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    marginTop: 5,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
    color: "red",
  },
  iconContainer: {
    display: "flex",
    flexDirection: "row",
  },
});
