import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import TemplateLayout from "@/components/TemplateLayout";
import { useData } from "@/hooks/useData";
import { Table } from "@/models/TableModels";
import { MenuModel } from "@/models/MenuModel";
import useCart from "@/hooks/useCart";
import MenuItem from "./components/MenuItem";
import FooterButtons from "./components/FooterButtons";
import TableItem from "./components/TableItem";
import ConfirmModal from "./components/SummaryModal";

export type Menu = Required<MenuModel>;

export default function AddOrderScreen() {
  const navigation = useNavigation();
  const theme = useThemeColor();

  const [tables] = useData<Table>("/table");
  const [menuItems] = useData<Menu>("/menu");

  const [selectedTable, setSelectedTable] = useState<Table>();
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState<string>("Food");

  const [selectedMenuItems, cartActions] = useCart<Menu>();

  function toggleTable(table: Table) {
    if (selectedTable && selectedTable.number === table.number) {
      setSelectedTable(undefined);
    } else {
      setSelectedTable(table);
    }
  }

  function isSelected(table: Table) {
    if (!selectedTable) return false;
    return selectedTable.number === table.number;
  }

  function handleConfirm() {
    if (!selectedTable) return;
    if (selectedMenuItems.length === 0) return;

    setShowModal(true);
  }

  interface ISectionData {
    title: string;
    data: Menu[];
  }

  function transformToSections(menuItems: Menu[]): ISectionData[] {
    const sections: ISectionData[] = [];

    let allCategories: string[] = menuItems.flatMap(
      (item) => item.category
    ) as string[];

    allCategories = Array.from(new Set(allCategories));

    allCategories.forEach((category) => {
      const items = menuItems.filter((item) =>
        item.category?.includes(category)
      );
      sections.push({ title: category, data: items });
    });

    return sections;
  }

  return (
    <TemplateLayout pageName="OrderCreatePage" title="New order">
      <View style={[styles.container]}>
        <View style={{ gap: 10 }}>
          <Text style={[styles.h1, { color: theme.text }]}>Table</Text>
          <FlatList
            data={tables}
            keyExtractor={(table) => table.id}
            renderItem={({ item: table }) => (
              <TableItem
                table={table}
                toggleTable={toggleTable}
                isSelected={isSelected}
              />
            )}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 15 }}
          />
        </View>

        <View
          style={{
            marginVertical: 8,
            height: 2,
            backgroundColor: theme.text,
          }}
        />

        <View
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          <FlatList
            data={transformToSections(menuItems)}
            keyExtractor={(section) => section.title}
            renderItem={({ item: section }) => (
              <TouchableOpacity
                onPress={() => {
                  setCategory(section.title);
                }}
                style={{
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor:
                    category === section.title ? theme.accent : theme.secondary,
                  borderWidth: 2,
                }}
              >
                <Text style={[styles.h1, { color: theme.text }]}>
                  {section.title}
                </Text>
              </TouchableOpacity>
            )}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 15 }}
          />

          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <FlatList
              data={menuItems.filter((item) =>
                item.category?.includes(category)
              )}
              keyExtractor={(menuItem) => menuItem.id}
              renderItem={({ item: menuItem }) => (
                <MenuItem menuItem={menuItem} cartActions={cartActions} />
              )}
              contentContainerStyle={{ gap: 10 }}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              style={{ height: 450 }}
              numColumns={2}
            />
          </View>
        </View>

        {selectedTable && (
          <ConfirmModal
            showModal={showModal}
            setShowModal={setShowModal}
            selectedTable={selectedTable}
            selectedMenuItems={selectedMenuItems}
          />
        )}

        <FooterButtons
          cancelText="Back"
          onCancel={() => navigation.goBack()}
          onConfirm={handleConfirm}
          confirmDisabled={!selectedTable || selectedMenuItems.length === 0}
        />
      </View>
    </TemplateLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    display: "flex",
  },
  h1: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 70,
    margin: 5,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
