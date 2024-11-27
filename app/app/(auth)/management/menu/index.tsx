import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";

import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { useThemeColor } from "@/hooks/useThemeColor";
import { useMenu } from "@/hooks/useMenu";

import TemplateLayout from "@/components/TemplateLayout";
import AddButton from "@/components/AddButton";
import SearchBar from "@/components/SearchBar";
import LoadingPage from "@/components/LoadingPage";

import { MenuModel } from "@/models/MenuModel";

export default function ManageUsersPage() {
  const { menu, isLoading, error } = useMenu();
  const BackgroundColor = useThemeColor({}, "background");
  const TextColor = useThemeColor({}, "text");
  const PrimaryColor = useThemeColor({}, "primary");
  const SecondaryColor = useThemeColor({}, "secondary");

  const [searchQuery, setSearchQuery] = useState("");

  const handleAddUser = () => {
    // Navigate to the edit/create user page (replace with your navigation logic)
    router.navigate("/management/menu/new");
  };

  // Filter users based on the search query (case-insensitive)
  const filteredUsers = menu
    ? menu.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleUserPress = (userId: string) => {
    // Navigate to the edit/create page for a specific user
    router.navigate(`/management/menu/${userId}`);
  };

  const renderItem = ({ item }: { item: MenuModel }) => (
    <TouchableOpacity onPress={() => handleUserPress(item.id)}>
      <View style={[styles.userItem, { backgroundColor: PrimaryColor }]}>
        <View>
          <Text style={[styles.ItemName, { color: BackgroundColor }]}>
            {item.name}
          </Text>
          <Text style={[styles.itemPrice, { color: SecondaryColor }]}>
            {item.price},-
          </Text>
        </View>
        <FontAwesome6 name="edit" size={48} color={SecondaryColor} />
      </View>
    </TouchableOpacity>
  );

  return (
    <TemplateLayout pageName="MenuPage" title="Menu">
      <View style={[styles.container, { backgroundColor: BackgroundColor }]}>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search for menu"
        />
        {/* Use the SearchBar component */}
        {isLoading ? (
          <LoadingPage />
        ) : error ? (
          <Text style={[styles.errorText, { color: TextColor }]}>{error}</Text>
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
    borderRadius: 10,
    marginBottom: 15,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ItemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemPrice: {
    fontSize: 14,
    marginTop: 5,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
    color: "red",
  },
});
