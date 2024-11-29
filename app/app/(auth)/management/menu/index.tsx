import { useEffect, useState } from "react";
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
  const theme = useThemeColor();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMenu, setFilteredMenu] = useState<MenuModel[] | null>(null);

  const handleAddUser = () => {
    // Navigate to the edit/create user page (replace with your navigation logic)
    router.navigate("/management/menu/new");
  };

  const handleUserPress = (userId: string) => {
    // Navigate to the edit/create page for a specific user
    router.navigate(`/management/menu/${userId}`);
  };

  useEffect(() => {
    if (menu) {
      const lowercasedQuery = searchQuery.toLowerCase();
      if (lowercasedQuery.length > 0) {
        const results = menu.filter((item) =>
          item.name.toLowerCase().includes(lowercasedQuery)
        );
        setFilteredMenu(results);
      } else {
        setFilteredMenu(menu);
      }
    }
  }, [menu, searchQuery]);

  const renderItem = ({ item }: { item: MenuModel }) => (
    <TouchableOpacity onPress={() => handleUserPress(item.id)}>
      <View style={[styles.userItem, { backgroundColor: theme.primary }]}>
        <View>
          <Text style={[styles.ItemName, { color: theme.background }]}>
            {item.name}
          </Text>
          <Text style={[styles.itemPrice, { color: theme.secondary }]}>
            {item.price},-
          </Text>
        </View>
        <FontAwesome6 name="edit" size={48} color={theme.secondary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <TemplateLayout pageName="MenuPage" title="Menu">
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <SearchBar
          value={searchQuery}
          placeholder="Search menu items"
          loading={isLoading}
          onChange={(e) => setSearchQuery(e.nativeEvent.text)}
          onClearIconPress={() => setSearchQuery("")}
        />
        {isLoading ? (
          <LoadingPage />
        ) : error ? (
          <Text style={[styles.errorText, { color: theme.text }]}>{error}</Text>
        ) : (
          <FlatList
            data={filteredMenu}
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
