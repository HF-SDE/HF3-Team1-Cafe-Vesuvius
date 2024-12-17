import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Table } from "@/models/TableModels";
import { useThemeColor } from "@/hooks/useThemeColor";

interface ITableItem {
  table: Table;
  toggleTable: (table: Table) => void;
  isSelected: (table: Table) => boolean;
}

export default function TableItem({
  table,
  toggleTable,
  isSelected,
}: ITableItem) {
  const theme = useThemeColor();

  return (
    <TouchableOpacity
      onPress={() => toggleTable(table)}
      style={[
        styles.tableItem,
        {
          backgroundColor: isSelected(table) ? theme.accent : theme.primary,
          borderColor: isSelected(table) ? theme.primary : "transparent",
        },
      ]}
    >
      <Text
        style={{
          fontSize: 32,
          color: isSelected(table) ? theme.text : theme.background,
        }}
      >
        {table.number}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tableItem: {
    padding: 5,
    width: 100,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 2,
  },
});
