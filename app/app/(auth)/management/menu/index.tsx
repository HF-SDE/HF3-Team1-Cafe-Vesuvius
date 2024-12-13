import { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";

import { router } from "expo-router";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { useThemeColor } from "@/hooks/useThemeColor";
import { useMenu } from "@/hooks/useMenu";

import TemplateLayout from "@/components/TemplateLayout";
import AddButton from "@/components/AddButton";
import SearchBar from "@/components/SearchBar";
import LoadingPage from "@/components/LoadingPage";

import { MenuModel } from "@/models/MenuModel";
import { triggerHapticFeedback } from "@/utils/hapticFeedback";

export default function ManageUsersPage() {
  const { menu, isLoading, error, refreshMenu } = useMenu();
  const theme = useThemeColor();
  const navigation = useNavigation();

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
    const unsubscribe = navigation.addListener("focus", () => {
      // Trigger the refetch whenever the screen comes into focus
      refreshMenu();
    });

    // Cleanup the listener
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (menu) {
      filterMenus(searchQuery);
    }
  }, [menu, searchQuery]);

  const filterMenus = (query: string) => {
    const text = query.toLowerCase();
    let filteredData = menu?.filter((item) =>
      (item.name as string).toLowerCase().includes(text)
    );

    setFilteredMenu(filteredData || []);
    setSearchQuery(query);
  };

  const renderItem = ({ item }: { item: MenuModel }) => (
    <TouchableOpacity
      onPress={() => {
        triggerHapticFeedback();
        handleUserPress(item.id as string);
      }}
    >
      <View style={[styles.userItem, { backgroundColor: theme.primary }]}>
        <View>
          <Text style={[styles.ItemName, { color: theme.background }]}>
            {item.name}
          </Text>
          <Text style={[styles.itemPrice, { color: theme.secondary }]}>
            {item.price},-
          </Text>
        </View>
        {/* <FontAwesome6 name="edit" size={48} color={theme.secondary} /> */}
      </View>
    </TouchableOpacity>
  );

  return (
    <TemplateLayout pageName="MenuPage" title="Menu" error={error}>
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
        ) : (
          <FlatList
            data={filteredMenu}
            renderItem={renderItem}
            keyExtractor={(item) => item.id as string}
            contentContainerStyle={styles.userList}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          />
        )}
        <AddButton
          onPress={handleAddUser}
          requiredPermission={["menu:create"]}
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
